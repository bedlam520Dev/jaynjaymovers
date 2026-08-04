import { BANNER_DARK } from '@/lib/constants';
import Image from 'next/image';

export function BannerImageD() {
  return (
    <div className='banner-cont'>
      <Image
        {...BANNER_DARK}
        className='banner-d root:hidden dark:visible'
        priority
      />
    </div>
  );
}
