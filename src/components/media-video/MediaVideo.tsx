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
 * @param customImageComponent - Custom Image Preview component that will be rendered on the image preview
 * @param isAutoPlay - Determines if the video should play automatically. Defaults to false.
 * @param isPipAutomatic - Determines if picture-in-picture mode should be enabled automatically. Defaults to false.
 * @param customPipId - Custom ID for the PIP mode, used for managing multiple instances or special configurations.
 * @param playInPopout - Whether to play the video in a popout dialog by default.
 * @param playButton - Custom play button component or element to be displayed as the play trigger.
 * @param autoPlayVideoPlayerProps - Props to be passed to the Auto Play Video Background ReactPlayer instance for advanced video player customization.
 * @param videoPlayerProps - Props to be passed to the ReactPlayer instance for advanced video player customization.
 * @param isDesktopScreen - Whether the current screen is in a desktop size. Useful for determining if to play in the popout mode or not.
 * @param videoHookCallbacks - Object of callback functions for handling video playback events (onPlay, onPause, etc.) within the custom hook.
 * @param classNames - Custom class names for various UI elements to facilitate styling and theming.
 * @param classNames.rootCn - Class name for the root element.
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
    customImageComponent?: React.ReactNode;
    isAutoPlay?: boolean;
    isPipAutomatic?: boolean;
    customPipId?: string;
    playInPopout?: boolean;
    playButton?: React.ReactNode;
    autoPlayVideoPlayerProps?: ReactPlayerProps;
    videoPlayerProps?: ReactPlayerProps;
    isDesktopScreen?: boolean;
    videoHookCallbacks?: {
      onPlay?: () => void;
      onPause?: () => void;
      onReady?: () => void;
      onPipEnable?: () => void;
      onPipDisable?: () => void;
    };
    classNames?: {
      rootCn?: string;
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
      customImageComponent,
      playInPopout,
      playButton,
      autoPlayVideoPlayerProps,
      videoPlayerProps,
      isDesktopScreen,
      videoHookCallbacks,
      classNames,
      ...props
    },
    ref,
  ) => {
    const {
      rootCn,
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
      onPause: videoHookCallbacks?.onPause,
      onPlay: videoHookCallbacks?.onPlay,
      onReady: videoHookCallbacks?.onReady,
      onPipEnable: videoHookCallbacks?.onPipEnable,
      onPipDisable: videoHookCallbacks?.onPipDisable,
    });

    // Prepare shared properties for the video player component
    const reactVideoPlayerProps: MediaVideoPlayerProps = {
      className: cn(videoCn),
      url: videoLink,
    };

    return (
      <MediaVideoRoot
        ref={ref}
        className={cn('media-video-root', className, rootCn)}
        {...props}
      >
        <MediaVideoContainer
          ref={topLevelRef}
          className={cn('media-video-container', containerCn)}
        >
          {/* Auto play video */}
          {isAutoPlay && playedByAutoPlay && (
            <MediaVideoPlayerWrapper
              className={cn(
                'media-video-auto-play-wrapper',
                inlinePlay ? 'media-video-auto-play-wrapper__opacity-0' : '',
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
                  className={cn('media-video-auto-play-player', videoCn)}
                />
              )}
            </MediaVideoPlayerWrapper>
          )}

          {/* Inline video player */}
          {inlinePlay && (
            <MediaVideoPlayerWrapper
              className={cn(
                'media-video-inline-player-wrapper',
                isFloatingPip
                  ? 'is-floating-pip animate-sticky'
                  : 'is-inline-player animate-inline',
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
                  'media-video-inline-player',
                  reactVideoPlayerProps.className,
                )}
                {...videoPlayerProps}
                style={
                  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
                  {
                    '--media-object-fit': 'cover',
                    '--media-object-position': 'center',
                    ...videoPlayerProps?.style,
                  } as React.CSSProperties
                }
              />

              <button
                type='button'
                onClick={handleOnPipForceClose}
                className={cn(
                  'media-video-inline-player-pip-close-button',
                  !isFloatingPip
                    ? 'media-video-inline-player-pip-close-button__hidden'
                    : '',
                )}
                title='Close Picture In Picture'
              >
                <XIcon style={{ height: '1rem', width: '1rem' }} />
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
            <DialogTrigger
              asChild
              className={cn('media-video-dialog-trigger', dialogTriggerCn)}
            >
              {(imagePreview?.asset?.url || customImageComponent) && (
                <MediaVideoImageContainer
                  className={cn(
                    'media-video-image-container',
                    inlinePlay ? 'media-video-image-container__opacity-0' : '',
                    imageContainerCn,
                  )}
                >
                  {customImageComponent ? (
                    <div
                      className={cn(
                        'media-video-image comp-media-video-image',
                        playedByAutoPlay && !showImage
                          ? 'media-video-image__opacity-0'
                          : '',
                      )}
                    >
                      {customImageComponent}
                    </div>
                  ) : (
                    <>
                      {imagePreview?.asset?.url && (
                        <MediaVideoImage
                          className={cn(
                            'media-video-image',
                            playedByAutoPlay && !showImage
                              ? 'media-video-image__opacity-0'
                              : '',
                          )}
                          imagePreview={imagePreview}
                          imageClassName={imageCn}
                        />
                      )}
                    </>
                  )}

                  {!isFloatingPip && (
                    <MediaVideoPlayButtonContainer
                      className={cn(
                        'media-video-play-button-container',
                        playBtnContainerCn,
                      )}
                    >
                      {playButton ? (
                        playButton
                      ) : (
                        <MediaVideoPlayButton
                          className={cn('media-video-play-button', playBtnCn)}
                        />
                      )}
                    </MediaVideoPlayButtonContainer>
                  )}
                </MediaVideoImageContainer>
              )}
            </DialogTrigger>

            {/* Desktop video player in dialog popout */}
            {isDesktop && playInPopout && (
              <DialogContent
                className={cn('media-video-dialog-content', dialogContentCn)}
                dialogOverlayClassName={cn(
                  'media-video-dialog-overlay',
                  dialogOverlayCn,
                )}
                dialogCloseClassName={cn(
                  'media-video-dialog-close',
                  dialogCloseCn,
                )}
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
