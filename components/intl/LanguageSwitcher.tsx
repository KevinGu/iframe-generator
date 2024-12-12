"use client"
import { localeWithName } from '@/i18n/routing';
import { usePathname, useRouter } from '@/app/navigation';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";
import { useLocale, useTranslations } from "next-intl";
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronDown } from "lucide-react";

export default function LanguageSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  const currentLanguage = localeWithName.find(lang => lang.code === locale)?.name || locale;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="light" 
          className={`text-sm px-3 py-2 rounded-full hover:bg-blue-100 transition-colors duration-200`}
        >
          {currentLanguage} <ChevronDown size={16} className="ml-1" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        aria-label="Select language" 
        onAction={(key) => onSelectChange(key as string)}
      >
        {localeWithName.map((lang) => (
          <DropdownItem key={lang.code} className="text-lg" >
            {lang.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
