import React, { FC } from 'react';

import { cn } from '../../utils/cvaUtils';

const PlayButtonIcon: FC<React.SVGProps<SVGSVGElement>> = ({
  width,
  height,
  className,
  ...restProps
}) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='currentColor'
      className={cn('size-6 fill-white', className)}
      {...restProps}
    >
      <path
        fillRule='evenodd'
        d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z'
        clipRule='evenodd'
      />
    </svg>
  );
};

export default PlayButtonIcon;
