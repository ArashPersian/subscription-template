import { Headphones, MessageCircleMore } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSupportUrl } from '@/hooks/useUserData';

export const SupportSection = () => {
  const { t } = useTranslation();
  const { supportUrl } = useSupportUrl();

  if (!supportUrl) return null;

  return (
    <section className="mt-10 sm:mt-14 animate-fadeIn" aria-labelledby="support-title">
      <div className="rounded-2xl border border-primary/25 bg-card/70 p-5 sm:p-7 overflow-hidden relative">
        <div className="absolute -top-16 -end-12 size-40 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/25 bg-primary/10 text-primary">
              <Headphones className="size-6" />
            </div>
            <div className="space-y-1.5">
              <h2 id="support-title" className="page-section-title text-lg sm:text-xl">
                {t('support.title')}
              </h2>
              <p className="page-meta max-w-2xl">
                {t('support.description')}
              </p>
            </div>
          </div>

          <a
            href={supportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <MessageCircleMore className="size-4" />
            {t('support.action')}
          </a>
        </div>
      </div>
    </section>
  );
};
