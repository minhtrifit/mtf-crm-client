import { get } from 'lodash';
import { Skeleton } from 'antd';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { useParams } from 'react-router-dom';
import { useDetail } from '../../hooks/useDetail';
import RenderHtmlContent from '@/components/ui/RenderHtmlContent';

const WebsitePolicyDetailPage = () => {
  const { config } = useAppConfig();
  const params = useParams();

  const slug = params?.slug ?? '';

  const { data, loading } = useDetail(slug);

  return (
    <div className='w-full flex-1'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[50px]'>
        {loading ? (
          <div className='w-full flex flex-col gap-5'>
            <Skeleton.Node active style={{ height: 30, width: 200 }} />
            <Skeleton.Node active style={{ height: 200, width: '100%' }} />
          </div>
        ) : (
          <div className='w-full flex flex-col gap-5'>
            <h1 style={{ color: config?.websitePrimaryColor }} className='text-[1.5rem]'>
              {get(data, 'title', '')}
            </h1>

            <div className='bg-[#FFF] p-4 rounded-md'>
              <RenderHtmlContent content={get(data, 'content', '')} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitePolicyDetailPage;
