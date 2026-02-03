import { useMemo } from 'react';
import { get } from 'lodash';
import { Collapse, Skeleton } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useTranslation } from 'react-i18next';
import { useGetShowcaseFaq } from '../hooks/useShowcase';
import Error from '@/components/ui/Error/Error';
import RenderHtmlContent from '@/components/ui/RenderHtmlContent';

const WebsiteFaqPage = () => {
  const { config } = useAppConfig();
  const { t } = useTranslation();

  const { data, loading, error } = useGetShowcaseFaq();

  const formatFaqs = useMemo(() => {
    if (!data) return [];

    return data?.map((faq) => {
      return {
        key: get(faq, 'id', ''),
        label: get(faq, 'title', ''),
        children: (
          <div className='p-1'>
            <RenderHtmlContent content={get(faq, 'content', '')} />
          </div>
        ),
      };
    });
  }, [data]);

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px]'>
        <div className='w-full flex flex-col gap-5'>
          <h1 style={{ color: config?.websitePrimaryColor }} className='text-[1.5rem]'>
            {t('faq.default')}
          </h1>

          {loading ? (
            <div className='w-full flex flex-col'>
              <Skeleton.Node active style={{ height: 200, width: '100%' }} />
            </div>
          ) : (
            <Collapse
              style={{
                background: '#f0f5ff',
              }}
              items={formatFaqs}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteFaqPage;
