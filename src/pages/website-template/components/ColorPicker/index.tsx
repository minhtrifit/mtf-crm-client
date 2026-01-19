import { ColorPicker as AntdColorPicker } from 'antd';
import colors from '@/+core/themes/colors';

interface PropType {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ColorPicker = ({ value, onChange, disabled }: PropType) => {
  const COLORS = ['#e30019', '#fa5230', '#FEB21A', '#3bb94c', '#1435c3'];

  return (
    <div className='w-full flex flex-col gap-5'>
      <div className='w-full flex flex-wrap items-center gap-3'>
        {COLORS.map((color) => {
          const isActive = color.toLowerCase() === value?.toLowerCase();

          return (
            <div
              key={color}
              style={{
                background: isActive ? colors.primary : '#fff',
                opacity: disabled ? 0.5 : 1,
              }}
              className='w-[45px] h-[45px] rounded-full p-1
                         transition-all
                         hover:cursor-pointer
                         hover:scale-105'
              onClick={() => {
                if (disabled) return;
                onChange(color);
              }}
            >
              <div
                style={{ background: color }}
                className='w-full h-full rounded-full border border-zinc-200'
              />
            </div>
          );
        })}

        <AntdColorPicker
          className='ml-2'
          value={value}
          disabled={disabled}
          showText
          onChange={(color) => {
            onChange(color.toHexString());
          }}
        />
      </div>
    </div>
  );
};

export default ColorPicker;
