import { useState } from 'react';
import { get } from 'lodash';
import { Dropdown, Badge, Avatar } from 'antd';
import { BellOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useNavigate } from 'react-router-dom';
import { INotification, NotificationType } from '@/types';
import { formatRelativeTime } from '@/+core/helpers';

interface NotificaitonType {
  key: string;
  label: React.ReactNode;
  data: INotification;
}

const NotificationDropdown = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const [notiItems, setNotiItems] = useState<NotificaitonType[]>([]);

  useAdminOrders((data) => {
    setNotiItems((prev) => [
      ...prev,
      {
        key: get(data, 'data.id', ''),
        data: data.data,
        label: (
          <div className='w-full py-3 flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <Avatar size='default' icon={<UserOutlined />} />
              <div className='flex flex-col'>
                <span className='font-semibold text-[0.9rem] max-w-[200px] truncate'>
                  {get(data, `data.message_${i18n.language}`, '')}
                </span>
                <span className='text-gray-700 text-[0.7rem]'>
                  {formatRelativeTime(
                    get(data, 'data.createdAt', ''),
                    i18n.language as 'vi' | 'en',
                  )}
                </span>
              </div>
            </div>

            <div className='w-[8px] h-[8px] bg-primary rounded-full'></div>
          </div>
        ),
      },
    ]);
  });

  return (
    <Dropdown
      trigger={['click']}
      placement='bottomRight'
      menu={{
        items: notiItems,
        className: 'w-[300px]',
        onClick: ({ key }) => {
          console.log(key);

          const item = notiItems.find((i) => i.key === key);
          if (!item) return;

          const data = item.data;

          if (data.type === NotificationType.ORDER) {
            navigate(`/admin/order/detail/${data.itemId}`);
          }
        },
      }}
    >
      <div
        className='h-[64px] flex items-center justify-center'
        onClick={(e) => e.preventDefault()} // tránh nhảy trang
      >
        <Badge count={notiItems.length} offset={[0, 0]}>
          <BellOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
