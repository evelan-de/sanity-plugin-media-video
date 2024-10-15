import React from 'react';
import ReactPlayer, { type ReactPlayerProps } from 'react-player/lazy';
import { SanityImage } from 'sanity-image';

import { type SanityImageType } from '../../types/schema';
import { cn } from '../../utils/cvaUtils';
import PlayButtonIcon from '../icons/PlayButtonIcon';

/**
 * https://github.com/cookpete/react-player/issues/1690
 * Might have got to do with something about bundling issue with react-player
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore bundling issue with react-player
const Player = ReactPlayer.default as typeof ReactPlayer;

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
      'group/videoImage relative h-full w-full cursor-pointer opacity-100 transition-opacity duration-300',
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
    if (!imagePreview) return null;

    const url = imagePreview.asset.url;
    const lastSlashIndex = url.lastIndexOf('/');
    const baseUrl = url.substring(0, lastSlashIndex + 1);

    return (
      <div ref={ref} className={cn('h-full', className)} {...props}>
        <SanityImage
          id={imagePreview.asset._id}
          baseUrl={baseUrl}
          alt={imagePreview.altText || ''}
          preview={imagePreview.asset.metadata?.lqip}
          sizes='85vw, (min-width: 1920px) 75vw, (min-width: 2240px) 60vw'
          className={cn('h-full w-full object-cover', imageClassName)}
          mode='cover'
          hotspot={{
            x: imagePreview.hotspot?.x || 0,
            y: imagePreview.hotspot?.y || 0,
          }}
          crop={{
            top: imagePreview.crop?.top || 0,
            bottom: imagePreview.crop?.bottom || 0,
            left: imagePreview.crop?.left || 0,
            right: imagePreview.crop?.right || 0,
          }}
          {...sanityImageProps}
        />
      </div>
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
      // We don't use inset-0 because of incompatibility on older ios devices with inset style
      'absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center',
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
        <PlayButtonIcon className='z-[1] ml-[.375rem] h-[1.2469rem] w-[1.08rem] md:h-[2.0787rem] md:w-[1.8rem] lg:h-[2.5981rem] lg:w-[2.25rem]' />
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
    <Player
      className={cn('overflow-hidden [clip-path:content-box]', className)}
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
      className={cn(
        '[&>video]:object-cover [clip-path:content-box]',
        className,
      )}
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
