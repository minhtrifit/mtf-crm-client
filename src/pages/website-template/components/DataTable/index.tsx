import { useMemo } from 'react';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Image, Pagination, Popconfirm, Switch, Table, Tooltip } from 'antd';
import { WebsiteTemplate } from '@/types/website_template';
import { PagingType } from '@/types';
import { formatDateTime } from '@/+core/helpers';
import { FilterType } from '../../pages/list';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { FaEye, FaPen } from 'react-icons/fa';

const { Column } = Table;

interface PropType {
  filter: FilterType;
  data: WebsiteTemplate[];
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
          title={t('website_template.name')}
          dataIndex='name'
          key='name'
          width={250}
          render={(_, record) => {
            return (
              <div className='flex items-center gap-3'>
                <Image
                  src={get(record, 'logoUrl', '')}
                  className='max-w-[100px] bg-zinc-300 p-2 rounded-sm'
                />
                <span>{get(record, 'name', '')}</span>
              </div>
            );
          }}
        />
        <Column
          title={t('website_template.brand_color')}
          dataIndex='name'
          key='name'
          width={180}
          render={(_, record) => {
            return (
              <div
                style={{ background: record?.primaryColor }}
                className={`w-[40px] h-[40px] rounded-full`}
              />
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
          title={t('status')}
          dataIndex='status'
          key='status'
          width={100}
          render={(_, record) => {
            return (
              <Popconfirm
                title={t('confirm')}
                disabled={get(record, 'isActive', false)}
                description={t('website_template.update_status')}
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
                    disabled={get(record, 'isActive', false)}
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
                      navigate(`detail/${record?.id}`);
                    }}
                  />
                </Tooltip>

                <Tooltip title={t('edit')}>
                  <Button
                    color='gold'
                    variant='solid'
                    icon={<FaPen />}
                    onClick={() => {
                      navigate(`edit/${record?.id}`);
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
