import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useTranslation } from 'react-i18next';
import { FaTag } from 'react-icons/fa';
import { PiNotebookBold } from 'react-icons/pi';
import { TbLocationFilled } from 'react-icons/tb';
import { MdQuestionAnswer } from 'react-icons/md';
import { FaLocationDot } from 'react-icons/fa6';

const SubMenu = () => {
  const isMobile = useIsMobile(1024);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { config } = useAppConfig();

  const color = config?.websitePrimaryColor;

  const ITEMS = [
    {
      id: 'all-products',
      url: WEBSITE_ROUTE.PRODUCTS,
      title: t('headerSubMenu.all_products'),
      icon: <FaTag size={20} style={{ color }} />,
    },
    {
      id: 'all-news',
      url: WEBSITE_ROUTE.NEWS,
      title: t('headerSubMenu.all_news'),
      icon: <TbLocationFilled size={25} style={{ color }} />,
    },
    {
      id: 'policies-terms',
      url: WEBSITE_ROUTE.POLICYS,
      title: t('headerSubMenu.policies'),
      icon: <PiNotebookBold size={25} style={{ color }} />,
    },
    {
      id: 'faq',
      url: WEBSITE_ROUTE.FAQ,
      title: t('headerSubMenu.faq'),
      icon: <MdQuestionAnswer size={25} style={{ color }} />,
    },
    {
      id: 'stories',
      url: WEBSITE_ROUTE.STORES,
      title: t('headerSubMenu.stores'),
      icon: <FaLocationDot size={25} style={{ color }} />,
    },
  ];

  if (isMobile) return null;

  return (
    <div className='bg-white-900 text-[#000] shadow-sm'>
      <div className='max-w-[1200px] mx-auto px-[20px] py-[10px] flex items-center justify-start gap-2'>
        {ITEMS.map((item) => {
          return (
            <div
              key={item.id}
              className='flex flex-1 items-center gap-3 px-3 py-2 rounded-sm
                            hover:cursor-pointer hover:bg-zinc-100 transition-colors whitespace-nowrap'
              onClick={() => item.url && navigate(item.url)}
            >
              <span className='shrink-0 flex items-center'>{item.icon}</span>
              <span className='text-[0.9rem] font-semibold whitespace-nowrap'>{item.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SubMenu;
