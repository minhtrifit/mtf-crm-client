import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import Cookies from 'js-cookie';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, message, Typography } from 'antd';
import authApi from '@/+core/api/auth.api';
import { UserRole, UserType } from '@/types/auth';
import { setUser } from '@/store/actions/user.action';

const APP_KEY = import.meta.env.VITE_APP_KEY;

const { Text } = Typography;

const LoginForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const FormSchema = z.object({
    email: z
      .string()
      .min(1, { message: t('this_field_is_required') })
      .email({ message: t('invalid_email') }),
    password: z.string().min(1, { message: t('this_field_is_required') }),
  });

  type FormType = z.infer<typeof FormSchema>;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setFocus,
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: FormType) => {
    try {
      const authRes = await authApi.login(data);

      if (authRes.success) {
        message.success(authRes.message);

        const AuthUser: UserType = authRes.data;

        console.log('USER PROFILE:', AuthUser);

        // Save session to Cookies
        Cookies.set(APP_KEY, JSON.stringify(AuthUser), {
          expires: 7, // 7 ngày
          path: '/', // toàn bộ site
        });

        dispatch(setUser(AuthUser));

        if (AuthUser.role === UserRole.USER) navigate('/');
        if (AuthUser.role === UserRole.ADMIN) navigate('/admin');
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || t('auth.login_failed'));
    }
  };

  const onError = (errors: any) => {
    console.error('Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <form
      className='bg-[#FFF] p-4 pb-6 rounded-md w-[400px] max-w-[400px] flex flex-col gap-5 shadow-md
                  border-[1px] border-solid border-zinc-100'
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className='flex flex-col items-center justify-center gap-3'>
        <h3 className='my-0 text-[1.2rem]'>{t('auth.login')}</h3>
        <span className='text-[0.8rem] text-zinc-500'>{t('auth.sign_in_to_system')}</span>
      </div>

      <Controller
        control={control}
        name='email'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <label className='text-[0.95rem] font-semibold'>{t('auth.email')}</label>

              <Input
                {...field}
                placeholder={t('auth.email')}
                status={errors.email ? 'error' : ''}
              />

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
        name='password'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <label className='text-[0.95rem] font-semibold'>{t('auth.password')}</label>

              <Input.Password
                {...field}
                placeholder={t('auth.password')}
                status={errors.password ? 'error' : ''}
              />

              {errors.password && (
                <Text type='danger' style={{ fontSize: 12 }}>
                  {errors.password.message}
                </Text>
              )}
            </div>
          );
        }}
      />

      <Button htmlType='submit' type='primary' loading={isSubmitting}>
        {t('auth.login')}
      </Button>
    </form>
  );
};

export default LoginForm;
