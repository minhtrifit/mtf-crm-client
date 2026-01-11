import { useTranslation } from 'react-i18next';
import { BiSolidError } from 'react-icons/bi';

const Error = () => {
  const { t } = useTranslation();

  return (
    <section className='w-full flex items-center justify-center py-[50px]'>
      <div className='flex flex-col items-center gap-3'>
        <BiSolidError size={80} className='text-primary' />
        <span className='text-[1rem] text-zinc-500 font-semibold'>{t('error')}</span>
      </div>
    </section>
  );
};

export default Error;
