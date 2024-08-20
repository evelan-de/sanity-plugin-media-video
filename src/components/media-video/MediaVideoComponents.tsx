import React from 'react';
import ReactPlayer, { type ReactPlayerProps } from 'react-player/lazy';
import { SanityImage } from 'sanity-image';

import { type SanityImageType } from '../../types/schema';
import { cn } from '../../utils/cvaUtils';
import { isSanityImage } from '../../utils/typeGuards';

/**
 * Use this component to wrap a whole `MediaVideo` component.
 */
const MediaVideoRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('relative', className)} {...props} />
));

MediaVideoRoot.displayName = 'MediaVideoRoot';

/**
 * Use this component to wrap the content of `MediaVideo` component.
 */
const MediaVideoContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('h-full w-full', className)} {...props} />
));

MediaVideoContainer.displayName = 'MediaVideoContainer';

/**
 * Use this component to wrap the react video player.
 */
const MediaVideoPlayerWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('absolute h-full w-full', className)}
    {...props}
  />
));

MediaVideoPlayerWrapper.displayName = 'MediaVideoPlayerWrapper';

/**
 * Use this component to wrap the image preview content.
 */
const MediaVideoImageContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'group/videoImage relative h-full w-full cursor-pointer opacity-100 transition-all duration-300',
      className,
    )}
    {...props}
  />
));

MediaVideoImageContainer.displayName = 'MediaVideoImageContainer';

/**
 * Use this component to display the image preview content.
 *
 * @param imagePreview - accepts a sanity image object
 * @param imageClassName - accepts a string, used for customizing the class name for the image
 * @param sanityImageProps - accepts a object, used for customizing the props for the sanity image component
 */
const MediaVideoImage = React.forwardRef<
  HTMLImageElement,
  React.HTMLAttributes<HTMLDivElement> & {
    imagePreview: SanityImageType;
    imageClassName?: string;
    sanityImageProps?: React.ComponentProps<typeof SanityImage> &
      React.ComponentPropsWithoutRef<'img'>;
  }
>(
  (
    { className, imagePreview, sanityImageProps, imageClassName, ...props },
    ref,
  ) => {
    return (
      <>
        {isSanityImage(imagePreview) && imagePreview.asset && (
          <div ref={ref} className={cn('h-full', className)} {...props}>
            <SanityImage
              id={imagePreview._id}
              baseUrl={imagePreview.asset.url}
              alt={imagePreview.altText || ''}
              sizes='85vw, (min-width: 1920px) 75vw, (min-width: 2240px) 60vw'
              className={cn('h-full w-full object-cover', imageClassName)}
              {...sanityImageProps}
            />
          </div>
        )}
      </>
    );
  },
);

MediaVideoImage.displayName = 'MediaVideoImage';

/**
 * Use this component to wrap the play button.
 */
const MediaVideoPlayButtonContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'absolute inset-0 flex items-center justify-center',
      className,
    )}
    {...props}
  />
));

MediaVideoPlayButtonContainer.displayName = 'MediaVideoPlayButtonContainer';

/**
 * Use this component to wrap the image preview content.
 *
 * @param children - accepts a ReactNode, use if you want to have a custom play button
 */
const MediaVideoPlayButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'h-[3rem] w-[3rem] rounded-full md:h-[5rem] md:w-[5rem] lg:h-[6.25rem] lg:w-[6.25rem]',
      className,
    )}
    {...props}
  >
    {children ? (
      children
    ) : (
      <div
        className={cn(
          'flex h-full w-full items-center justify-center rounded-full bg-black transition duration-300 group-hover/videoImage:scale-110',
        )}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='currentColor'
          className='z-[1] ml-[.375rem] h-[1.2469rem] w-[1.08rem] fill-white md:h-[2.0787rem] md:w-[1.8rem] lg:h-[2.5981rem] lg:w-[2.25rem]'
        >
          <path
            fillRule='evenodd'
            d='M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z'
            clipRule='evenodd'
          />
        </svg>
      </div>
    )}
  </div>
));

MediaVideoPlayButton.displayName = 'MediaVideoPlayButton';

export type MediaVideoPlayerProps = ReactPlayerProps & {
  className?: string;
};

/**
 * Use this component to display the inline video player
 */
const MediaVideoPlayer = ({
  key,
  className,
  ...reactPlayerProps
}: MediaVideoPlayerProps) => {
  return (
    <ReactPlayer
      className={cn('overflow-hidden', className)}
      width='100%'
      height='100%'
      pip
      playsInline
      config={{
        // https://developers.google.com/youtube/player_parameters
        youtube: {
          // eslint-disable-next-line camelcase
          playerVars: { playsinline: 0, iv_load_policy: 3 },
          embedOptions: {
            host: 'https://www.youtube-nocookie.com',
          },
        },
        file: {
          attributes: {
            preload: 'metadata',
          },
          hlsOptions: {
            startLevel: 6,
          },
        },
      }}
      {...reactPlayerProps}
    />
  );
};

MediaVideoPlayer.displayName = 'MediaVideoPlayer';

/**
 * Use this component to display the popout video
 */
const MediaVideoPopout = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    videoPlayerProps: ReactPlayerProps;
    containerClassName?: string;
    videoClassName?: string;
  }
>(
  (
    {
      className,
      videoPlayerProps,
      containerClassName,
      videoClassName,
      ...props
    },
    ref,
  ) => (
    <MediaVideoRoot ref={ref} className={className} {...props}>
      <MediaVideoContainer
        className={cn(
          'relative h-fit w-full lg:absolute lg:h-full',
          containerClassName,
        )}
      >
        <MediaVideoPlayer
          controls
          loop={false}
          {...videoPlayerProps}
          className={cn(
            'flex aspect-video h-full w-full items-center justify-center',
            '[&>video]:!h-fit [&>video]:!object-contain [&>video]:lg:!h-full [&>video]:lg:!object-cover',
            videoClassName,
          )}
        />
      </MediaVideoContainer>
    </MediaVideoRoot>
  ),
);

MediaVideoPopout.displayName = 'MediaVideoPopout';

/**
 * Use this component to display the auto playing video background player
 */
const MediaVideoAutoPlayVideoLink = ({
  videoPlayerProps,
  className,
}: {
  videoPlayerProps: MediaVideoPlayerProps;
  className?: string;
}) => {
  return (
    <MediaVideoPlayer
      controls={false}
      muted
      pip={false}
      {...videoPlayerProps}
      className={cn('[&>video]:object-cover', className)}
      config={{
        youtube: {
          playerVars: {
            playsinline: 1,
            // eslint-disable-next-line camelcase
            iv_load_policy: 3,
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
          },
          embedOptions: {
            host: 'https://www.youtube-nocookie.com',
          },
        },
        vimeo: {
          playerOptions: {
            autoplay: 0,
          },
        },
        file: {
          hlsOptions: {
            startLevel: 9,
          },
          attributes: {
            autoplay: 1,
            muted: 1,
          },
        },
      }}
    />
  );
};

MediaVideoAutoPlayVideoLink.displayName = 'MediaVideoAutoPlayVideoLink';

export {
  MediaVideoAutoPlayVideoLink,
  MediaVideoContainer,
  MediaVideoImage,
  MediaVideoImageContainer,
  MediaVideoPlayButton,
  MediaVideoPlayButtonContainer,
  MediaVideoPlayer,
  MediaVideoPlayerWrapper,
  MediaVideoPopout,
  MediaVideoRoot,
};
