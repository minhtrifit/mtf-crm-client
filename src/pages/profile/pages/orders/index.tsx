import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProfileLayoutContextType } from '../layout';

const UserOrderPage = () => {
  const { t } = useTranslation();
  const { user } = useOutletContext<ProfileLayoutContextType>();

  console.log(user);

  return <div>UserOrderPage</div>;
};

export default UserOrderPage;
