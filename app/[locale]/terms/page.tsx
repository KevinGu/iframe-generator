'use client';

import Terms from "@/app/[locale]/terms/terms.mdx"

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 my-12">
      <div className="prose max-w-none text-justify text-wrap text-sm md:text-base">
        <Terms/>
      </div>
    </main>
  );
}
