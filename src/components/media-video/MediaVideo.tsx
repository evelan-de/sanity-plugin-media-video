import React, { useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { type ReactPlayerProps } from 'react-player/lazy';
import { v4 as uuidv4 } from 'uuid';

import { useMediaQuery } from '../../hooks/useMediaQuery';
import { MuxVideoAsset, SanityImageType, VideoType } from '../../types/schema';
import { cn } from '../../utils/cvaUtils';
import { convertYoutubeToEmbedUrl } from '../../utils/urlUtils';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../dialog/Dialog';
import XIcon from '../icons/XIcon';
import {
  MediaVideoAutoPlayVideoLink,
  MediaVideoContainer,
  MediaVideoImage,
  MediaVideoImageContainer,
  MediaVideoPlayButton,
  MediaVideoPlayButtonContainer,
  MediaVideoPlayer,
  type MediaVideoPlayerProps,
  MediaVideoPlayerWrapper,
  MediaVideoPopout,
  MediaVideoRoot,
} from './MediaVideoComponents';
import { useMediaVideoPlayback } from './useMediaVideoPlayback';

/**
 * MediaVideo component provides an interface for displaying videos with a preview image.
 * It supports functionalities such as auto-play, manual play, and custom picture-in-picture (PIP) modes
 * across different screen sizes, while offering customization options for various UI elements.
 *
 * @param videoUrl - The URL of the video to be displayed.
 * @param muxData - Data object associated with Mux video assets for advanced integrations.
 * @param videoType - Type of video (default is 'link'), could be values like 'link', 'mux', etc.
 * @param imagePreview - The image displayed for the video thumbnail.
 * @param isAutoPlay - Determines if the video should play automatically. Defaults to false.
 * @param isPipAutomatic - Determines if picture-in-picture mode should be enabled automatically. Defaults to false.
 * @param customPipId - Custom ID for the PIP mode, used for managing multiple instances or special configurations.
 * @param playInPopout - Whether to play the video in a popout dialog by default.
 * @param playButton - Custom play button component or element to be displayed as the play trigger.
 * @param autoPlayVideoPlayerProps - Props to be passed to the Auto Play Video Background ReactPlayer instance for advanced video player customization.
 * @param videoPlayerProps - Props to be passed to the ReactPlayer instance for advanced video player customization.
 * @param isDesktopScreen - Whether the current screen is in a desktop size. Useful for determining if to play in the popout mode or not.
 * @param classNames - Custom class names for various UI elements to facilitate styling and theming.
 * @param classNames.containerCn - Class name for the main container.
 * @param classNames.imageContainerCn - Class name for the image container.
 * @param classNames.imageCn - Class name for the preview image.
 * @param classNames.videoBackgroundCn - Class name for the background of the video.
 * @param classNames.inlineVideoBackgroundCn - Class name specifically for the inline video background.
 * @param classNames.videoCn - Class name for the video element.
 * @param classNames.dialogTriggerCn - Class name for the dialog trigger that opens the popout.
 * @param classNames.dialogContentCn - Class name for the content of the dialog.
 * @param classNames.dialogOverlayCn - Class name for the overlay of the dialog.
 * @param classNames.dialogCloseCn - Class name for the close button of the dialog.
 * @param classNames.playBtnContainerCn - Class name for the container of the play button.
 * @param classNames.playBtnCn - Class name for the play button itself.
 * @param ref - Forwarded ref to the root div element of the component.
 *
 * @returns The rendered MediaVideo component.
 *
 * Inherits all standard HTML div attributes except 'children'.
 */
const MediaVideo = React.forwardRef<
  HTMLDivElement,
  Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
    videoUrl: string | undefined | null;
    muxData: MuxVideoAsset | undefined | null;
    videoType: VideoType | undefined | null;
    imagePreview: SanityImageType | null;
    isAutoPlay?: boolean;
    isPipAutomatic?: boolean;
    customPipId?: string;
    playInPopout?: boolean;
    playButton?: React.ReactNode;
    autoPlayVideoPlayerProps?: ReactPlayerProps;
    videoPlayerProps?: ReactPlayerProps;
    isDesktopScreen?: boolean;
    classNames?: {
      containerCn?: string;
      imageContainerCn?: string;
      imageCn?: string;
      videoBackgroundCn?: string;
      inlineVideoBackgroundCn?: string;
      videoCn?: string;
      dialogTriggerCn?: string;
      dialogContentCn?: string;
      dialogOverlayCn?: string;
      dialogCloseCn?: string;
      playBtnContainerCn?: string;
      playBtnCn?: string;
    };
  }
>(
  (
    {
      className,
      videoUrl,
      muxData,
      videoType = 'link',
      isAutoPlay = false,
      isPipAutomatic = false,
      customPipId,
      imagePreview,
      playInPopout,
      playButton,
      autoPlayVideoPlayerProps,
      videoPlayerProps,
      isDesktopScreen,
      classNames,
      ...props
    },
    ref,
  ) => {
    const {
      containerCn,
      imageContainerCn,
      imageCn,
      videoBackgroundCn,
      inlineVideoBackgroundCn,
      videoCn,
      dialogTriggerCn,
      dialogContentCn,
      dialogOverlayCn,
      dialogCloseCn,
      playBtnContainerCn,
      playBtnCn,
    } = classNames ?? {};
    // Determine if the user's screen is desktop-sized
    // Always call useMediaQuery and then decide which value to use
    const isDesktopFromQuery = useMediaQuery('(min-width: 1024px)');
    const isDesktop =
      isDesktopScreen !== undefined ? isDesktopScreen : isDesktopFromQuery;

    // Convert YouTube URL to embed URL and return empty string if the video type is not supported
    const videoLink = useMemo(() => {
      if (videoType === 'link') {
        return videoUrl ? convertYoutubeToEmbedUrl(videoUrl) : '';
      }

      if (videoType === 'mux') {
        return muxData?.playbackId
          ? `https://stream.mux.com/${muxData.playbackId}`
          : '';
      }

      return '';
    }, [videoType, videoUrl, muxData]);

    // Unique ID for the PiP functionality, this is used to prevent the PiP from being triggered multiple times
    const pipUniqueId = useMemo(() => customPipId ?? uuidv4(), [customPipId]);

    // Setup Intersection Observer to determine when the component is in view
    const intersectionObserver = useInView({
      rootMargin: '0px',
      threshold: [0, 0.5, 1],
    });
    const { ref: topLevelRef, inView: componentIsInView } =
      intersectionObserver;

    // Custom hook to manage video playback state and related events
    const {
      desktopPopoutPlay,
      inlinePlay,
      inlinePause,
      showImage,
      playedByAutoPlay,
      isPopoutOpen,
      isFloatingPip,
      setInlinePause,
      handleOnVideoProgress,
      handleClickPlay,
      handleVideoOnReady,
      handleInlineOnPlay,
      handleOnPipForceClose,
      setActivePip,
    } = useMediaVideoPlayback({
      isAutoPlay,
      isPipAutomatic: isAutoPlay && isPipAutomatic,
      intersectionObserver,
      pipUniqueId,
      isDesktop,
      playInPopout,
    });

    // Prepare shared properties for the video player component
    const reactVideoPlayerProps: MediaVideoPlayerProps = {
      className: cn(videoCn),
      url: videoLink,
    };

    return (
      <MediaVideoRoot ref={ref} className={cn(className)} {...props}>
        <MediaVideoContainer
          ref={topLevelRef}
          className={cn('h-full w-full', containerCn)}
        >
          {/* Auto play video */}
          {isAutoPlay && playedByAutoPlay && (
            <MediaVideoPlayerWrapper
              className={cn(
                // Add opacity effect for seamless screen transitions
                'transition-opacity duration-300',
                inlinePlay ? 'opacity-0' : 'opacity-100',
                videoBackgroundCn,
              )}
            >
              {videoLink && (
                <MediaVideoAutoPlayVideoLink
                  videoPlayerProps={{
                    ...reactVideoPlayerProps,
                    playing:
                      isPopoutOpen === false &&
                      componentIsInView &&
                      !inlinePlay,
                    controls: false,
                    muted: true,
                    loop: true,
                    onProgress: handleOnVideoProgress,
                    // Style for the mux video
                    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                    style: {
                      '--media-object-fit': 'cover',
                      '--media-object-position': 'center',
                    } as React.CSSProperties,
                    ...autoPlayVideoPlayerProps,
                  }}
                  className={videoCn}
                />
              )}
            </MediaVideoPlayerWrapper>
          )}

          {/* Inline video player */}
          {inlinePlay && (
            <MediaVideoPlayerWrapper
              className={cn(
                isFloatingPip
                  ? [
                      'fixed bottom-6 right-6 z-[999]',
                      'h-auto w-[17.1875rem] lg:h-[12.5rem] lg:w-[21.875rem] xl:h-[15.625rem] xl:w-[25rem]',
                      'animate-videoSticky',
                    ]
                  : '!translate-x-0 !translate-y-0 animate-videoInline',
                inlineVideoBackgroundCn,
              )}
            >
              <MediaVideoPlayer
                {...reactVideoPlayerProps}
                muted={false}
                playing={!inlinePause}
                controls
                loop={false}
                onPlay={handleInlineOnPlay}
                onReady={() => handleVideoOnReady()}
                onPause={() => {
                  setInlinePause(true);
                }}
                pip
                onEnablePIP={() => setActivePip(true)}
                onDisablePIP={() => setActivePip(false)}
                className={cn(
                  '[&>video]:!object-cover',
                  reactVideoPlayerProps.className,
                )}
                style={
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  {
                    '--media-object-fit': 'cover',
                    '--media-object-position': 'center',
                  } as React.CSSProperties
                }
                {...videoPlayerProps}
              />

              <button
                type='button'
                onClick={handleOnPipForceClose}
                className={cn(
                  'absolute right-[.5rem] top-[.5rem] h-[1.5rem] w-[1.5rem] bg-black px-xs',
                  !isFloatingPip ? 'hidden' : '',
                )}
                title='Close Picture In Picture'
              >
                <XIcon className='h-[1rem] w-[1rem]' />
                <span className='sr-only'>Close Picture In Picture</span>
              </button>
            </MediaVideoPlayerWrapper>
          )}

          {/* Popout video with the image and play button */}
          <Dialog
            open={isPopoutOpen}
            onOpenChange={(open) => handleClickPlay({ open })}
          >
            <DialogTitle className='sr-only' />
            {/* Displays the video thumbnail for both mobile/tablet and desktop */}
            <DialogTrigger asChild className={dialogTriggerCn}>
              {imagePreview?.asset.url && (
                <MediaVideoImageContainer
                  className={cn(
                    inlinePlay ? 'pointer-events-none opacity-0' : '',
                    imageContainerCn,
                  )}
                >
                  <MediaVideoImage
                    imagePreview={imagePreview}
                    imageClassName={cn(
                      'opacity-100 transition-opacity duration-200',
                      playedByAutoPlay && !showImage ? 'opacity-0' : '',
                      imageCn,
                    )}
                  />

                  {!isFloatingPip && (
                    <MediaVideoPlayButtonContainer
                      className={cn(playBtnContainerCn)}
                    >
                      {playButton ? (
                        playButton
                      ) : (
                        <MediaVideoPlayButton className={cn(playBtnCn)} />
                      )}
                    </MediaVideoPlayButtonContainer>
                  )}
                </MediaVideoImageContainer>
              )}
            </DialogTrigger>

            {/* Desktop video player in dialog popout */}
            {isDesktop && playInPopout && (
              <DialogContent
                className={cn(
                  'z-[99999] h-fit w-full max-w-[90vw] border-none p-0 lg:h-full lg:p-[1rem]',
                  dialogContentCn,
                )}
                dialogOverlayClassName={dialogOverlayCn}
                dialogCloseClassName={dialogCloseCn}
              >
                {isPopoutOpen && (
                  <MediaVideoPopout
                    videoPlayerProps={{
                      ...reactVideoPlayerProps,
                      playing: desktopPopoutPlay && isPopoutOpen,
                      controls: true,
                      loop: false,
                      muted: !isPopoutOpen,
                      pip: true,
                      onReady: () => handleVideoOnReady(true),
                      onEnablePIP: () => setActivePip(true),
                      onDisablePIP: () => setActivePip(false),
                      ...videoPlayerProps,
                    }}
                  />
                )}
              </DialogContent>
            )}
          </Dialog>
        </MediaVideoContainer>
      </MediaVideoRoot>
    );
  },
);
MediaVideo.displayName = 'MediaVideo';

export { MediaVideo };
