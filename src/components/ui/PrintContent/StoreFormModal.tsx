import { useEffect, useState } from 'react';
import { get } from 'lodash';
import { Card, Empty, Input, Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchList } from '@/pages/store/hooks/useSearchList';
import Label from '../Label/Label';
import Error from '@/components/ui/Error/Error';
import DataLoading from '@/components/ui/DataLoading/DataLoading';

interface PropType {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string) => Promise<void>;
}

const StoreFormModal = (props: PropType) => {
  const { open, onClose, onConfirm } = props;

  const { t } = useTranslation();

  const { data, total, loading, error, fetchData, setData, setTotal } = useSearchList();

  const [inputValue, setInputValue] = useState<string>('');
  const debouncedSearch = useDebounce(inputValue, 500);

  const handleResetValue = () => {
    setInputValue('');
  };

  const handleChooseStore = (id: string) => {
    onConfirm(id);
    setInputValue('');
    onClose();
  };

  useEffect(() => {
    if (!debouncedSearch) {
      setData([]);
      setTotal(0);
      return;
    }

    fetchData({
      q: debouncedSearch,
    });
  }, [debouncedSearch]);

  return (
    <Modal
      width={600}
      centered
      footer={null}
      open={open}
      maskClosable={false}
      onCancel={() => {
        onClose();
        handleResetValue();
      }}
    >
      <div className='w-full flex flex-col gap-5'>
        <div className='flex flex-col gap-3'>
          <Label title={t('store.name')} />
          <Input
            placeholder={t('store.name_placeholder')}
            allowClear
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        </div>

        {!loading && error && <Error />}

        {loading ? (
          <DataLoading size='large' />
        ) : (
          <>
            {total === 0 ? (
              <div className='mx-auto my-5 flex flex-col gap-5'>
                <Empty
                  description={t('store.choose_to_continue')}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              </div>
            ) : (
              <div className='w-full max-h-[300px] overflow-y-auto flex flex-col gap-2'>
                {data?.map((store) => {
                  return (
                    <Card
                      key={get(store, 'id', '')}
                      className='hover:border-primary hover:bg-zinc-100 hover:cursor-pointer'
                      onClick={() => {
                        handleChooseStore(get(store, 'id', ''));
                      }}
                    >
                      <div className='flex items-center gap-5'>
                        <div className='w-[110px] flex flex-col gap-1'>
                          <Label title={t('store.tax_code')} />
                          <span className='text-primary font-semibold text-[0.8rem]'>
                            {get(store, 'taxCode', '')}
                          </span>
                        </div>

                        <div className='w-[1px] h-[70px] bg-zinc-200' />

                        <div className='flex items-center gap-3'>
                          <div className='flex flex-col gap-1'>
                            <span className='font-semibold'>{get(store, 'name', '')}</span>
                            <span className='text-[0.8rem] text-zinc-700'>
                              {get(store, 'address', '')}
                            </span>
                            <span className='text-[0.8rem] text-zinc-700'>
                              {get(store, 'email', '')} | {get(store, 'hotline', '')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default StoreFormModal;
