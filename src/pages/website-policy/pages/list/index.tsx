import { get } from 'lodash';
import { Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useGetShowcasePolicy } from '../../hooks/useShowcase';
import Error from '@/components/ui/Error/Error';

const WebsitePolicyListPage = () => {
  const { config } = useAppConfig();
  const { t } = useTranslation();

  const { data, loading, error } = useGetShowcasePolicy();

  if (!loading && error) {
    return <Error />;
  }

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px]'>
        <div className='w-full flex flex-col gap-5'>
          <h1 style={{ color: config?.websitePrimaryColor }} className='text-[1.5rem]'>
            {t('policy.default')}
          </h1>

          {loading ? (
            <div className='w-full flex flex-col'>
              <Skeleton.Node active style={{ height: 200, width: '100%' }} />
            </div>
          ) : (
            <div className='w-full flex flex-col gap-5'>
              {data?.map((p) => (
                <a
                  key={get(p, 'id', '')}
                  href={`${WEBSITE_ROUTE.POLICYS}/${get(p, 'slug', '')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-[#000] hover:text-[#000] hover:underline'
                >
                  {get(p, 'title', '')}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsitePolicyListPage;
