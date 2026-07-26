import { useEffect, useMemo, useState } from 'react';
import { Check, CircleHelp, Copy, ExternalLink, QrCode, Route } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { useDir } from '@/hooks/useDir';
import { useApps } from '@/hooks/useUserData';
import {
  findRoutingClientIcon,
  getIranRoutingClients,
  type IranRoutingClient,
} from '@/lib/iranRouting';

type ModalState =
  | { kind: 'guide'; client: IranRoutingClient }
  | { kind: 'qr'; client: IranRoutingClient }
  | null;

const isolateAppName = (appName: string) => `\u2068${appName}\u2069`;

const formatAppTranslation = (translation: string, appName: string) =>
  translation.split('__app__').join(isolateAppName(appName));

const RoutingClientIcon = ({
  appName,
  iconUrl,
  initials,
}: {
  appName: string;
  iconUrl: string | null;
  initials: string;
}) => {
  const [iconLoadFailed, setIconLoadFailed] = useState(false);

  useEffect(() => {
    setIconLoadFailed(false);
  }, [iconUrl]);

  if (iconUrl && !iconLoadFailed) {
    return (
      <img
        src={iconUrl}
        alt={`${appName} logo`}
        className="size-11 shrink-0 rounded-xl border border-primary/25 bg-background object-cover shadow-sm"
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setIconLoadFailed(true)}
      />
    );
  }

  return (
    <div
      aria-label={`${appName} logo fallback`}
      className="grid size-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/20 to-[var(--vip-neon)]/15 text-lg font-black text-primary"
    >
      {initials}
    </div>
  );
};

export const IranRoutingSection = () => {
  const { t } = useTranslation();
  const dir = useDir();
  const clients = useMemo(() => getIranRoutingClients(), []);
  const { apps } = useApps();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [modal, setModal] = useState<ModalState>(null);

  const handleCopy = async (client: IranRoutingClient) => {
    await copyToClipboard(client.importValue, `routing-${client.id}`);
  };

  return (
    <section className="mt-10 sm:mt-14 animate-fadeIn" aria-labelledby="iran-routing-title">
      <div className="mb-5 sm:mb-7 text-center">
        <div className="mb-3 flex items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-primary">
            <Route className="size-4" />
            <h2 id="iran-routing-title" className="text-sm font-bold sm:text-base">
              {t('routing.title')}
            </h2>
            <span aria-hidden="true">🇮🇷</span>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <p className="page-meta mx-auto max-w-3xl">
          {t('routing.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {clients.map((client) => {
          const copied = isCopied(`routing-${client.id}`);
          const iconUrl = findRoutingClientIcon(apps, client);
          const cardTitle = formatAppTranslation(
            t('routing.cardTitle'),
            client.appName,
          );
          const importLabel = formatAppTranslation(
            t('routing.import'),
            client.appName,
          );

          return (
            <article
              key={client.id}
              data-testid={`routing-card-${client.id}`}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/65 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <RoutingClientIcon
                  appName={client.appName}
                  iconUrl={iconUrl}
                  initials={client.initials}
                />
                <div>
                  <h3 className="page-item-title text-base">
                    {cardTitle}
                  </h3>
                  <span className="page-badge mt-1 inline-flex rounded-full bg-[var(--vip-neon)]/10 px-2 py-1 text-[var(--vip-neon)]">
                    {t('routing.badge')}
                  </span>
                </div>
              </div>

              <p className="page-meta min-h-10">
                {t('routing.cardDescription')}
              </p>

              {client.importKind === 'app' ? (
                <Button asChild className="mt-auto w-full gap-2">
                  <a
                    href={client.importValue}
                    data-testid={`routing-import-${client.id}`}
                    aria-label={importLabel}
                  >
                    <ExternalLink className="size-4" />
                    {importLabel}
                  </a>
                </Button>
              ) : (
                <Button
                  type="button"
                  data-testid={`routing-import-${client.id}`}
                  className="mt-auto w-full gap-2"
                  onClick={() => handleCopy(client)}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  {copied
                    ? t('routing.copied')
                    : importLabel}
                </Button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setModal({ kind: 'qr', client })}
                >
                  <QrCode className="size-4" />
                  {t('routing.qr')}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-1.5"
                  onClick={() => setModal({ kind: 'guide', client })}
                >
                  <CircleHelp className="size-4" />
                  {t('routing.guide')}
                </Button>
              </div>
            </article>
          );
        })}
      </div>

      <Dialog open={Boolean(modal)} onOpenChange={(open) => !open && setModal(null)}>
        <DialogContent dir={dir} className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
          {modal && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {modal.kind === 'qr'
                    ? formatAppTranslation(
                        t('routing.qrTitle'),
                        modal.client.appName,
                      )
                    : formatAppTranslation(
                        t('routing.guideTitle'),
                        modal.client.appName,
                      )}
                </DialogTitle>
                <DialogDescription>
                  {t(`${modal.client.guideStepsKey}.intro`)}
                </DialogDescription>
              </DialogHeader>

              {modal.kind === 'qr' ? (
                <div className="mx-auto rounded-xl bg-white p-3">
                  <QRCodeCanvas value={modal.client.importValue} size={260} level="L" />
                </div>
              ) : (
                <ol className="space-y-2 rounded-xl border bg-muted/30 p-4 text-sm">
                  {(
                    t(`${modal.client.guideStepsKey}.steps`, {
                      returnObjects: true,
                    }) as string[]
                  ).map((step, index) => (
                    <li key={step} className="flex gap-2">
                      <span className="font-bold text-primary">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
