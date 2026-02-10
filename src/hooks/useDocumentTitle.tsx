import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TOptions } from 'i18next';

type Options = {
  withAppName?: boolean;
  tOptions?: TOptions;
};

export const useDocumentTitle = (titleKey?: string, options: Options = { withAppName: true }) => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const appName = import.meta.env.VITE_APP_NAME || 'MY APP';

  useEffect(() => {
    let title = appName;

    if (titleKey) {
      const translatedTitle = t(titleKey, options.tOptions);

      title = options.withAppName ? `${appName} - ${translatedTitle}` : translatedTitle;
    }

    document.title = title;
  }, [pathname, titleKey, appName, i18n.language, options.tOptions]);
};
