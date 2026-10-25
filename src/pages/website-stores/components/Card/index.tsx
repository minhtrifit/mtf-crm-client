import { t } from 'i18next';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { GoogleMap } from '@/components/ui/GoogleMap';
import { Store } from '@/types/store';

interface PropType {
  data: Store;
}

const Card = (props: PropType) => {
  const { data } = props;

  const { config } = useAppConfig();

  return (
    <div className='w-full flex flex-col gap-5'>
      <h3 className='px-4 py-2' style={{ borderLeft: `5px solid ${config?.websitePrimaryColor}` }}>
        {data.name}
      </h3>
      {data.image && <img className='w-full h-auto rounded-md' src={data.image} />}
      <ul className='w-full px-10 flex flex-col gap-3'>
        <li>
          <span className='font-semibold'>{t('store.address')}: </span>
          <span>{data.address}</span>
        </li>
        <li>
          <span className='font-semibold'>Email: </span>
          <span>{data.email}</span>
        </li>
        <li>
          <span className='font-semibold'>Hotline: </span>
          <span>{data.hotline}</span>
        </li>
      </ul>
      {data.mapLocation && <GoogleMap value={data.mapLocation} />}
    </div>
  );
};

export default Card;
