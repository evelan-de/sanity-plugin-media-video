import React, { useEffect, useRef, useState } from 'react';
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
  <div
    ref={ref}
    className={cn('comp-media-video-root', className)}
    {...props}
  />
));

MediaVideoRoot.displayName = 'MediaVideoRoot';

/**
 * Use this component to wrap the content of `MediaVideo` component.
 */
const MediaVideoContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('comp-media-video-container', className)}
    {...props}
  />
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
    className={cn('comp-media-video-player-wrapper', className)}
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
    className={cn('comp-media-video-image-container', className)}
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
    if (!imagePreview) {
      return null;
    }

    const url = imagePreview.asset?.url;
    if (!url) {
      return null;
    }

    const lastSlashIndex = url.lastIndexOf('/');
    const baseUrl = url.substring(0, lastSlashIndex + 1);

    if (!imagePreview.asset) {
      return null;
    }

    return (
      <div
        ref={ref}
        className={cn('comp-media-video-image', className)}
        {...props}
      >
        <SanityImage
          id={imagePreview.asset?._id}
          baseUrl={baseUrl}
          alt={imagePreview.altText || ''}
          preview={imagePreview.asset.metadata?.lqip}
          sizes='85vw, (min-width: 1920px) 75vw, (min-width: 2240px) 60vw'
          className={cn('comp-media-video-image__img', imageClassName)}
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
    className={cn('comp-media-video-play-button-container', className)}
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
    className={cn('comp-media-video-play-button', className)}
    {...props}
  >
    {children ? (
      children
    ) : (
      <div className={cn('comp-media-video-play-button-inner')}>
        <PlayButtonIcon className='play-button-icon' />
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
      className={cn('comp-media-video-player', className)}
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
        className={cn('comp-media-video-popout-container', containerClassName)}
      >
        <MediaVideoPlayer
          controls
          loop={false}
          {...videoPlayerProps}
          className={cn('comp-media-video-popout-player', videoClassName)}
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
  // Add ref to control the player directly
  const playerRef = useRef<ReactPlayer>(null);
  const [isReady, setIsReady] = useState(false);

  // Handle player ready state
  const handleReady = () => {
    setIsReady(true);
    // Player is ready for playback
  };

  // First effect: Always mute the player as soon as it's ready
  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    // Immediately mute the player to prevent any unmuted playback
    try {
      if (playerRef.current && playerRef.current.getInternalPlayer) {
        const internalPlayer = playerRef.current.getInternalPlayer();

        // Explicitly set muted property on the internal player
        if (internalPlayer) {
          // Different player types have different ways to mute
          if (typeof internalPlayer.muted !== 'undefined') {
            // HTML5 video element
            internalPlayer.muted = true;
          } else if (
            internalPlayer.setMuted &&
            typeof internalPlayer.setMuted === 'function'
          ) {
            // Some players have a setMuted method
            internalPlayer.setMuted(true);
          } else if (
            internalPlayer.setVolume &&
            typeof internalPlayer.setVolume === 'function'
          ) {
            // Some players use volume instead
            internalPlayer.setVolume(0);
          }

          // Set the loop as well to true
          if (
            'loop' in internalPlayer &&
            typeof internalPlayer.loop === 'boolean' &&
            internalPlayer.loop === false
          ) {
            internalPlayer.loop = true;
          }
        }
      }
    } catch (_) {
      // Handle player control errors silently
    }
  }, [isReady]); // Only depend on isReady, so it runs once when player is ready

  // Second effect: Handle play/pause based on the playing prop
  useEffect(() => {
    if (!playerRef.current || !isReady) return;

    try {
      const internalPlayer = playerRef.current.getInternalPlayer();
      if (!internalPlayer || typeof internalPlayer.play !== 'function') return;

      if (videoPlayerProps.playing) {
        // Small timeout to avoid rapid play/pause calls
        const timeoutId = setTimeout(() => {
          internalPlayer.play().catch(() => {
            // Handle play error silently
          });
        }, 100);

        // Return a simple function expression without using void
        // eslint-disable-next-line consistent-return
        return () => {
          clearTimeout(timeoutId);
          // No return value
        };
      } else if (typeof internalPlayer.pause === 'function') {
        internalPlayer.pause();
      }
    } catch (_) {
      // Handle player control errors silently
    }
  }, [videoPlayerProps.playing, isReady]); // Depend on playing prop and isReady

  return (
    <MediaVideoPlayer
      controls={false}
      muted
      pip={false}
      playsinline
      ref={playerRef}
      onReady={handleReady}
      volume={0}
      {...videoPlayerProps}
      className={cn('comp-media-video-auto-play-video-link', className)}
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
