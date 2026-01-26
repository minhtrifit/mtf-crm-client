import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { WEBSITE_ROUTE } from '@/routes/route.constant';
import { useAppConfig } from '@/+core/provider/AppConfigProvider';
import { ProductReviewPayload } from '@/types/product';
import { AiOutlineComment } from 'react-icons/ai';
import { Button, Input, Rate, Typography } from 'antd';
import UploadFile, { UploadFileType } from '@/components/ui/UploadFile/UploadFile';
import Label from '@/components/ui/Label/Label';
import { LuSend } from 'react-icons/lu';

const { Text } = Typography;
const { TextArea } = Input;

interface PropType {
  productId: string;
  loading: boolean;
  handleSubmitReview: (payload: ProductReviewPayload) => Promise<void>;
}

const CommentBox = (props: PropType) => {
  const { productId, loading, handleSubmitReview } = props;

  const { config } = useAppConfig();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const user = useSelector((state: RootState) => state.users.user);

  const FormSchema = z.object({
    rating: z
      .number({
        required_error: 'Vui lòng chọn đánh giá',
        invalid_type_error: 'Đánh giá không hợp lệ',
      })
      .min(1, 'Đánh giá tối thiểu là 1 sao')
      .max(5, 'Đánh giá tối đa là 5 sao'),
    imagesUrl: z.array(z.string()),
    comment: z.string().min(1, { message: t('this_field_is_required') }),
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
      rating: 5,
      imagesUrl: [],
      comment: '',
    },
  });

  const onFormSubmit = (data: FormType) => {
    console.log('✅ Dữ liệu hợp lệ:', data);
    handleSubmitReview({ ...data, productId });
    reset();
  };

  const onError = (errors: any) => {
    console.error('❌ Lỗi submit:', errors);

    const firstErrorKey = Object.keys(errors)[0];
    setFocus(firstErrorKey as any);
  };

  const handleNavigateLoginToReview = () => {
    navigate(`${WEBSITE_ROUTE.LOGIN}?website-redirect=${location.pathname}`);
  };

  if (!user) {
    return (
      <div className='w-full flex'>
        <div
          className='group mx-auto flex flex-col items-center gap-1 hover:cursor-pointer'
          onClick={handleNavigateLoginToReview}
        >
          <AiOutlineComment
            size={50}
            style={{ color: config?.websitePrimaryColor }}
            className='transition-all duration-300 group-hover:scale-105'
          />
          <span className='text-[0.9rem] text-zinc-700'>{t('login_to_review')}</span>
        </div>
      </div>
    );
  }

  return (
    <form className='w-full flex gap-5' onSubmit={handleSubmit(onFormSubmit, onError)}>
      <div className='w-full flex flex-col gap-5'>
        <div className='flex flex-wrap gap-5'>
          <Label title={t('product.quality')} />
          <Controller
            control={control}
            name='rating'
            render={({ field }) => {
              return (
                <div className='w-auto flex flex-col gap-2'>
                  <Rate
                    {...field}
                    allowClear={false}
                    count={5}
                    onChange={(value) => field.onChange(value)}
                  />

                  {errors.rating && (
                    <Text type='danger' style={{ fontSize: 12 }}>
                      {errors.rating.message}
                    </Text>
                  )}
                </div>
              );
            }}
          />
        </div>

        <Controller
          control={control}
          name='comment'
          render={({ field }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <TextArea
                  {...field}
                  placeholder={t('comment_placeholder')}
                  status={errors.comment ? 'error' : ''}
                  rows={5}
                />

                {errors.comment && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.comment.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name='imagesUrl'
          render={({ field, fieldState }) => {
            return (
              <div className='w-full flex flex-col gap-2'>
                <UploadFile
                  {...field}
                  mode='multiple'
                  error={fieldState.error ? true : false}
                  fileTypes={[UploadFileType.IMAGE]}
                />

                {errors.imagesUrl && (
                  <Text type='danger' style={{ fontSize: 12 }}>
                    {errors.imagesUrl.message}
                  </Text>
                )}
              </div>
            );
          }}
        />

        <section className='flex items-center justify-end gap-2'>
          <Button htmlType='submit' type='primary' loading={loading} icon={<LuSend />}>
            {t('send')}
          </Button>
        </section>
      </div>
    </form>
  );
};

export default CommentBox;
