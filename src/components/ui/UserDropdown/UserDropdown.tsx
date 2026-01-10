import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Dropdown, Avatar, Typography, Space } from 'antd';
import { DownOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { clearUser } from '@/store/actions/user.action';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/auth';

const { Text } = Typography;

const UserDropdown = () => {
  const { t } = useTranslation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user: UserType | null = useSelector((state: RootState) => state.users.user);

  const handleLogOut = () => {
    dispatch(clearUser());
    navigate('/');
  };

  const items = [
    {
      key: 'logout',
      label: t('auth.logout'),
      icon: <LogoutOutlined />,
      onClick: () => handleLogOut(),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement='bottomRight'>
      <div
        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        onClick={(e) => e.preventDefault()} // tránh nhảy trang
      >
        <Space>
          <Avatar src='https://github.com/shadcn.png' />
          <Text strong>{get(user, 'fullName', '')}</Text>

          <DownOutlined className='ml-2' style={{ fontSize: '10px' }} />
        </Space>
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
