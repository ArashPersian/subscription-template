import { useMemo, useState } from 'react';
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
import { getIranRoutingClients, type IranRoutingClient } from '@/lib/iranRouting';
import { openAppScheme } from '@/lib/openAppScheme';

type ModalState =
  | { kind: 'guide'; client: IranRoutingClient }
  | { kind: 'qr'; client: IranRoutingClient }
  | null;

export const IranRoutingSection = () => {
  const { t } = useTranslation();
  const dir = useDir();
  const clients = useMemo(() => getIranRoutingClients(), []);
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const [modal, setModal] = useState<ModalState>(null);

  const handleImport = async (client: IranRoutingClient) => {
    if (client.importKind === 'clipboard') {
      await copyToClipboard(client.importValue, `routing-${client.id}`);
      return;
    }

    openAppScheme(client.importValue);
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

          return (
            <article
              key={client.id}
              className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card/65 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-center gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-primary/25 bg-gradient-to-br from-primary/20 to-[var(--vip-neon)]/15 text-lg font-black text-primary">
                  {client.initials}
                </div>
                <div>
                  <h3 className="page-item-title text-base">
                    {t('routing.cardTitle', { app: client.appName })}
                  </h3>
                  <span className="page-badge mt-1 inline-flex rounded-full bg-[var(--vip-neon)]/10 px-2 py-1 text-[var(--vip-neon)]">
                    {t('routing.badge')}
                  </span>
                </div>
              </div>

              <p className="page-meta min-h-10">
                {t('routing.cardDescription')}
              </p>

              <Button
                type="button"
                className="mt-auto w-full gap-2"
                onClick={() => handleImport(client)}
              >
                {client.importKind === 'clipboard' ? (
                  copied ? <Check className="size-4" /> : <Copy className="size-4" />
                ) : (
                  <ExternalLink className="size-4" />
                )}
                {copied
                  ? t('routing.copied')
                  : t('routing.import', { app: client.appName })}
              </Button>

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
                    ? t('routing.qrTitle', { app: modal.client.appName })
                    : t('routing.guideTitle', { app: modal.client.appName })}
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
