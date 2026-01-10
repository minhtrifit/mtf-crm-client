import { useMemo, useState } from 'react';
import { get, map } from 'lodash';
import { Button, Input, Table, Select, TablePaginationConfig, Tooltip } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useGetProducts } from './hooks/useGetProducts';
import { useQueryParams } from '@/hooks/useQueryParams';
import { ADD_PRODUCT_ROUTE } from '@/routes/route.constant';
import { FaEye, FaPen } from 'react-icons/fa';
import Loading from './components/Loading/Loading';

const { Column } = Table;

const ProductPage = () => {
  const LIMIT_PRODUCTS_PER_PAGE = 5;
  const TOTAL_PRODUCTS = 10;

  const options = [
    { label: `Men's Clothing`, value: `men's clothing` },
    { label: 'Jewelery', value: 'jewelery' },
    { label: 'Electronics', value: 'electronics' },
  ];

  const navigate = useNavigate();
  const { searchParams, updateParams } = useQueryParams();

  const page = searchParams.get('page') ?? 1;
  const query = searchParams.get('query') ?? '';
  const category = searchParams.get('category') ?? null;

  const [filter, setFilter] = useState({
    page: Number(page ?? 1),
    query: query ?? '',
    category: category ?? undefined,
  });

  const { data, loading, total, params, setParams } = useGetProducts({
    page: filter.page,
    search: filter.query,
    category: filter.category,
    limit: LIMIT_PRODUCTS_PER_PAGE,
  });

  const TABLE_DATA = useMemo(() => {
    if (!data) return [];

    return map(data, (item) => ({ ...item, key: item?.id }));
  }, [data]);

  const handlePageChange = (page: number) => {
    setFilter({ ...filter, page: page });
    setParams({ ...params, page: page });
    updateParams({ page: page.toString() });
  };

  const handleChangeFilter = (key: string, value: string) => {
    setFilter({
      ...filter,
      [key]: value,
    });
  };

  const handleApplyFilter = () => {
    console.log('APPLY FILTER:', filter);

    setFilter({ ...filter, page: 1 });

    setParams({
      page: 1,
      query: filter.query,
      category: filter.category,
      limit: LIMIT_PRODUCTS_PER_PAGE,
    });

    updateParams({
      page: '1',
      query: filter.query,
      category: filter.category ?? '',
    });
  };

  return (
    <div className='flex flex-col gap-5'>
      {/* Filter */}
      <div className='block__container w-full flex flex-wrap items-center justify-between gap-3'>
        <div className='flex flex-wrap items-center gap-3'>
          <Input
            style={{ width: 300 }}
            placeholder='Tìm theo tên...'
            allowClear
            value={filter.query}
            onChange={(e) => {
              handleChangeFilter('query', e.target.value);
            }}
          />

          <Select
            style={{ width: 200 }}
            placeholder='Chọn phân loại'
            showSearch
            allowClear
            options={options}
            optionFilterProp='label'
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            value={filter.category}
            onChange={(value) => {
              handleChangeFilter('category', value);
            }}
          />

          <Button
            color='primary'
            variant='solid'
            icon={<SearchOutlined />}
            onClick={handleApplyFilter}
          >
            Tìm kiếm
          </Button>
        </div>

        <Button
          color='primary'
          variant='solid'
          icon={<PlusOutlined />}
          onClick={() => {
            navigate(ADD_PRODUCT_ROUTE);
          }}
        >
          Thêm mới
        </Button>
      </div>

      {/* DataTable */}
      <div className='block__container w-full'>
        {loading ? (
          <Loading />
        ) : (
          <>
            <Table
              dataSource={TABLE_DATA}
              bordered
              scroll={{ x: 'max-content' }}
              pagination={{
                current: filter.page,
                pageSize: LIMIT_PRODUCTS_PER_PAGE,
                total: TOTAL_PRODUCTS,
              }}
              onChange={(value: TablePaginationConfig) => {
                if (value.current) handlePageChange(value.current);
              }}
            >
              <Column title='ID' dataIndex='id' key='id' width={60} align='center' />
              <Column title='Tên sản phẩm' dataIndex='title' key='title' width={400} />
              <Column title='Phân loại' dataIndex='category' key='category' width={200} />
              <Column title='Giá' dataIndex='price' key='price' width={200} />
              <Column
                title='Hình ảnh'
                dataIndex='image'
                key='image'
                width={150}
                render={(value, record) => {
                  return (
                    <div className='w-full flex items-center justify-center'>
                      <div className='w-[50px] h-[50px] flex items-center justify-center'>
                        <img
                          className='w-full h-full object-cover'
                          src={value}
                          alt={`${get(record, 'id', '')}-img`}
                        />
                      </div>
                    </div>
                  );
                }}
              />
              <Column
                title='Thao tác'
                key='action'
                width={200}
                render={(_, record) => {
                  return (
                    <div className='flex items-center gap-2'>
                      <Tooltip title='Xem chi tiết'>
                        <Button
                          color='primary'
                          variant='solid'
                          icon={<FaEye />}
                          onClick={() => {
                            navigate(`/management/products/detail/${get(record, 'id', '')}`);
                          }}
                        />
                      </Tooltip>

                      <Tooltip title='Chỉnh sửa'>
                        <Button
                          color='gold'
                          variant='solid'
                          icon={<FaPen />}
                          onClick={() => {
                            navigate(`/management/products/edit/${get(record, 'id', '')}`);
                          }}
                        />
                      </Tooltip>
                    </div>
                  );
                }}
              />
            </Table>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
