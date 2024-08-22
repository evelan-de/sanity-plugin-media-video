'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { type InViewHookResponse } from 'react-intersection-observer';
import { OnProgressProps } from 'react-player/base';

import { useMediaVideoContext } from './MediaVideoContext';

type UseVideoPlaybackProps = {
  isAutoPlay: boolean | null;
  isPipAutomatic: boolean;
  intersectionObserver: InViewHookResponse;
  pipUniqueId: string | undefined;
  isDesktop: boolean;
  playInPopout?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
  onReady?: () => void;
  onPipEnable?: () => void;
  onPipDisable?: () => void;
};

/**
 * Custom hook to manage the state and behavior of video playback in the MediaVideo component.
 */
const useVideoPlayback = ({
  isAutoPlay,
  isPipAutomatic,
  intersectionObserver,
  pipUniqueId,
  isDesktop,
  playInPopout,
  onPlay,
  onPause,
  onReady,
  onPipEnable,
  onPipDisable,
}: UseVideoPlaybackProps) => {
  const { pipIdActive, setPipIdActive } = useMediaVideoContext();
  const { inView: componentIsInView, entry } = intersectionObserver;

  // State variables to manage the video playback
  const [loading, setLoading] = useState(false);
  const [desktopPopoutPlay, setDesktopPopoutPlay] = useState(false);
  const [inlinePlay, setInlinePlay] = useState(false);
  const [inlinePause, setInlinePause] = useState(true);
  const [playedByAutoPlay, setPlayedByAutoPlay] = useState(false);
  const [isPopoutOpen, setIsPopoutOpen] = useState(false);
  const [showImage, setShowImage] = useState(true);
  const [pipIsForceClosed, setPipIsForceClosed] = useState(false);

  // function to toggle PiP
  const setActivePip = useCallback(
    (active: boolean) => {
      setPipIdActive(active ? pipUniqueId : undefined);
      if (active) {
        onPipEnable?.();
      } else {
        onPipDisable?.();
      }
    },
    [pipUniqueId, onPipEnable, onPipDisable, setPipIdActive],
  );

  // Handle the logic for when to show the floating PiP functionality
  const isFloatingPip = useMemo(() => {
    if (!entry || !isPipAutomatic) {
      return false;
    }

    const isIntersecting = entry.isIntersecting;
    const intersectionRatio = entry.intersectionRatio || 0;
    const boundingClientRect = entry.boundingClientRect;

    // PiP should not be active when the component is sufficiently in view
    if (isIntersecting && intersectionRatio >= 0.5) {
      setPipIsForceClosed(false);
      return false;
    }

    // For video player return false if video is paused or not playing
    if (pipIsForceClosed || isPopoutOpen || inlinePause) {
      return false;
    }

    // Do not trigger PiP if an existing PiP is active
    if (pipIdActive && pipIdActive !== pipUniqueId) {
      return false;
    }

    /**
     * Add a condition to check if the inlinePlay is true
     * so that it will not trigger on instantiation of this memo
     */
    if (inlinePlay && !componentIsInView) {
      // Only toggle PIP if the view is from the bottom view part of the component. This is to prevent the PIP from being triggered when the top half of the component is in view.
      if (boundingClientRect.height / 2 > boundingClientRect.bottom) {
        return true;
      }
    }

    return false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentIsInView, entry, pipIsForceClosed, pipIdActive, pipUniqueId]);

  // Use effect to handle the state update for PiP
  useEffect(() => {
    if (isFloatingPip) {
      setActivePip(true);
    } else if (pipIdActive === pipUniqueId) {
      // Remove the current PiP if it has the same unique ID as the current active PiP
      setActivePip(false);
    }
  }, [isFloatingPip, pipIdActive, pipUniqueId, setActivePip]);

  // Handle video progress to hide the preview image when video starts playing
  const handleOnVideoProgress = useCallback(
    (event: OnProgressProps): void => {
      if (showImage && event.playedSeconds > 0.1) {
        setShowImage(false);
      }
    },
    [showImage],
  );

  // Handle click to play the video, manages whether the video plays in popout or in the same view
  const handleClickPlay = useCallback(
    ({ open }: { open: boolean }) => {
      if (isDesktop) {
        // If playInPopout is true, open the popout dialog
        if (playInPopout) {
          setIsPopoutOpen(open);
          setInlinePlay(false);
        } else {
          setInlinePlay(true);
        }
      } else {
        setLoading(true);
        setIsPopoutOpen(false);
        setInlinePlay(true);
      }

      if (open) {
        onPlay?.();
      } else {
        onPause?.();
      }
    },
    [isDesktop, playInPopout, onPlay, onPause],
  );

  const handleInlineOnPlay = () => {
    setLoading(false);
    setInlinePlay(true);
    setInlinePause(false);

    onPlay?.();
  };

  const handleVideoOnReady = (isPopout = false) => {
    // We add a small timeout to avoid the issue with the video double playing in the background bug
    setTimeout(() => {
      setLoading(false);

      if (isPopout) {
        setDesktopPopoutPlay(true);
      } else {
        setInlinePlay(true);
        setInlinePause(false);
      }

      onReady?.();
    }, 100);
  };

  const handleOnPipForceClose = () => {
    setPipIsForceClosed(true);
    setActivePip(false);
    setInlinePause(true);
  };

  // Auto-play the video when the component is in view
  useEffect(() => {
    if (isAutoPlay && componentIsInView) {
      setPlayedByAutoPlay(true);
    }
  }, [componentIsInView, isAutoPlay]);

  // Handle loading state when the video is played
  useEffect(() => {
    if (desktopPopoutPlay || inlinePlay) {
      setLoading(false);
    }
  }, [desktopPopoutPlay, inlinePlay]);

  // Handle screen transition between mobile and desktop if playInPopout is true
  useEffect(() => {
    if (isDesktop) {
      // Switch from mobile to desktop, continue video playback if previously played
      if (inlinePlay && componentIsInView && playInPopout) {
        setIsPopoutOpen(true);

        setTimeout(() => {
          setDesktopPopoutPlay(true);
        }, 300);

        setInlinePlay(false);
        setInlinePause(true);
      }
    } else {
      // Switch from desktop to mobile, continue video playback if previously played
      // eslint-disable-next-line no-lonely-if
      if (desktopPopoutPlay && componentIsInView && playInPopout) {
        setIsPopoutOpen(false);

        setTimeout(() => {
          setInlinePlay(true);
        }, 100);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  // Handle logic for pausing inline video player if it's not in view
  // Also Handle logic for pausing inline video player if there's already a PiP active
  useEffect(() => {
    // Pause if it's not in view
    if (!componentIsInView && inlinePlay && !isPipAutomatic) {
      setInlinePause(true);
    }

    // Pause if there's already a PiP active
    if (
      !componentIsInView &&
      inlinePlay &&
      isPipAutomatic &&
      pipIdActive &&
      pipIdActive !== pipUniqueId
    ) {
      setInlinePause(true);
    }
  }, [componentIsInView, inlinePlay, isPipAutomatic, pipIdActive, pipUniqueId]);

  return {
    desktopPopoutPlay,
    inlinePlay,
    inlinePause,
    loading,
    playedByAutoPlay,
    isPopoutOpen,
    showImage,
    pipIsForceClosed,
    setIsPopoutOpen,
    setDesktopPopoutPlay,
    setLoading,
    setInlinePlay,
    setInlinePause,
    setShowImage,
    setPipIsForceClosed,
    isFloatingPip,
    handleOnVideoProgress,
    handleClickPlay,
    handleVideoOnReady,
    handleInlineOnPlay,
    handleOnPipForceClose,
    setActivePip,
  };
};

export default useVideoPlayback;
