const CUSTOM_SCHEME_PATTERN = /^[a-z][a-z0-9+.-]*:\/\//i;
const BLOCKED_SCHEME_PATTERN =
  /^(javascript|data|vbscript|file|blob|about|intent|content|filesystem):/i;

const isIOS = () => {
  if (typeof navigator === 'undefined') return false;

  const userAgent = navigator.userAgent || '';
  if (/iP(ad|hone|od)/.test(userAgent)) return true;

  return navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
};

export const openAppScheme = (url: string) => {
  if (!CUSTOM_SCHEME_PATTERN.test(url) || BLOCKED_SCHEME_PATTERN.test(url)) {
    return;
  }

  if (/^https?:\/\//i.test(url) || isIOS()) {
    window.location.href = url;
    return;
  }

  const iframe = document.createElement('iframe');
  iframe.hidden = true;
  iframe.src = url;
  document.body.appendChild(iframe);

  window.setTimeout(() => {
    iframe.remove();
  }, 2000);
};
