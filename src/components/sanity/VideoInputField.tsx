import { Stack, TextInput } from '@sanity/ui';
import React, { FC } from 'react';
import ReactPlayer from 'react-player';
import { StringInputProps } from 'sanity';

// Normalize default export across ESM/CJS to avoid undefined component in Next 16
// https://github.com/cookpete/react-player/issues/1690
const unwrapDefault = (value: unknown) =>
  (value as { default?: unknown } | null | undefined)?.default ?? value;
const Player = unwrapDefault(unwrapDefault(ReactPlayer)) as typeof ReactPlayer;

/*
This component adds a custom component that displays a Video Preview of the media schema when
type is 'link'
*/
const VideoInputField: FC<StringInputProps> = (props: StringInputProps) => {
  const { elementProps } = props;
  const { value } = elementProps;

  return (
    <Stack space={2}>
      <TextInput {...elementProps} />

      {value && (
        /* Player ratio: 100 / (1280 / 720) */
        <div
          style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}
        >
          <Player
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: '100%',
            }}
            width='100%'
            height='100%'
            controls
            pip={false}
            playsInline
            url={value}
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
          />
        </div>
      )}
    </Stack>
  );
};

export default VideoInputField;
