# Sanity Plugin Media Video

A Sanity plugin for adding a media object (Image/Video) to your sanity studio schemas and displaying the media with built-in functionalities such as auto-play, custom PiP on scroll, etc.

> This is a **Sanity Studio v3** plugin.

- [Sanity Plugin Media Video](#sanity-plugin-media-video)
  - [🔌 Installation](#-installation)
  - [🧑‍💻 Usage](#-usage)
    - [Basic configuration](#basic-configuration)
  - [⚙️ Plugin Configuration](#️-plugin-configuration)
  - [🌐 Localization](#-localization)
      - [Available locales to be overriden](#available-locales-to-be-overriden)
  - [🎬 How to render the media video on your website](#-how-to-render-the-media-video-on-your-website)
    - [NOTE](#note)
    - [Props](#props)
    - [videoHookCallbacks object](#videohookcallbacks-object)
    - [Custom class names and its corresponding CSS selectors](#custom-class-names-and-its-corresponding-css-selectors)
    - [CSS Selectors for Media Video Components](#css-selectors-for-media-video-components)
    - [Use your own implementation](#use-your-own-implementation)
      - [Using the provided Hooks](#using-the-provided-hooks)
  - [🗃️ Data model](#️-data-model)
  - [🛢 GROQ Query](#-groq-query)
  - [❓ FAQs](#-faqs)
  - [📝 License](#-license)
  - [🧪 Develop \& test](#-develop--test)
    - [Release new version](#release-new-version)

## 🔌 Installation

Install peer dependencies such as `zod` and `sanity-plugin-mux-input` as well since this uses Mux as part of the video encoding service.

```sh
npm install sanity-plugin-media-video sanity-plugin-mux-input zod
```

## 🧑‍💻 Usage

Add it as a plugin in sanity.config.ts (or .js):

### Basic configuration

```ts
// sanity.config.ts

import { defineConfig } from 'sanity';
import { mediaVideoPlugin } from 'sanity-plugin-media-video';

export default defineConfig({
  //...
  plugins: [
    // Add the muxInput from `sanity-plugin-mux-input` to make the mux 3rd party integration work
    muxInput({
      // your optional mux config here. Refer to this link for more info: https://github.com/sanity-io/sanity-plugin-mux-input?tab=readme-ov-file#configuring-mux-video-uploads
    }),

    // Add the mediaVideo plugin
    mediaVideoPlugin({
      // your optional configuration here
    }),
  ],
});
```

The plugin adds a new object type called `media`. Simply add it as a `type` to one of your defined fields like so

```ts
export default defineType({
  name: 'my-section',
  title: 'My Example Section',
  type: 'object',
  fields: [
    // ...your-other-fields
    defineField({
      name: 'my-custom-media-field',
      title: 'My Custom Media Field',
      type: 'media',
    }),
    // ...your-other-fields
  ],
});
```

**Structure would look something like this:**

<p align="center">
  <img width="60%" src="docs/images/media-video-schema-1.png" alt="JSON dialog"/>
  <img width="60%" src="docs/images/media-video-schema-2.png" alt="JSON dialog"/>
</p>

<br /><br />

## ⚙️ Plugin Configuration

This is the main configuration of the plugin. The available options are:

```ts
{
  // Optional boolean to enable/disable required validation on the image field
  isImageRequired?: boolean
}
```

<br /><br />

## 🌐 Localization

This plugin uses the [Studio UI Localization](https://www.sanity.io/docs/localizing-studio-ui) resource bundle, it is now possible to localize the fields to fit your needs.

**Here is the default English bundle:**
<br />

<details>
  <summary>Default bundle</summary>
<br />

```ts
{
  'image.title': 'Image',
  'image.description': 'Serves as the image preview of the video',
  'image.required.title': 'Image is required',
  'image.altText.title': 'Alt Text',
  'image.altText.description':
    'Set an alternative text for accessibility purposes',
  'enableVideo.title': 'Enable Video',
  'enableVideo.description': 'Toggle to enable video',
  'videoType.title': 'Video Type',
  'videoType.link.title': 'Link',
  'videoType.mux.title': 'Mux',
  'videoType.required.title': 'Video Type is required',
  'isAutoPlay.title': 'Auto Play',
  'isAutoPlay.description': 'Automatically play the video when loaded',
  'isPipAutomatic.title': 'Enable Automatic PiP for Autoplay',
  'isPipAutomatic.description':
    'This automatically creates a small floating video player when you scroll past the main video',
  'videoUrl.title': 'Video Link',
  'videoUrl.required.title': 'Video Link is required',
  'muxVideo.required.title': 'Mux Video is required',
}
```

</details>
<br/>

#### Available locales to be overriden

- `en-US`
- `de-DE`

If you want to override or add a new language, you will need to create a custom bundle with your desired translations. In order to override/add you must use `mediaVideo` as the namespace and add it to the `i18n` object in your sanity plugin configuration. Here is an example:

```ts
const myEnglishOverride = defineLocaleResourceBundle({
  // make sure the `locale` language code corresponds to the one you want to override
  locale: 'en-US',
  namespace: 'mediaVideo',
  resources: {
    'image.title': 'This is my override title',
  },
});

// sanity.config.ts
export default defineConfig({
  // ...
  i18n: {
    bundles: [myEnglishOverride],
  },
});
```

<br /><br />

## 🎬 How to render the media video on your website

This plugin gives out a ready out of the box made component for rendering the media video on your website with built-in functionalities such as auto-play, custom PiP on scroll, etc. One way to render it is to use the provided renderer component or you can implement your own renderer component with the data that you get from the `media` object.

### NOTE

- This plugin uses the [react-player](https://github.com/CookPete/react-player) library for rendering the media video.
- The renderer also needs to be wrapped within the provided custom Provider component in order to function properly.

**1. Import the Provider component and wrap the renderer component with it. Suggested to be placed in the root of your application.**

```tsx
import { MediaVideoProvider } from 'sanity-plugin-media-video/contexts';

// other code

<body>
  <MediaVideoProvider>
    {/* Your renderer component here or other components */}
  </MediaVideoProvider>
</body>;
```

**2. Use the renderer component like so. Example usage below**

You will need to require the CSS file from this package (or provide your own). The example below shows how to include the CSS from this package if your build system supports requiring CSS files

```tsx
import { MediaVideo } from 'sanity-plugin-media-video/renderer';

// IMPORTANT: require the CSS file from this package
// Recommended to us the provided CSS as well, but you can override it if you want.
// Refer to the table above for the CSS selectors.
import 'sanity-plugin-media-video/dist/sanity-plugin-media-video.css';

const MyComponent = (props) => {
  return (
    <MediaVideo
      className='my-custom-class-name'
      classNames={{
        rootCn: 'my-custom-root-container-class-name',
        containerCn: 'my-custom-container-class-name',
        imageContainerCn: 'my-custom-image-container-class-name',
        imageCn: 'my-custom-image-class-name',
        videoBackgroundCn: 'my-custom-video-background-class-name',
        inlineVideoBackgroundCn: 'my-custom-inline-video-background-class-name',
        videoCn: 'my-custom-video-class-name',
        dialogTriggerCn: 'my-custom-dialog-trigger-class-name',
        dialogContentCn: 'my-custom-dialog-content-class-name',
        dialogOverlayCn: 'my-custom-dialog-overlay-class-name',
        dialogCloseCn: 'my-custom-dialog-close-class-name',
        playBtnContainerCn: 'my-custom-play-button-container-class-name',
        playBtnCn: 'my-custom-play-button-class-name',
      }}
      videoUrl={videoUrl}
      imagePreview={imagePreview}
      isAutoPlay={isAutoPlay}
      isPipAutomatic={isPipAutomatic}
      videoType={videoType ?? 'link'}
      muxData={muxData}
    />
  );
};
```

### Props

| Prop                       | Description                                                                                                               | Default     | Required |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------- | -------- |
| `videoUrl`                 | The URL of the video to be displayed.                                                                                     | `undefined` | Yes      |
| `muxData`                  | Data object associated with Mux video assets for advanced integrations.                                                   | `undefined` | No       |
| `videoType`                | Type of video (default is 'link'), could be values like 'link', 'mux', etc.                                               | `'link'`    | No       |
| `imagePreview`             | The image displayed for the video thumbnail.                                                                              | `null`      | Yes      |
| `customImageComponent`     | Custom Image Preview component that will be rendered on the image preview.                                                | `undefined` | No       |
| `isAutoPlay`               | Determines if the video should play automatically.                                                                        | `false`     | No       |
| `isPipAutomatic`           | Determines if picture-in-picture mode should be enabled automatically.                                                    | `false`     | No       |
| `customPipId`              | Custom ID for the PIP mode, used for managing multiple instances or special configurations.                               | `undefined` | No       |
| `playInPopout`             | Whether to play the video in a popout dialog by default.                                                                  | `undefined` | No       |
| `playButton`               | Custom play button component or element to be displayed as the play trigger. Can pass a React component or a JSX element. | `undefined` | No       |
| `autoPlayVideoPlayerProps` | Props to be passed to the Auto Play Video Background ReactPlayer instance for advanced video player customization.        | `undefined` | No       |
| `videoPlayerProps`         | Props to be passed to the ReactPlayer instance for advanced video player customization.                                   | `undefined` | No       |
| `isDesktopScreen`          | Whether the current screen is in a desktop size. Useful for determining if to play in the popout mode or not.             | `undefined` | No       |
| `videoHookCallbacks`       | Object of callback functions for handling video playback events (onPlay, onPause, etc.) within the custom hook.           | `undefined` | No       |
| `classNames`               | Custom class names for various UI elements to facilitate styling and theming.                                             | `undefined` | No       |
| `ref`                      | Forwarded ref to the root div element of the component.                                                                   | `undefined` | No       |

### videoHookCallbacks object

| Prop           | Description                                                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `onPlay`       | Custom callback that triggers whenever the video playback starts, useful for handling side effects.                                |
| `onPause`      | Custom callback that triggers when the video is paused, allowing for additional logic like UI updates or tracking.                 |
| `onReady`      | Custom callback that is executed once the video is ready to be played, useful for preloading or initialization tasks.              |
| `onPipEnable`  | Custom callback triggered when Picture-in-Picture (PiP) mode is activated, allowing custom behavior when PiP is enabled.           |
| `onPipDisable` | Custom callback triggered when Picture-in-Picture (PiP) mode is deactivated, useful for handling any teardown logic or UI updates. |

### Custom class names and its corresponding CSS selectors

| Prop                                 | CSS Selector                                                    | Description                                   |
| ------------------------------------ | --------------------------------------------------------------- | --------------------------------------------- |
| `classNames.rootCn`                  | `.media-video-root`                                             | Root container.                               |
| `classNames.containerCn`             | `.media-video-container`                                        | Main container.                               |
| `classNames.imageContainerCn`        | `.media-video-image-container`                                  | Image container.                              |
| `classNames.imageCn`                 | `.media-video-image`                                            | Preview image.                                |
| `classNames.videoBackgroundCn`       | `.media-video-auto-play-wrapper`                                | Background of the video.                      |
| `classNames.inlineVideoBackgroundCn` | `.media-video-inline-player-wrapper`                            | Specifically for the inline video background. |
| `classNames.videoCn`                 | `.media-video-auto-play-player` or `.media-video-inline-player` | Video element.                                |
| `classNames.dialogTriggerCn`         | `.media-video-dialog-trigger`                                   | Dialog trigger that opens the popout.         |
| `classNames.dialogContentCn`         | `.media-video-dialog-content`                                   | Content of the dialog.                        |
| `classNames.dialogOverlayCn`         | `.media-video-dialog-overlay`                                   | Overlay of the dialog.                        |
| `classNames.dialogCloseCn`           | `.media-video-dialog-close`                                     | Close button of the dialog.                   |
| `classNames.playBtnContainerCn`      | `.media-video-play-button-container`                            | Container of the play button.                 |
| `classNames.playBtnCn`               | `.media-video-play-button`                                      | Play button itself.                           |

### CSS Selectors for Media Video Components

| Component                       | Primary CSS Selector                                                    | Description                                                                                    |
| ------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `MediaVideoRoot`                | `.comp-media-video-root`                                                | Root element for the entire `MediaVideo` component.                                            |
| `MediaVideoContainer`           | `.comp-media-video-container`                                           | Wrapper for the main content of `MediaVideo`.                                                  |
| `MediaVideoPlayerWrapper`       | `.comp-media-video-player-wrapper`                                      | Wrapper specifically for the video player instance, used for styling controls.                 |
| `MediaVideoImageContainer`      | `.comp-media-video-image-container`                                     | Wrapper for the preview image.                                                                 |
| `MediaVideoImage`               | `.comp-media-video-image`, `.comp-media-video-image__img`               | Contains the preview image (`img` variant is used within the Sanity image component).          |
| `MediaVideoPlayButtonContainer` | `.comp-media-video-play-button-container`                               | Wrapper for the play button.                                                                   |
| `MediaVideoPlayButton`          | `.comp-media-video-play-button`, `.comp-media-video-play-button-inner`  | Styles for the play button, including an optional inner wrapper for icon alignment.            |
| `MediaVideoPlayer`              | `.comp-media-video-player`                                              | Main video player element; adjusts player layout and dimensions within the component.          |
| `MediaVideoPopout`              | `.comp-media-video-popout-container`, `.comp-media-video-popout-player` | Popout container and player styles, used for PiP or popout mode adjustments.                   |
| `MediaVideoAutoPlayVideoLink`   | `.comp-media-video-auto-play-video-link`                                | Styling for autoplay or looping video backgrounds; suppresses controls and adjusts object-fit. |

### Use your own implementation

You can use your own implementation if you want since the the Media Video renderer is only an optional added feature in this plugin. Suggested way to do this is by leveraging [react-player](https://github.com/CookPete/react-player) library to make it easier to render the video.

Optionally the plugin also provides some block components to help you build your own implementation if you want to. You can access them through the `MediaVideoComponents` object like so:

```tsx
import { MediaVideoComponents } from 'sanity-plugin-media-video/renderer';

// Recommended to us the provided CSS as well, but you can override it if you want.
// Refer to the table above for the CSS selectors.
import 'sanity-plugin-media-video/dist/sanity-plugin-media-video.css';

const MyCustomComponent = (props) => {
  return (
    <MediaVideoComponents.MediaVideoRoot
      ref={ref}
      className={className}
      {...props}
    >
      <MediaVideoComponents.MediaVideoContainer>
        {/* Your own implementation */}
      </MediaVideoComponents.MediaVideoContainer>
    </MediaVideoComponents.MediaVideoRoot>
  );
};
```

#### Using the provided Hooks

You can also use the hooks provided by the plugin to help you build your own implementation:

```tsx
import { MediaVideoComponents } from 'sanity-plugin-media-video/renderer';

import 'sanity-plugin-media-video/dist/sanity-plugin-media-video.css';

const MyCustomComponent = (props) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)'); // Used to know if the screen is desktop or not
  const pipUniqueId = uuidv4();

  // Setup Intersection Observer to determine when the component is in view
  const intersectionObserver = useInView({
    rootMargin: '0px',
    threshold: [0, 0.5, 1],
  });
  const { ref: topLevelRef } = intersectionObserver;

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
    /**
     * The following props are required for the hook to work
     * can refer to the implementation in the MediaVideo component
     * for more details
     */
    isAutoPlay,
    isPipAutomatic,
    intersectionObserver,
    pipUniqueId,
    isDesktop,
    playInPopout,
  });

  return {
    /* Your own implementation */
  };
};
```

<br /><br />

## 🗃️ Data model

```ts
{
  _type: 'media';
  enableVideo: boolean;
  isAutoPlay: boolean;
  videoType: 'link' | 'mux';
  isPipAutomatic: boolean;
  videoUrl: string;
  muxVideo: {
    _type: 'mux.video';
    asset: {
      _ref: string;
      _type: 'reference';
      _weak: boolean;
    }
  }
  image: {
    _type: 'image';
    asset: {
      _type: 'reference';
      _ref: string;
    }
    altText: string;
    crop: {
      _type: 'sanity.imageCrop';
      bottom: number;
      left: number;
      right: number;
      top: number;
    }
    hotspot: {
      _type: 'sanity.imageHotspot';
      height: number;
      width: number;
      x: number;
      y: number;
    }
  }
}
```

<br /><br />

## 🛢 GROQ Query

You can query the data model with this sample groq query

```groq
// Example for fetching data above
*[ _type == "exampleSchemaWithMedia" ] {
  myMediaField {
    image {
      asset->{
        _id,
        url,
        metadata {
          lqip
        }
      },
      crop,
      hotspot,
      altText
    },
    enableVideo,
    videoType,
    isAutoPlay,
    isPipAutomatic,
    videoUrl,
    muxVideo {
      _type,
      asset->{
        playbackId,
        assetId,
        filename,
        ...
      },
    },
  }
}
```

<br /><br />

## ❓ FAQs

- **How to add a new language?**

  - You can refer to the [🌐 Localization](#-localization) section on how to override or add a new language

- **Why the need to add an image field to the `media` object?**
  - The image field is used to display a custom preview image of the video. This is useful for SSR performance and SEO purposes as it does not load the video itself directly when the page is rendered.
  - This also makes it possible to just be a Media Picture instead if you do not want to use the video feature. With that you can then render it however you want with the image data

<br /><br />

## 📝 License

[MIT](LICENSE) © Evelan

## 🧪 Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.

### Release new version

Run ["CI & Release" workflow](https://github.com/evelan-de/sanity-plugin-media-video/actions/workflows/main.yml).
Make sure to select the main branch and check "Release new version".

Semantic release will only release on configured branches, so it is safe to run release on any branch.
