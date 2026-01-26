import { message, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import uploadApi from '@/+core/api/upload.api';
import { RiUpload2Fill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';

export enum UploadFileType {
  IMAGE = 'image',
  PDF = 'pdf',
  WORD = 'word',
  EXCEL = 'excel',
  POWERPOINT = 'powerpoint',
  TEXT = 'text',
}

const UPLOAD_ACCEPT_MAP: Record<UploadFileType, string> = {
  [UploadFileType.IMAGE]: 'image/*',

  [UploadFileType.PDF]: 'application/pdf',

  [UploadFileType.WORD]:
    'application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',

  [UploadFileType.EXCEL]:
    'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

  [UploadFileType.POWERPOINT]:
    'application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation',

  [UploadFileType.TEXT]: 'text/plain',
};

interface PropType {
  mode?: 'single' | 'multiple';
  value?: string | string[];
  error?: boolean;
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
  dimension?: {
    width: number;
    height: number;
  };
  fileTypes?: UploadFileType[];
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

      console.log({ width: img.width, height: img.height });

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
          data: {
            message: 'Invalid image file',
          },
        },
      });
    };

    img.src = objectUrl;
  });
};

const validateFileType = (file: File, accept?: string) => {
  if (!accept) return;

  const accepted = accept.split(',');

  const isValid = accepted.some((type) => {
    if (type.endsWith('/*')) {
      return file.type.startsWith(type.replace('/*', ''));
    }

    return file.type === type;
  });

  if (!isValid) {
    throw {
      response: {
        data: {
          message: `File type not allowed: ${file.name}`,
        },
      },
    };
  }
};

const UploadFile = (props: PropType) => {
  const {
    mode = 'single',
    value,
    error,
    onChange,
    disabled = false,
    dimension,
    fileTypes,
    ...rest
  } = props;

  const { t } = useTranslation();

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const accept = fileTypes?.length
    ? fileTypes.map((t) => UPLOAD_ACCEPT_MAP[t]).join(',')
    : undefined;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = e.target.files;

    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        validateFileType(file, accept);

        // Validate dimension when type is IMAGE
        if (file.type.startsWith('image/')) {
          await validateImageDimension(file, dimension);
        }

        const res = await uploadApi.single(file);
        uploadedUrls.push(res.data.file.url);
      }

      let newValue: string | string[];

      if (mode === 'single') {
        newValue = uploadedUrls[0];
      } else {
        newValue = [...urls, ...uploadedUrls];
      }

      onChange?.(newValue);
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Upload failed');
    }
  };

  const handleRemove = (index: number) => {
    if (disabled) return;
    if (mode === 'single') {
      onChange?.('');
    } else {
      const newUrls = [...urls];
      newUrls.splice(index, 1);
      onChange?.(newUrls);
    }
  };

  return (
    <div className='flex flex-col gap-2'>
      {/* Upload button */}
      {!disabled && (mode === 'multiple' || urls.length === 0) && (
        <label
          className={`flex flex-col items-center gap-2 cursor-pointer border border-dashed p-4 rounded
                      hover:bg-zinc-50 transition-colors duration-200
                      ${error ? 'border-red-500' : 'border-zinc-400'}
                    `}
        >
          <RiUpload2Fill size={24} />
          <span className='text-sm text-zinc-700'>{t('upload_image')}</span>
          <input
            {...rest}
            type='file'
            accept={accept}
            multiple={mode === 'multiple'}
            onChange={handleFileChange}
            className='hidden'
          />
        </label>
      )}

      {/* Render images */}
      <div className='flex gap-2 flex-wrap'>
        {urls.map((url, idx) => (
          <div key={idx} className='relative'>
            <Image src={url} width={100} height={100} className='object-cover' />
            {!disabled && (
              <button
                type='button'
                onClick={() => handleRemove(idx)}
                className='absolute top-0 right-0 bg-[#FFF] rounded-full w-6 h-6
                            border-[1px] border-solid border-zinc-500
                            hover:bg-zinc-100 hover:cursor-pointer transition-colors duration-200
                            flex items-center justify-center text-xs'
              >
                <IoClose />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadFile;
