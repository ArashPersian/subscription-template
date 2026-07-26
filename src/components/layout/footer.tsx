import { REPO_URL } from '@/constants/project';
import type { FC } from 'react';

const FooterContent = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="inline-block flex-grow text-center text-sm text-muted-foreground lg:px-4">
        Made with ❤️ by &nbsp;
        <a className="text-primary hover:text-primary/80 transition-colors" href={REPO_URL} target="_blank" rel="noopener noreferrer">
          PasarGuard Team
        </a>
      </p>
    </div>
  );
};

export const Footer: FC = ({ ...props }) => {
  return (
    <div dir='ltr' className="relative w-full pb-8 pt-6 px-6" {...props}>
      <div className="container mx-auto max-w-7xl flex justify-center">
        <FooterContent />
      </div>
    </div>
  );
};
