type AppClientLike = {
  name?: string;
  import_url?: string;
};

type InitialDataLike = {
  apps?: AppClientLike[];
};

const PARAMETER_NAME = 'viptrue_open_app';
const BLOCKED_SCHEMES = new Set([
  'javascript',
  'data',
  'vbscript',
  'file',
  'blob',
  'about',
  'intent',
  'content',
  'filesystem',
]);

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const safeImportUrl = (value?: string) => {
  const raw = value?.trim();
  if (!raw) return null;

  try {
    const scheme = new URL(raw).protocol.replace(':', '').toLowerCase();
    if (!scheme || BLOCKED_SCHEMES.has(scheme)) return null;
    return raw;
  } catch {
    const match = raw.match(/^([a-z][a-z0-9+.-]*):\/\//i);
    if (!match) return null;
    const scheme = match[1]!.toLowerCase();
    return BLOCKED_SCHEMES.has(scheme) ? null : raw;
  }
};

const removeBridgeParameter = () => {
  const current = new URL(window.location.href);
  current.searchParams.delete(PARAMETER_NAME);
  window.history.replaceState({}, '', current.toString());
};

const makeOverlay = (appName: string, importUrl: string) => {
  const wrapper = document.createElement('div');
  wrapper.setAttribute('role', 'dialog');
  wrapper.setAttribute('aria-modal', 'true');
  wrapper.style.cssText = [
    'position:fixed',
    'inset:0',
    'z-index:2147483647',
    'display:grid',
    'place-items:center',
    'padding:20px',
    'background:rgba(2,6,23,.78)',
    'backdrop-filter:blur(8px)',
    'font-family:inherit',
  ].join(';');

  const card = document.createElement('div');
  card.style.cssText = [
    'width:min(420px,100%)',
    'border:1px solid rgba(148,163,184,.28)',
    'border-radius:20px',
    'padding:22px',
    'background:#0f172a',
    'color:#f8fafc',
    'box-shadow:0 24px 80px rgba(0,0,0,.5)',
    'text-align:center',
  ].join(';');

  const title = document.createElement('h2');
  title.textContent = `افزودن مستقیم به ${appName}`;
  title.style.cssText = 'margin:0 0 10px;font-size:20px;font-weight:800';

  const text = document.createElement('p');
  text.textContent = 'برای بازشدن برنامه و افزودن Subscription روی دکمه زیر بزنید.';
  text.style.cssText = 'margin:0 0 18px;line-height:1.8;color:#cbd5e1;font-size:14px';

  const openButton = document.createElement('button');
  openButton.type = 'button';
  openButton.textContent = `بازکردن ${appName}`;
  openButton.style.cssText = [
    'width:100%',
    'border:0',
    'border-radius:12px',
    'padding:13px 16px',
    'background:#db2777',
    'color:white',
    'font:inherit',
    'font-weight:800',
    'cursor:pointer',
  ].join(';');
  openButton.addEventListener('click', () => {
    window.location.href = importUrl;
  });

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = 'بستن و مشاهده صفحه اشتراک';
  closeButton.style.cssText = [
    'width:100%',
    'margin-top:10px',
    'border:1px solid rgba(148,163,184,.35)',
    'border-radius:12px',
    'padding:11px 16px',
    'background:transparent',
    'color:#e2e8f0',
    'font:inherit',
    'cursor:pointer',
  ].join(';');
  closeButton.addEventListener('click', () => wrapper.remove());

  card.append(title, text, openButton, closeButton);
  wrapper.append(card);
  document.body.append(wrapper);

  // Best-effort automatic handoff after a Telegram HTTPS button click.
  // The visible button remains as a reliable fallback when the browser blocks it.
  window.setTimeout(() => {
    try {
      window.location.href = importUrl;
    } catch {
      // Keep the manual action visible.
    }
  }, 250);
};

export const initViptrueAppBridge = () => {
  if (typeof window === 'undefined') return;

  const current = new URL(window.location.href);
  const requestedName = current.searchParams.get(PARAMETER_NAME)?.trim();
  if (!requestedName) return;

  const initial = (window as typeof window & { __INITIAL_DATA__?: InitialDataLike }).__INITIAL_DATA__;
  const apps = initial?.apps ?? [];
  const requested = normalize(requestedName);
  const app = apps.find((item) => normalize(item.name ?? '') === requested);
  const importUrl = safeImportUrl(app?.import_url);

  removeBridgeParameter();
  if (!app?.name || !importUrl) return;

  const run = () => makeOverlay(app.name!, importUrl);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
};
