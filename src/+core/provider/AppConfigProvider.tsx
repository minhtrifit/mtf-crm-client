import React, { createContext, useContext, useEffect, useState } from 'react';

interface AppConfig {
  websitePrimaryColor: string;
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
        websitePrimaryColor: '#FEB21A',
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
        const data = await mockFetchAppConfig();
        if (mounted) {
          setConfig(data);
        }
      } catch {
        if (mounted) {
          setConfig({
            websitePrimaryColor: '#fa5130', // fallback
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
