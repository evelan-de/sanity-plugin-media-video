import { defineField, defineType } from 'sanity';

// TODO: Check how to achieve translation for this one
const MediaObject = () => {
  return defineType({
    name: 'media',
    title: 'Media',
    type: 'object',
    fields: [
      defineField({
        name: 'image',
        title: 'Image',
        description: 'Serves as the image preview of the video',
        type: 'mainImage',
        options: { collapsible: false, collapsed: false, hotspot: true },
      }),
      defineField({
        name: 'enableVideo',
        title: 'Enable Video',
        type: 'boolean',
        initialValue: false,
      }),
      defineField({
        name: 'videoType',
        title: 'Video Type',
        type: 'string',
        options: {
          list: [
            { value: 'link', title: 'Link' },
            { value: 'mux', title: 'Mux' },
          ],
          layout: 'radio',
          direction: 'horizontal',
        },
        initialValue: 'link',
        hidden: ({ parent }) => !parent?.enableVideo,
        validation: (Rule) => [
          Rule.custom((fieldValue, context) => {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const parent = context.parent as { [key: string]: unknown } | null;

            if (parent?.enableVideo && !fieldValue) {
              return 'Video Type is required';
            }
            return true;
          }),
        ],
      }),
      defineField({
        name: 'isAutoPlay',
        title: 'Auto Play',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo,
      }),
      defineField({
        name: 'isPipAutomatic',
        title: 'Enable Automatic PiP for Autoplay',
        description:
          'This automatically creates a small floating video player when you scroll past the main video',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo || !parent?.isAutoPlay,
      }),
      defineField({
        name: 'videoUrl',
        title: 'Video Link',
        type: 'url',
        hidden: ({ parent }) => {
          if (!parent?.enableVideo) {
            return true;
          }
          if (parent?.enableVideo && parent?.videoType !== 'link') {
            return true;
          }

          return false;
        },
        validation: (Rule) => [
          Rule.custom((fieldValue, context) => {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const parent = context.parent as { [key: string]: unknown } | null;

            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'link'
            ) {
              return 'Video Link is required';
            }
            return true;
          }),
          Rule.uri({ scheme: ['http', 'https'] }),
        ],
      }),
      defineField({
        name: 'muxVideo',
        title: 'Mux Video',
        type: 'mux.video',
        options: { collapsible: false, collapsed: false },
        hidden: ({ parent }) => {
          if (!parent?.enableVideo) {
            return true;
          }
          if (parent?.enableVideo && parent?.videoType !== 'mux') {
            return true;
          }

          return false;
        },
        validation: (Rule) => [
          Rule.custom((fieldValue, context) => {
            // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
            const parent = context.parent as { [key: string]: unknown } | null;

            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'mux'
            ) {
              return 'Mux Video is required';
            }
            return true;
          }),
        ],
      }),
    ],
  });
};

export default MediaObject;
