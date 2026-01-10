import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='flex flex-col gap-5 items-center justify-center'>
        <h3 className='my-0'>{t('not_found_page')}</h3>

        <Button
          type='primary'
          onClick={() => {
            navigate('/');
          }}
        >
          {t('back_homepage')}
        </Button>
      </div>
    </div>
  );
}
