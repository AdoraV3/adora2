// components/CTA.tsx
import Link from 'next/link';

export default function CTA () {
  return (
    <section className="bg-[var(--accent)] text-xs max-w-[602px] text-white rounded-lg px-6 py-5 sm:px-8 sm:py-6 flex flex-col items-start gap-6 md:justify-between shadow-md">
      <p className="mb-4 md:mb-0 max-w-xl">
        Complete your account information by personalizing your AI agent!
      </p>
      <Link href="/">
        <div className="inline-block bg-[var(--accent-light)] px-5 py-2 rounded-md hover:bg-[var(--accent-dark)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:[var(--accent)]">
          Complete now
        </div>
      </Link>
    </section>
  );
};