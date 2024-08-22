'use client';

import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type MediaVideoContextType = {
  pipIdActive: string | undefined;
  setPipIdActive: Dispatch<SetStateAction<string | undefined>>;
};

const MediaVideoContext = createContext<MediaVideoContextType | undefined>(
  undefined,
);

type Props = {
  children: ReactNode;
};

// MediaVideoProvider is a custom provider that provides state for the MediaVideo component globally throughout the page.
export const MediaVideoProvider: React.FC<Props> = ({ children }) => {
  // State to know if there's a video that is currently playing and is in PIP mode
  const [pipIdActive, setPipIdActive] = useState<string | undefined>(undefined);

  return (
    <MediaVideoContext.Provider value={{ pipIdActive, setPipIdActive }}>
      {children}
    </MediaVideoContext.Provider>
  );
};

/**
 * useMediaVideoContext is a custom hook that provides access to the VideoContext.
 * It ensures that the hook is used within a MediaVideoProvider.
 */
export function useMediaVideoContext(): MediaVideoContextType {
  const context = useContext(MediaVideoContext);
  if (!context) {
    throw new Error(
      'useMediaVideoContext must be used within a MediaVideoProvider',
    );
  }
  return context;
}

export default MediaVideoContext;
