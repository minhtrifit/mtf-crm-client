import { useEffect, useMemo, useState } from 'react';
import { get } from 'lodash';
import { Dropdown, Badge, Avatar } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useGetNotification } from '@/hooks/useGetNotification';
import { useEditNotification } from '@/hooks/useEditNotification';
import { EventType, useAdminOrders } from '@/hooks/useAdminOrders';
import { useNavigate } from 'react-router-dom';
import { INotification, NotificationType } from '@/types';
import { formatRelativeTime } from '@/+core/helpers';
import { LuMessageCircleMore } from 'react-icons/lu';
import { AiOutlineShoppingCart } from 'react-icons/ai';

interface NotificaitonType {
  key: string;
  label: React.ReactNode;
  data: INotification;
}

const NotificationDropdown = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const NOTI_LIMIT = 100;

  const { data: notifications, fetchData: fetchNotification } = useGetNotification({
    type: NotificationType.ORDER,
    limit: NOTI_LIMIT,
  });

  const { mutate: editMutate } = useEditNotification();

  const renderMessage = (data: EventType) => {
    let icon = <LuMessageCircleMore size={18} />;

    if (get(data, 'data.type') === NotificationType.ORDER) {
      icon = <AiOutlineShoppingCart size={18} />;
    }

    return {
      key: get(data, 'data.id', ''),
      data: data.data,
      label: (
        <div className='w-full py-3 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Avatar size='default' icon={icon} className='bg-primary' />
            <div className='flex flex-col'>
              <span className='font-semibold text-[0.9rem] max-w-[200px] truncate'>
                {get(data, `data.message_${i18n.language}`, '')}
              </span>
              <span className='text-gray-700 text-[0.7rem]'>
                {formatRelativeTime(get(data, 'data.createdAt', ''), i18n.language as 'vi' | 'en')}
              </span>
            </div>
          </div>

          {get(data, 'data.isSeen') === false && (
            <div className='w-[8px] h-[8px] bg-primary rounded-full'></div>
          )}
        </div>
      ),
    };
  };

  const [notiItems, setNotiItems] = useState<NotificaitonType[]>([]);

  useAdminOrders((data) => {
    setNotiItems((prev) => [renderMessage(data as EventType), ...prev]);
  });

  const formattedNotification: NotificaitonType[] = useMemo(() => {
    if (!notifications) return [];

    return notifications?.map((noti) => {
      const event: EventType = {
        message_vi: noti?.message_vi,
        message_en: noti?.message_en,
        data: noti,
      };

      const message = renderMessage(event);

      return message;
    });
  }, [notifications]);

  const getUnSeenNotification = (notis: NotificaitonType[]) => {
    if (!notis) return 0;

    return notis?.filter((n) => n?.data?.isSeen === false)?.length ?? 0;
  };

  const handleUpdateOrderNoti = async (data: INotification) => {
    navigate(`/admin/order/detail/${data.itemId}`);
    const res = await editMutate(data.id, { isSeen: true });

    if (res.success)
      fetchNotification({
        type: NotificationType.ORDER,
        limit: NOTI_LIMIT,
      });
  };

  useEffect(() => {
    setNotiItems(formattedNotification);
  }, [formattedNotification]);

  return (
    <Dropdown
      trigger={['click']}
      placement='bottomRight'
      menu={{
        items: notiItems,
        className: 'w-[300px] max-h-[300px]',
        onClick: ({ key }) => {
          console.log(key);

          const item = notiItems.find((i) => i.key === key);
          if (!item) return;

          const data = item.data;

          if (data.type === NotificationType.ORDER) handleUpdateOrderNoti(data);
        },
      }}
    >
      <div
        className='h-[64px] flex items-center justify-center'
        onClick={(e) => e.preventDefault()} // tránh nhảy trang
      >
        <Badge count={getUnSeenNotification(notiItems)} offset={[0, 0]}>
          <BellOutlined style={{ fontSize: 24, cursor: 'pointer' }} />
        </Badge>
      </div>
    </Dropdown>
  );
};

export default NotificationDropdown;
