'use client';

import Privacy from "@/app/[locale]/(main)/privacy/privacy.mdx"

export default function PrivacyPolicy() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="prose max-w-none text-justify text-wrap text-sm md:text-base">
        <Privacy/>
      </div>
    </main>
  );
}
