import Image from 'next/image';

export const IIGIIcon = () => {
  return (
    <Image
      src='/assets/logo/iig.png'
      alt='IIG Vietnam'
      width={32}
      height={32}
      className='rounded-sm'
    />
  );
};
