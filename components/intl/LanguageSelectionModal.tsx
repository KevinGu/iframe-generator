'use client';

import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Checkbox } from "@nextui-org/react";
import { useRouter, usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { localeCodes, localeWithName, defaultLocale } from '@/i18n/routing'

type SupportedLocale = typeof localeCodes[number];

interface LanguageSelectionModalProps {
  onLanguageChange?: (locale: SupportedLocale) => void;
}

const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  onLanguageChange
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale() as SupportedLocale;
  const t = useTranslations('LanguageSelection');
  const [detectedLocale, setDetectedLocale] = useState<SupportedLocale | null>(null);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const detectLanguage = (): SupportedLocale => {
      const browserLang = navigator.language.split('-')[0] as SupportedLocale;
      return localeCodes.includes(browserLang) ? browserLang : defaultLocale;
    };

    const detectedLang = detectLanguage();
    setDetectedLocale(detectedLang);

    const lastPrompt = localStorage.getItem('lastLanguagePrompt');
    const dontShowAgainSetting = localStorage.getItem('dontShowLanguagePrompt');

    if (detectedLang !== currentLocale && 
        dontShowAgainSetting !== 'true' && 
        (!lastPrompt || Date.now() - parseInt(lastPrompt) > 24 * 60 * 60 * 1000)) {
      onOpen();
      // 不在这里设置 lastLanguagePrompt
    }
  }, [currentLocale, onOpen]);

  const handleLanguageChange = (lang: SupportedLocale) => {
    const newPathname = pathname.replace(`/${currentLocale}`, `/${lang}`);
    router.push(newPathname);
    if (onLanguageChange) {
      onLanguageChange(lang);
    }
    onClose();
    localStorage.setItem('lastLanguagePrompt', Date.now().toString());
    if (dontShowAgain) {
      localStorage.setItem('dontShowLanguagePrompt', 'true');
    }
  };

  const handleCancel = () => {
    onClose();
    localStorage.setItem('lastLanguagePrompt', Date.now().toString());
    if (dontShowAgain) {
      localStorage.setItem('dontShowLanguagePrompt', 'true');
    }
  };

  const getLanguageName = (locale: SupportedLocale): string => {
    const languageEntry = localeWithName.find(l => l.code === locale);
    return languageEntry ? languageEntry.name : locale;
  };

  if (!detectedLocale) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}}
      isDismissable={false} // 防止通过点击外部或按下 Escape 键关闭对话框
      hideCloseButton={true} // 隐藏右上角的关闭按钮
      classNames={{
        base: "bg-white dark:bg-gray-800",
        header: "border-b border-gray-200 dark:border-gray-700",
        body: "text-gray-700 dark:text-gray-300",
        footer: "border-t border-gray-200 dark:border-gray-700"
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {t('title')}
          </h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {t('message', { detectedLanguage: getLanguageName(detectedLocale) })}
          </p>
          <Checkbox
            isSelected={dontShowAgain}
            onValueChange={setDontShowAgain}
            className="mt-4"
          >
            {t('dontShowAgain')}
          </Checkbox>
        </ModalBody>
        <ModalFooter>
          <Button
            onPress={handleCancel}
            className="bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            {t('cancel')}
          </Button>
          <Button
            onPress={() => handleLanguageChange(detectedLocale)}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white hover:from-indigo-600 hover:to-indigo-700 transition-colors"
          >
            {t('switchLanguage', { language: getLanguageName(detectedLocale) })}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LanguageSelectionModal;
