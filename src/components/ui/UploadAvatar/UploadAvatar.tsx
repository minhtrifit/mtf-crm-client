import { message, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import uploadApi from '@/+core/api/upload.api';
import { RiUpload2Fill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';

interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  dimension?: {
    width: number;
    height: number;
  };
}

const validateImageDimension = (
  file: File,
  dimension?: { width: number; height: number },
): Promise<void> => {
  if (!dimension) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      if (img.width !== dimension.width || img.height !== dimension.height) {
        reject({
          response: {
            data: {
              message: `Image must be ${dimension.width} x ${dimension.height}px`,
            },
          },
        });
        return;
      }

      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject({
        response: {
          data: { message: 'Invalid image file' },
        },
      });
    };

    img.src = objectUrl;
  });
};

const UploadAvatar = ({
  value,
  onChange,
  disabled = false,
  error,
  dimension,
}: AvatarUploadProps) => {
  const inputId = 'avatar-upload';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await validateImageDimension(file, dimension);
      const res = await uploadApi.single(file);
      onChange?.(res.data.file.url);
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Upload failed');
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.('');
  };

  return (
    <div className='relative w-32 h-32'>
      {value ? (
        <div className='relative w-full h-full'>
          <Image src={value} className='w-full h-full rounded-md object-cover' />

          {!disabled && (
            <button
              type='button'
              onClick={handleRemove}
              className='absolute top-1 right-1 z-10
                bg-white rounded-full w-6 h-6
                border border-zinc-400 flex items-center justify-center
                hover:bg-zinc-100'
            >
              <IoClose />
            </button>
          )}
        </div>
      ) : (
        <>
          <label
            htmlFor={inputId}
            className={`w-full h-full rounded-md
              border border-dashed flex items-center justify-center
              hover:bg-zinc-50 transition cursor-pointer
              ${error ? 'border-red-500' : 'border-zinc-400'}
            `}
          >
            <RiUpload2Fill size={24} className='text-zinc-500' />
          </label>

          {!disabled && (
            <input
              id={inputId}
              type='file'
              accept='image/*'
              onChange={handleFileChange}
              className='hidden'
            />
          )}
        </>
      )}
    </div>
  );
};

export default UploadAvatar;
