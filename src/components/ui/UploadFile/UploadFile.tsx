import React, { useEffect, useState } from 'react';
import { Upload, Image, message } from 'antd';
import { useTranslation } from 'react-i18next';
import type { UploadFile, UploadProps, RcFile } from 'antd/es/upload/interface';
import { RiUpload2Fill } from 'react-icons/ri';
import uploadApi from '@/+core/api/upload.api';

type UploadMode = 'single' | 'multiple';

interface CustomUploadProps extends Omit<UploadProps, 'onChange' | 'fileList'> {
  mode?: UploadMode;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  disabled?: boolean;
}

const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadFile: React.FC<CustomUploadProps> = ({
  mode = 'single',
  value,
  onChange,
  disabled = false,
  ...rest
}) => {
  const { t } = useTranslation();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!value) {
      setFileList([]);
      return;
    }

    if (mode === 'single' && typeof value === 'string') {
      setFileList([
        {
          uid: '-1',
          name: value.split('/').pop() || 'image',
          status: 'done',
          url: value,
        },
      ]);
    }

    if (mode === 'multiple' && Array.isArray(value)) {
      setFileList(
        value.map((url, index) => ({
          uid: String(index),
          name: url.split('/').pop() || 'image',
          status: 'done',
          url,
        })),
      );
    }
  }, [value, mode]);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as RcFile);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    if (disabled) return;

    try {
      const res = await uploadApi.single(file as RcFile);
      // BE: res.data.file.url
      onSuccess?.({
        url: res?.data?.file?.url,
      });
    } catch (err) {
      onError?.(err as Error);
    }
  };

  const handleChange: UploadProps['onChange'] = ({ file, fileList }) => {
    const newFileList = fileList.map((f) => {
      if (f.response?.url && !f.url) {
        f.url = f.response.url;
      }
      return f;
    });

    setFileList(newFileList);

    const doneFiles = newFileList.filter((f) => f.status === 'done');

    if (mode === 'single') {
      onChange?.(doneFiles[0]?.url || '');
    } else {
      onChange?.(doneFiles.map((f) => f.url!) as string[]);
    }

    if (file.status === 'error') {
      message.error(`${file.name} upload failed`);
    }
  };

  const uploadButton = (
    <button
      type='button'
      style={{ border: 0, background: 'none' }}
      className='flex flex-col items-center gap-2'
    >
      <RiUpload2Fill size={20} />
      <span className='text-[0.8rem] text-zinc-700'>{t('upload_image')}</span>
    </button>
  );

  return (
    <>
      <Upload
        {...rest}
        listType='picture-card'
        disabled={disabled}
        openFileDialogOnClick={!disabled}
        customRequest={customRequest}
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        maxCount={mode === 'single' ? 1 : undefined}
        multiple={mode === 'multiple'}
        showUploadList={{
          showRemoveIcon: !disabled,
        }}
      >
        {!disabled &&
          (mode === 'multiple' ? uploadButton : fileList.length >= 1 ? null : uploadButton)}
      </Upload>

      {/* Preview Modal */}
      {previewImage && (
        <Image
          style={{ display: 'none' }}
          src={previewImage}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible: boolean) => {
              setPreviewOpen(visible);
              if (!visible) setPreviewImage('');
            },
          }}
        />
      )}
    </>
  );
};

export default UploadFile;
