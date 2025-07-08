import { Stack, TextInput } from '@sanity/ui';
import React, { FC } from 'react';
import ReactPlayer from 'react-player';
import { StringInputProps } from 'sanity';

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
          <ReactPlayer
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
            src={value}
            config={{
              // https://developers.google.com/youtube/player_parameters
              youtube: {
                // eslint-disable-next-line camelcase
                playerVars: { playsinline: 0, iv_load_policy: 3 },
                embedOptions: {
                  host: 'https://www.youtube-nocookie.com',
                },
              },
              // HLS configuration for Mux videos to prevent bufferStalledError in Next.js 15
              hls: {
                startLevel: 6, // Fixed quality level (higher number = higher quality)
                maxBufferLength: 30, // Increase buffer length to prevent stalling
                maxMaxBufferLength: 60, // Maximum buffer size for network fluctuations
                debug: false, // Set to true for troubleshooting HLS issues
                progressive: true, // Enable progressive loading for smoother playback
              },
            }}
          />
        </div>
      )}
    </Stack>
  );
};

export default VideoInputField;
