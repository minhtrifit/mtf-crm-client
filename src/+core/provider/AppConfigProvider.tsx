import React, { createContext, useContext, useEffect, useState } from 'react';
import websiteTemplateApi from '../api/website_template.api';

export interface AppConfig {
  templateId: string;
  logo: string;
  websitePrimaryColor: string;
  banners: string[];
  email: string;
  phone: string;
  footerDescription: string;
}

interface AppConfigContextType {
  config: AppConfig | null;
  loading: boolean;
}

const AppConfigContext = createContext<AppConfigContextType | null>(null);

export const useAppConfig = () => {
  const ctx = useContext(AppConfigContext);
  if (!ctx) throw new Error('useAppConfig must be used inside AppConfigProvider');
  return ctx;
};

// 🔹 Mock API
const mockFetchAppConfig = (): Promise<AppConfig> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        templateId: '',
        logo: '',
        websitePrimaryColor: '#FEB21A',
        banners: [],
        email: '',
        phone: '',
        footerDescription: '',
      });
    }, 1000);
  });
};

export function AppConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchConfig = async () => {
      try {
        const res = await websiteTemplateApi.getShowcase();
        const data = res?.data?.data ?? null;

        const config: AppConfig = {
          templateId: data?.id,
          logo: data?.logoUrl,
          websitePrimaryColor: data?.primaryColor,
          banners: data?.bannersUrl,
          email: data?.email,
          phone: data?.phone,
          footerDescription: data?.footerDescription,
        };

        if (mounted) {
          setConfig(config);
        }
      } catch {
        if (mounted) {
          setConfig({
            templateId: '',
            logo: '',
            websitePrimaryColor: '#fa5130', // fallback
            banners: [],
            email: '',
            phone: '',
            footerDescription: '',
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchConfig();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppConfigContext.Provider value={{ config, loading }}>{children}</AppConfigContext.Provider>
  );
}
