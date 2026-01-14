import { useMemo } from 'react';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Pagination, Popconfirm, Switch, Table, Tooltip } from 'antd';
import { Category } from '@/types/category';
import { PagingType } from '@/types';
import { formatDateTime } from '@/+core/helpers';
import { FilterType } from '@/pages/category/pages/list';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { FaEye, FaPen } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';

const { Column } = Table;

interface PropType {
  filter: FilterType;
  data: Category[];
  paging: PagingType | null;
  handlePageChange: (page: number) => void;
  handleActionItem: (name: string, value: any) => Promise<void>;
}

const DataTable = (props: PropType) => {
  const { filter, data, paging, handlePageChange, handleActionItem } = props;

  const navigate = useNavigate();
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
          title={t('category.name')}
          dataIndex='name'
          key='name'
          width={250}
          render={(_, record) => {
            return (
              <div className='flex items-center gap-3'>
                <Avatar size={50} src={get(record, 'imageUrl', '')} icon={<MdCategory />} />
                <span>{get(record, 'name', '')}</span>
              </div>
            );
          }}
        />
        <Column
          title={'Slug'}
          dataIndex='slug'
          key='slug'
          width={200}
          render={(_, record) => {
            return <span>{get(record, 'slug', '')}</span>;
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
          title={t('status')}
          dataIndex='status'
          key='status'
          width={100}
          render={(_, record) => {
            return (
              <Popconfirm
                title={t('confirm')}
                description={t('category.update_status')}
                onConfirm={() => {
                  handleActionItem('status', {
                    id: get(record, 'id', null),
                    value: !get(record, 'isActive', false),
                  });
                }}
                okText={t('yes')}
                cancelText={t('cancel')}
              >
                <span className='inline-flex cursor-pointer'>
                  <Switch
                    checked={get(record, 'isActive', false)}
                    style={{ pointerEvents: 'none' }}
                  />
                </span>
              </Popconfirm>
            );
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
                      // navigate(`detail/${record?.id}`);
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
                      // navigate(`edit/${record?.id}`);
                      handleActionItem('edit', record);
                    }}
                  />
                </Tooltip>
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
