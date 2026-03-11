import Image from 'next/image';

export const LogoIcon = () => {
  return (
    <Image
      src='/assets/logo/logo-icon.jpg'
      alt='Logo icon'
      width={32}
      height={32}
      className='rounded-sm h-8 w-8'
    />
  );
};
