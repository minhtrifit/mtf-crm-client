import { useMemo } from 'react';
import { get } from 'lodash';
import { useTranslation } from 'react-i18next';
import { Button, Pagination, Popconfirm, Table, Tooltip } from 'antd';
import { Faq } from '@/types/faq';
import { FilterType } from '../../pages/list';
import { PagingType } from '@/types';
import { formatDateTime, truncateEditorText } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { FaEye, FaPen, FaTrash } from 'react-icons/fa';

const { Column } = Table;

interface PropType {
  filter: FilterType;
  data: Faq[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleActionItem: (name: string, value: any) => Promise<void>;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleActionItem } = props;

  const { t } = useTranslation();

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return data?.map((item) => {
      return { ...item, key: item?.id };
    });
  }, [data]);

  return (
    <section className='block__container flex flex-col gap-[20px]'>
      <Table dataSource={TABLE_DATA} pagination={false} bordered scroll={{ x: 'max-content' }}>
        <Column
          title='#'
          key='index'
          width={60}
          align='center'
          render={(_, __, index) => (filter.page - 1) * DEFAULT_PAGE_SIZE + index + 1}
        />
        <Column
          title={t('faq.title')}
          dataIndex='title'
          key='title'
          width={300}
          minWidth={300}
          render={(_, record) => {
            return <span>{get(record, 'title', '')}</span>;
          }}
        />
        <Column
          title={t('faq.content')}
          dataIndex='content'
          key='content'
          width={200}
          minWidth={200}
          render={(_, record) => {
            return (
              <span className='w-[100px] truncate'>
                {truncateEditorText(get(record, 'content', ''), 50)}
              </span>
            );
          }}
        />
        <Column
          title={t('createdAt')}
          dataIndex='createdAt'
          key='createdAt'
          width={200}
          render={(_, record) => {
            return <span>{formatDateTime(get(record, 'createdAt', ''))}</span>;
          }}
        />
        <Column
          title={t('updatedAt')}
          dataIndex='updatedAt'
          key='updatedAt'
          width={200}
          render={(_, record) => {
            return <span>{formatDateTime(get(record, 'updatedAt', ''))}</span>;
          }}
        />
        <Column
          title={t('action')}
          key='action'
          width={100}
          fixed='right'
          render={(_, record) => {
            return (
              <div className='flex items-center gap-2'>
                <Tooltip title={t('detail')}>
                  <Button
                    color='primary'
                    variant='solid'
                    icon={<FaEye />}
                    onClick={() => {
                      handleActionItem('detail', record);
                    }}
                  />
                </Tooltip>

                <Tooltip title={t('edit')}>
                  <Button
                    color='gold'
                    variant='solid'
                    icon={<FaPen />}
                    onClick={() => {
                      handleActionItem('edit', record);
                    }}
                  />
                </Tooltip>

                <Popconfirm
                  title={t('confirm')}
                  description={t('faq.delete_confirm')}
                  onConfirm={() => handleActionItem('delete', record)}
                  okText={t('yes')}
                  cancelText={t('cancel')}
                >
                  <Button danger type='primary' icon={<FaTrash />} />
                </Popconfirm>
              </div>
            );
          }}
        />
      </Table>

      <div className='flex items-center justify-between'>
        <span>
          {get(paging, 'total_item', 0)}/{get(paging, 'total', 0)}
        </span>

        <Pagination
          showSizeChanger={false}
          current={filter.page}
          pageSize={DEFAULT_PAGE_SIZE}
          total={get(paging, 'total', 0)}
          onChange={handlePageChange}
        />
      </div>
    </section>
  );
};

export default DataTable;
