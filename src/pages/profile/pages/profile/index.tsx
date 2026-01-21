import { message } from 'antd';
import { ProfileLayoutContextType } from '../layout';
import { UpdatePayload } from '@/types/auth';
import { useOutletContext } from 'react-router-dom';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { FormSkeleton } from '../../components/Skeleton';
import ProfileForm from '../../components/ProfileForm';

const UserProfilePage = () => {
  const { user, profileLoading, getProfile } = useOutletContext<ProfileLayoutContextType>();
  const { mutate, loading } = useUpdateProfile();

  const handleUpdateProfile = async (payload: UpdatePayload) => {
    const res = await mutate(user?.id, payload);

    if (res.success) {
      message.success(res.message);
      getProfile(user?.id);
    }
  };

  if (profileLoading) {
    return <FormSkeleton />;
  }

  return <ProfileForm user={user} loading={loading} handleSubmitForm={handleUpdateProfile} />;
};

export default UserProfilePage;
