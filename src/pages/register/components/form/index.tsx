import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useQueryParams } from '@/hooks/useQueryParams';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button, message, Typography } from 'antd';
import authApi from '@/+core/api/auth.api';
import { RegisterPayload, UserRole } from '@/types/auth';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import Label from '@/components/ui/Label/Label';

const { Text } = Typography;

const ADMIN_CODE = import.meta.env.VITE_ADMIN_CODE;

const RegisterForm: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchParams } = useQueryParams();

  const websiteRedirect = searchParams.get('website-redirect') ?? '';
  const admincode = searchParams.get('admin-code') ?? '';

  const FormSchema = z
    .object({
      email: z
        .string()
        .min(1, { message: t('this_field_is_required') })
        .email({ message: t('invalid_email') }),
      fullName: z.string().min(1, { message: t('this_field_is_required') }),
      phone: z.string(),
      address: z.string(),
      password: z.string().min(1, { message: t('this_field_is_required') }),
      confirmPassword: z.string().min(1, { message: t('this_field_is_required') }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('auth.password_not_match'),
      path: ['confirmPassword'],
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
      fullName: '',
      phone: '',
      address: '',
      password: '',
      confirmPassword: '',
    },
  });

  const getLoginUrl = () => {
    if (websiteRedirect === '') return WEBSITE_ROUTE.LOGIN;

    return `${WEBSITE_ROUTE.LOGIN}?website-redirect=${websiteRedirect}`;
  };

  const onSubmit = async (data: FormType) => {
    try {
      const payload: RegisterPayload = {
        email: data.email,
        fullName: data.fullName,
        password: data.password,
        phone: data.phone,
        address: data.address,
      };

      // Admin account create (trick)
      if (admincode) {
        if (admincode !== ADMIN_CODE) {
          message.error('WRONG ADMIN CODE');
          return;
        }

        const res = await authApi.createUser({
          ...payload,
          role: UserRole.ADMIN,
          adminCode: admincode,
        });

        if (res.success) {
          message.success(res.message);

          if (websiteRedirect === '') navigate(WEBSITE_ROUTE.LOGIN);
          else navigate(`${WEBSITE_ROUTE.LOGIN}?website-redirect=${websiteRedirect}`);
        }
      } else {
        // Normal flow: register user
        const res = await authApi.register(payload);

        if (res.success) {
          message.success(res.message);

          if (websiteRedirect === '') navigate(WEBSITE_ROUTE.LOGIN);
          else navigate(`${WEBSITE_ROUTE.LOGIN}?website-redirect=${websiteRedirect}`);
        }
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || t('auth.register_failed'));
    }
  };

  const onError = (errors: any) => {
    console.error('Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  return (
    <form
      className='bg-[#FFF] p-4 pb-6 rounded-md w-[90%] md:w-[500px] flex flex-col gap-5 shadow-md
                  border-[1px] border-solid border-zinc-100'
      onSubmit={handleSubmit(onSubmit, onError)}
    >
      <div className='flex flex-col items-center justify-center gap-3'>
        <h3 className='my-0 text-[1.2rem]'>{t('auth.register')}</h3>
        <span className='text-[0.8rem] text-zinc-500'>{t('auth.sign_up_system')}</span>
      </div>

      <Controller
        control={control}
        name='email'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <Label title={t('auth.email')} required />

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
        name='fullName'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <Label title={t('auth.fullName')} required />

              <Input
                {...field}
                placeholder={t('auth.fullName')}
                status={errors.fullName ? 'error' : ''}
              />

              {errors.fullName && (
                <Text type='danger' style={{ fontSize: 12 }}>
                  {errors.fullName.message}
                </Text>
              )}
            </div>
          );
        }}
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
        <Controller
          control={control}
          name='phone'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <Label title={t('auth.phone')} />

                <Input
                  {...field}
                  placeholder={t('auth.phone')}
                  status={errors.phone ? 'error' : ''}
                />

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
                <Label title={t('auth.address')} />

                <Input
                  {...field}
                  placeholder={t('auth.address')}
                  status={errors.address ? 'error' : ''}
                />

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

      <Controller
        control={control}
        name='password'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <Label title={t('auth.password')} required />

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

      <Controller
        control={control}
        name='confirmPassword'
        render={({ field }) => {
          return (
            <div className='w-full flex flex-col gap-2'>
              <Label title={t('auth.confirm_password')} required />

              <Input.Password
                {...field}
                placeholder={t('auth.confirm_password')}
                status={errors.confirmPassword ? 'error' : ''}
              />

              {errors.confirmPassword && (
                <Text type='danger' style={{ fontSize: 12 }}>
                  {errors.confirmPassword.message}
                </Text>
              )}
            </div>
          );
        }}
      />

      <div className='flex items-center justify-center'>
        <span className='text-zinc-700 text-[0.8rem] text-center'>
          {t('auth.already_have_account')} <Link to={getLoginUrl()}>{t('auth.login')}</Link>
        </span>
      </div>

      <Button htmlType='submit' type='primary' loading={isSubmitting}>
        {t('auth.register')}
      </Button>
    </form>
  );
};

export default RegisterForm;
