import ReactPlayer from 'react-player/lazy';
import styled from 'styled-components';

/**
 * https://github.com/cookpete/react-player/issues/1690
 * Might have got to do with something about bundling issue with react-player
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore bundling issue with react-player
const Player = ReactPlayer.default as typeof ReactPlayer;

export const StyledMediaVideoRoot = styled.div`
  position: relative;
`;

export const StyledMediaVideoContainer = styled.div`
  height: 100%;
  width: 100%;
`;

export const StyledMediaVideoPlayerWrapper = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

export const StyledMediaVideoImageContainer = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;

  &:hover {
    /* Targeting child PlayButtonIcon inside MediaVideoPlayButton, simulating the group/videoImage from tailwind */
    .play-button {
      transform: scale(1.1);
    }
  }
`;

export const StyledMediaVideoImage = styled.div`
  height: 100%;
`;

// export const StyledSanityImage = styled(SanityImage)`
//   height: 100%;
//   width: 100%;
//   object-fit: cover;
// `;

export const StyledPlayButtonContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledMediaVideoPlayButton = styled.div`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;

  @media (min-width: 768px) {
    height: 5rem;
    width: 5rem;
  }

  @media (min-width: 1024px) {
    height: 6.25rem;
    width: 6.25rem;
  }

  .play-button-wrapper {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: black;
    transition: transform 0.3s ease-in-out;
  }

  .play-button {
    z-index: 1;
    margin-left: 0.375rem;
    height: 1.2469rem;
    width: 1.08rem;

    @media (min-width: 768px) {
      height: 2.0787rem;
      width: 1.8rem;
    }

    @media (min-width: 1024px) {
      height: 2.5981rem;
      width: 2.25rem;
    }
  }
`;

export const StyledPlayer = styled(Player)`
  overflow: hidden;
  clip-path: content-box;

  /* Target the <video> element inside */
  & > video {
    object-fit: cover; /* Matches '[&>video]:!object-cover' */
  }
`;

export const StyledMediaVideoPopoutContainer = styled(
  StyledMediaVideoContainer,
)`
  position: relative;
  height: fit-content; /* Use 'fit-content' instead of 'h-fit' */
  width: 100%;

  /* Add styles for larger screens */
  @media (min-width: 1024px) {
    /* Adjust this based on your breakpoints */
    position: absolute;
    height: 100%; /* Use 100% height on large screens */
  }
`;

export const StyledMediaVideoPopoutPlayer = styled(StyledPlayer)`
  display: flex;
  aspect-ratio: 16 / 9; /* Matches 'aspect-video' from Tailwind */
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;

  /* Target the <video> element inside */
  & > video {
    height: fit-content !important; /* Matches '[&>video]:!h-fit' */
    object-fit: contain !important; /* Matches '[&>video]:!object-contain' */

    @media (min-width: 1024px) {
      height: 100% !important; /* Matches '[&>video]:lg:!h-full' */
      object-fit: cover !important; /* Matches '[&>video]:lg:!object-cover' */
    }
  }
`;

export const StyledMediaVideoAutoPlayVideoLinkPlayer = styled(StyledPlayer)`
  /* Apply clip-path and other styles */
  clip-path: content-box;

  /* Target the video element inside */
  & > video {
    object-fit: cover; /* Matches '[&>video]:object-cover' */
  }
`;
