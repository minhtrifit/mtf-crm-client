interface PropType {
  primaryColor: string;
  logoUrl: string;
}

const PreviewForm = (props: PropType) => {
  const { primaryColor, logoUrl } = props;

  return (
    <div className='sticky top-[100px] self-start flex flex-col gap-5 bg-[#FFF]'>
      <header style={{ background: primaryColor }} className='p-2'>
        <div className='w-full max-w-[80%] mx-auto flex items-center justify-between gap-5'>
          {logoUrl ? (
            <img src={logoUrl} className='h-[20px]' />
          ) : (
            <div className='w-[20px] h-[20px] bg-[#FFF] rounded-sm' />
          )}

          <div className='w-[120px] h-[20px] bg-[#FFF] rounded-sm' />

          <div className='w-[50px] h-[20px] bg-[#FFF] rounded-sm' />
        </div>
      </header>

      <section className='w-full max-w-[80%] mx-auto flex gap-3'>
        <div className='w-[20%] h-[100px] bg-zinc-200 rounded-md' />
        <div className='w-[80%] h-[100px] bg-zinc-200 rounded-md' />
      </section>

      <section className='w-full max-w-[80%] mx-auto flex flex-col gap-3'>
        <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />

        <div className='grid grid-cols-4 gap-3'>
          <div className='h-[80px] bg-zinc-200 rounded-md' />
          <div className='h-[80px] bg-zinc-200 rounded-md' />
          <div className='h-[80px] bg-zinc-200 rounded-md' />
          <div className='h-[80px] bg-zinc-200 rounded-md' />
        </div>
      </section>

      <section className='w-full max-w-[80%] mx-auto flex flex-col gap-3'>
        <div className='w-[100px] h-[15px] bg-zinc-200 rounded-md' />

        <div className='grid grid-cols-4 gap-3'>
          <div className='h-[80px] bg-zinc-200 rounded-md' />
          <div className='h-[80px] bg-zinc-200 rounded-md' />
          <div className='h-[80px] bg-zinc-200 rounded-md' />
          <div className='h-[80px] bg-zinc-200 rounded-md' />
        </div>
      </section>

      <footer style={{ background: primaryColor }} className='flex flex-col gap-3 p-2'>
        <div className='w-full max-w-[80%] mx-auto grid grid-cols-5 gap-3'>
          <div className='h-[80px] bg-[#FFF] rounded-md' />
          <div className='h-[60px] bg-[#FFF] rounded-md' />
          <div className='h-[50px] bg-[#FFF] rounded-md' />
        </div>

        <div className='w-full flex flex-col gap-3 items-center'>
          <div className='w-[80%] h-[10px] bg-[#FFF] rounded-md' />
          <div className='w-[50%] h-[10px] bg-[#FFF] rounded-md' />
        </div>
      </footer>
    </div>
  );
};

export default PreviewForm;
