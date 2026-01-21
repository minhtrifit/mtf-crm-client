import { useEffect } from 'react';
import { Button, Input, message, Typography } from 'antd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { ProfileLayoutContextType } from '../layout';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUpdateProfile } from '../../hooks/useUpdateProfile';
import { LuSend } from 'react-icons/lu';
import UploadAvatar from '@/components/ui/UploadAvatar/UploadAvatar';

const { Text } = Typography;

const UserProfilePage = () => {
  const { t } = useTranslation();
  const { user, getProfile } = useOutletContext<ProfileLayoutContextType>();
  const { mutate, loading } = useUpdateProfile();

  const FormSchema = z.object({
    fullName: z.string().min(1, { message: t('this_field_is_required') }),
    email: z
      .string()
      .min(1, { message: t('this_field_is_required') })
      .email({ message: t('invalid_email') }),
    phone: z.string(),
    address: z.string(),
    avatar: z.string(),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors },
    setFocus,
    reset,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: user?.fullName,
      email: user?.email,
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      avatar: user?.avatar ?? '',
    },
  });

  const onFormSubmit = async (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);

    const res = await mutate(user?.id, data);

    if (res.success) {
      message.success(res.message);
      getProfile(user?.id);
    }
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  useEffect(() => {
    reset({
      fullName: user?.fullName,
      email: user?.email,
      phone: user?.phone ?? '',
      address: user?.address ?? '',
      avatar: user?.avatar ?? '',
    });
  }, [user]);

  return (
    <form
      className='w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5'
      onSubmit={handleSubmit(onFormSubmit, onError)}
    >
      <div className='w-ful flex items-center justify-center'>
        <Controller
          control={control}
          name='avatar'
          render={({ field, fieldState }) => {
            return (
              <div className='w-full flex flex-col items-center gap-2'>
                <UploadAvatar {...field} error={fieldState.error ? true : false} />

                {errors.avatar && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.avatar.message}
                  </Text>
                )}
              </div>
            );
          }}
        />
      </div>

      <div className='w-full flex flex-col gap-5'>
        <Controller
          control={control}
          name='email'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
                  <span className='font-semibold my-auto'>{t('auth.email')}</span>

                  <Input
                    {...field}
                    disabled
                    placeholder={t('auth.email')}
                    status={errors.email ? 'error' : ''}
                  />
                </div>

                {errors.email && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.email.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name='fullName'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
                  <span className='font-semibold my-auto'>{t('auth.fullName')}</span>

                  <Input
                    {...field}
                    placeholder={t('auth.fullName')}
                    status={errors.fullName ? 'error' : ''}
                  />
                </div>

                {errors.fullName && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.fullName.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name='phone'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
                  <span className='font-semibold my-auto'>{t('auth.phone')}</span>

                  <Input
                    {...field}
                    placeholder={t('auth.phone')}
                    status={errors.phone ? 'error' : ''}
                  />
                </div>

                {errors.phone && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.phone.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name='address'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
                  <span className='font-semibold my-auto'>{t('auth.address')}</span>

                  <Input
                    {...field}
                    placeholder={t('auth.address')}
                    status={errors.address ? 'error' : ''}
                  />
                </div>

                {errors.address && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.address.message}
                  </Text>
                )}
              </div>
            );
          }}
        />
      </div>

      <section className='col-span-full flex items-center justify-end gap-2'>
        <Button htmlType='submit' type='primary' loading={loading} icon={<LuSend />}>
          {t('save')}
        </Button>
      </section>
    </form>
  );
};

export default UserProfilePage;
