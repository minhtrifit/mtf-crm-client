import { Button, Input, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface PropType {
  value: number;
  min?: number;
  onChange: (value: number) => void;
}

const QuantityInput = (props: PropType) => {
  const { value, min = 1, onChange } = props;

  const handleDecrease = () => {
    onChange(Math.max(min, value - 1));
  };

  const handleIncrease = () => {
    onChange(value + 1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    if (!Number.isNaN(v)) {
      onChange(Math.max(min, v));
    }
  };

  return (
    <Space.Compact>
      <Button icon={<MinusOutlined />} onClick={handleDecrease} disabled={value <= min} />

      <Input
        value={value}
        style={{ width: 60, textAlign: 'center' }}
        onChange={handleInputChange}
      />

      <Button icon={<PlusOutlined />} onClick={handleIncrease} />
    </Space.Compact>
  );
};

export default QuantityInput;
