import { useMemo } from 'react';
import { get } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Avatar, Button, Pagination, Table, Tooltip } from 'antd';
import { UserRole } from '@/types/auth';
import { Customer } from '@/types/customer';
import { PagingType } from '@/types';
import { FilterType } from '../../page/list';
import { formatDateTime } from '@/+core/helpers';
import { DEFAULT_PAGE_SIZE } from '@/+core/constants/commons.constant';
import { FaEye, FaPen, FaUser } from 'react-icons/fa';

const { Column } = Table;

interface PropType {
  filter: FilterType;
  data: Customer[];
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
          title={t('customer.default')}
          dataIndex='user'
          key='user'
          render={(_, record) => {
            return (
              <div className='flex items-center gap-3'>
                <Avatar
                  size={50}
                  src={get(record, 'avatar', '')}
                  icon={<FaUser size={18} />}
                  className={`${!get(record, 'avatar', '') && 'bg-primary'}`}
                />

                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>{get(record, 'fullName', '')}</span>
                </div>
              </div>
            );
          }}
        />
        <Column
          title={t('auth.phone')}
          dataIndex='phone'
          key='phone'
          render={(_, record) => {
            return <span>{get(record, 'phone', 0)}</span>;
          }}
        />
        <Column
          title={t('auth.email')}
          dataIndex='email'
          key='email'
          render={(_, record) => {
            return <span>{get(record, 'email', 0)}</span>;
          }}
        />
        <Column
          title={t('auth.address')}
          dataIndex='address'
          key='address'
          render={(_, record) => {
            return <span>{get(record, 'address', 0)}</span>;
          }}
        />
        <Column
          title={t('createdAt')}
          dataIndex='createdAt'
          key='createdAt'
          render={(_, record) => {
            return <span>{formatDateTime(get(record, 'createdAt', ''))}</span>;
          }}
        />
        <Column
          title={t('updatedAt')}
          dataIndex='updatedAt'
          key='updatedAt'
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
                {/* <Tooltip title={t('detail')}>
                  <Button
                    color='primary'
                    variant='solid'
                    icon={<FaEye />}
                    onClick={() => {
                      navigate(`detail/${record?.id}`);
                    }}
                  />
                </Tooltip> */}

                <Tooltip title={t('edit')}>
                  <Button
                    color='gold'
                    variant='solid'
                    icon={<FaPen />}
                    onClick={() => {
                      //   navigate(`edit/${record?.id}`);
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
