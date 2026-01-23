import { Button, Input, Space } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

interface PropType {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange: (value: number) => void;
}

const QuantityInput = (props: PropType) => {
  const { value, min = 1, max = Infinity, disabled = false, onChange } = props;

  const clamp = (v: number) => Math.min(max, Math.max(min, v));

  const handleDecrease = () => {
    if (disabled) return;
    onChange(clamp(value - 1));
  };

  const handleIncrease = () => {
    if (disabled) return;
    onChange(clamp(value + 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const v = Number(e.target.value);
    if (!Number.isNaN(v)) {
      onChange(clamp(v));
    }
  };

  return (
    <Space.Compact>
      <Button
        icon={<MinusOutlined />}
        onClick={handleDecrease}
        disabled={disabled || value <= min}
      />

      <Input
        value={value}
        style={{ width: 60, textAlign: 'center' }}
        onChange={handleInputChange}
        disabled={disabled}
      />

      <Button
        icon={<PlusOutlined />}
        onClick={handleIncrease}
        disabled={disabled || value >= max}
      />
    </Space.Compact>
  );
};

export default QuantityInput;
