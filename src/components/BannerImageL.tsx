import Image from 'next/image';

import { BANNER_LIGHT } from '../lib/constants';

export function BannerImageL() {
  return (
    <div className='banner-cont'>
      <Image
        {...BANNER_LIGHT}
        className='banner-l root:visible dark:hidden'
        priority
      />
    </div>
  );
}
