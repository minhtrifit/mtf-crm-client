import { message, Image } from 'antd';
import { useTranslation } from 'react-i18next';
import uploadApi from '@/+core/api/upload.api';
import { RiUpload2Fill } from 'react-icons/ri';
import { IoClose } from 'react-icons/io5';

interface PropType {
  mode?: 'single' | 'multiple';
  value?: string | string[];
  error?: boolean;
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
}

const UploadFile = (props: PropType) => {
  const { mode = 'single', value, error, onChange, disabled = false, ...rest } = props;

  const { t } = useTranslation();

  const urls = Array.isArray(value) ? value : value ? [value] : [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const files = e.target.files;

    if (!files || files.length === 0) return;

    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const res = await uploadApi.single(files[i]);
        uploadedUrls.push(res.data.file.url);
      }

      let newValue: string | string[];

      if (mode === 'single') {
        newValue = uploadedUrls[0];
      } else {
        newValue = [...urls, ...uploadedUrls];
      }

      onChange?.(newValue);
    } catch (err) {
      message.error('Upload failed');
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
            <Image src={url} width={100} height={100} />
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
