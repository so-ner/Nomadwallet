'use client';

import TopAreaSub from '@/component/top_area/TopAreaSub';

interface TermsIframeViewProps {
  url: string;
  title: string;
  onBack: () => void;
  isModal?: boolean;
}

export default function TermsIframeView({ url, title, onBack, isModal = false }: TermsIframeViewProps) {
  const containerClassName = isModal
    ? 'fixed inset-0 z-[100] flex flex-col bg-white md:left-1/2 md:right-auto md:w-[600px] md:-translate-x-1/2'
    : 'flex flex-col h-screen bg-white overflow-hidden';

  return (
    <div className={containerClassName}>
      <TopAreaSub text={title} onBack={onBack} />
      <main className="flex-1 bg-grayscale-200 overflow-hidden">
        <iframe
          src={url}
          className="w-full h-full border-0"
          title={title}
          style={{ height: '100%' }}
        />
      </main>
    </div>
  );
}

