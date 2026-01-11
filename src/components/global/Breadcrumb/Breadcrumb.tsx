import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ADMIN_ROUTE } from '@/routes/route.constant';

const Breadcrumb = () => {
  const { t } = useTranslation();
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);

  const NO_LINK_SEGMENTS = ['edit', 'detail'];

  const crumbs = segments
    .map((segment, index) => {
      const prevSegment = segments[index - 1];

      // admin
      if (segment === 'admin') {
        return {
          label: t('breadcrumb.admin'),
          to: ADMIN_ROUTE.HOME,
          clickable: true,
        };
      }

      // BỎ ID nếu đứng sau detail / edit
      if (prevSegment && NO_LINK_SEGMENTS.includes(prevSegment)) {
        return null;
      }

      // edit / detail: chỉ label, không link
      if (NO_LINK_SEGMENTS.includes(segment)) {
        return {
          label: t(`breadcrumb.${segment}`, segment),
          to: '',
          clickable: false,
        };
      }

      // bình thường
      return {
        label: t(`breadcrumb.${segment}`, segment),
        to: '/' + segments.slice(0, index + 1).join('/'),
        clickable: true,
      };
    })
    .filter(Boolean) as {
    label: string;
    to: string;
    clickable: boolean;
  }[];

  return (
    <nav className='relative flex items-center text-sm text-gray-600'>
      <Link to={ADMIN_ROUTE.HOME} className='relative z-[10]'>
        <div className='bg-primary rounded-full w-[50px] h-[50px] flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='25'
            height='24'
            viewBox='0 0 25 24'
            fill='none'
          >
            <path
              d='M3.5 12L5.5 10M5.5 10L12.5 3L19.5 10M5.5 10V20C5.5 20.5523 5.94772 21 6.5 21H9.5M19.5 10L21.5 12M19.5 10V20C19.5 20.5523 19.0523 21 18.5 21H15.5M9.5 21C10.0523 21 10.5 20.5523 10.5 20V16C10.5 15.4477 10.9477 15 11.5 15H13.5C14.0523 15 14.5 15.4477 14.5 16V20C14.5 20.5523 14.9477 21 15.5 21M9.5 21H15.5'
              stroke='white'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </div>
      </Link>

      <div
        className='absolute left-[40px] bg-white
                   shadow-[2px_2px_5px_0_rgba(0,0,0,0.15)]
                   flex items-center gap-[10px]
                   px-[20px] py-[10px]
                   rounded-r-[50px]'
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;

          return (
            <span key={index} className='flex items-center gap-2'>
              {index !== 0 && (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='7'
                  height='10'
                  viewBox='0 0 7 10'
                  fill='none'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M0.969667 0.469667C1.2626 0.176777 1.7374 0.176777 2.0303 0.469667L6.0303 4.4697C6.3232 4.7626 6.3232 5.2374 6.0303 5.5303L2.0303 9.5303C1.7374 9.8232 1.2626 9.8232 0.969667 9.5303C0.676777 9.2374 0.676777 8.7626 0.969667 8.4697L4.4393 5L0.969667 1.53033C0.676777 1.23744 0.676777 0.762558 0.969667 0.469667Z'
                    fill='#868E95'
                  />
                </svg>
              )}

              {isLast || !crumb.clickable ? (
                <span className='text-zinc-900 font-medium'>{crumb.label}</span>
              ) : (
                <Link
                  to={crumb.to}
                  className='font-medium text-zinc-500 hover:text-primary transition'
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumb;
