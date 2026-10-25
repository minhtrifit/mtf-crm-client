interface PropType {
  value?: string | null;
  className?: string;
}

export const GoogleMap = (props: PropType) => {
  const { value, className } = props;

  if (!value) return null;

  const src = value.match(/<iframe[^>]*src=["']([^"']+)["']/i)?.[1];

  if (!src || !/^https:\/\/www\.google\.com\/maps\/embed\?/.test(src)) {
    return null;
  }

  return (
    <div className={className ?? 'w-full overflow-hidden rounded-lg'}>
      <iframe
        src={src}
        className='block aspect-[4/3] w-full border-0'
        allowFullScreen
        loading='lazy'
        referrerPolicy='strict-origin-when-cross-origin'
        title='Google Maps'
      />
    </div>
  );
};
