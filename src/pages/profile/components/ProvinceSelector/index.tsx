import { useEffect, useState } from 'react';
import { Select, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { useProvinces } from '../../hooks/useProvinces';
import { useDistricts } from '../../hooks/useDistricts';

const { Text } = Typography;

interface LocationValue {
  provinceCode: string | null;
  districtCode: string | null;
}

interface ProvinceSelectorProps {
  value: LocationValue;
  onChange: (values: LocationValue) => void;
}

const ProvinceSelector = ({ value, onChange }: ProvinceSelectorProps) => {
  const { t } = useTranslation();
  const { provinces, loading: loadingProvinces } = useProvinces();
  const { districts, loading: loadingDistricts } = useDistricts(value.provinceCode);

  // Track internal state for smooth UX
  const [internalProvince, setInternalProvince] = useState<string | null>(value.provinceCode);
  const [internalDistrict, setInternalDistrict] = useState<string | null>(value.districtCode);

  // Sync with external value
  useEffect(() => {
    setInternalProvince(value.provinceCode);
    setInternalDistrict(value.districtCode);
  }, [value.provinceCode, value.districtCode]);

  const handleProvinceChange = (provinceCode: string) => {
    setInternalProvince(provinceCode);
    setInternalDistrict(null);
    onChange({
      provinceCode: provinceCode || null,
      districtCode: null,
    });
  };

  const handleDistrictChange = (districtCode: string) => {
    setInternalDistrict(districtCode);
    onChange({
      provinceCode: internalProvince,
      districtCode: districtCode || null,
    });
  };

  const handleProvinceClear = () => {
    setInternalProvince(null);
    setInternalDistrict(null);
    onChange({
      provinceCode: null,
      districtCode: null,
    });
  };

  const handleDistrictClear = () => {
    setInternalDistrict(null);
    onChange({
      provinceCode: internalProvince,
      districtCode: null,
    });
  };

  return (
    <>
      {/* Province Select */}
      <div className='w-full flex flex-col gap-2'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
          <span className='font-semibold my-auto'>{t('province_city')}</span>
          <Select
            value={internalProvince}
            onChange={handleProvinceChange}
            onClear={handleProvinceClear}
            placeholder={t('select_province')}
            loading={loadingProvinces}
            allowClear
            showSearch
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase()?.includes(input.toLowerCase())
            }
            options={provinces.map((province) => ({
              value: province.code,
              label: province.name,
            }))}
          />
        </div>
      </div>

      {/* District Select */}
      <div className='w-full flex flex-col gap-2'>
        <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
          <span className='font-semibold my-auto'>{t('district')}</span>
          <Select
            value={internalDistrict}
            onChange={handleDistrictChange}
            onClear={handleDistrictClear}
            placeholder={t('select_district')}
            loading={loadingDistricts}
            disabled={!internalProvince}
            allowClear
            showSearch
            optionFilterProp='children'
            filterOption={(input, option) =>
              (option?.label as string)?.toLowerCase()?.includes(input.toLowerCase())
            }
            options={districts.map((district) => ({
              value: district.code,
              label: district.name,
            }))}
          />
        </div>
        {!internalProvince && (
          <div className='grid grid-cols-1 md:grid-cols-[150px_1fr] gap-5'>
            <div></div>
            <Text type='secondary' style={{ fontSize: 12 }}>
              {t('please_select_province_first')}
            </Text>
          </div>
        )}
      </div>
    </>
  );
};

export default ProvinceSelector;
