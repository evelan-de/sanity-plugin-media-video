import { defineField, defineType } from 'sanity';

import MediaVideoI18nBooleanInput from '../../../components/sanity/MediaVideoI18nBooleanInput';
import MediaVideoI18nFieldInput from '../../../components/sanity/MediaVideoI18nFieldInput';
import MediaVideoI18nStringListInput from '../../../components/sanity/MediaVideoI18nStringListInput';
import VideoInputField from '../../../components/sanity/VideoInputField';
import { MediaVideoPluginOptions } from '../../../types/MediaVideoPluginOptions';

const mediaObject = (pluginOptions: void | MediaVideoPluginOptions) => {
  const { isImageRequired } = pluginOptions ?? {};

  return defineType({
    name: 'mediaVideo',
    title: 'Media Video',
    type: 'object',
    fields: [
      defineField({
        name: 'image',
        type: 'image',
        options: {
          collapsible: false,
          collapsed: false,
          hotspot: true,
        },
        fields: [
          defineField({
            name: 'altText',
            type: 'string',
            components: {
              field: (props) =>
                MediaVideoI18nFieldInput({
                  fieldProps: props,
                  translationKeys: {
                    title: 'image.altText.title',
                    description: 'image.altText.description',
                  },
                }),
            },
          }),
        ],
        validation: (Rule) =>
          Rule.custom((fieldValue, context) => {
            const parent = context.parent as { [key: string]: unknown } | null;

            // To access this, must prefix first with 'schema', e.g. t('schema:image.required.title')
            // Reference: https://www.sanity.io/docs/internationalizing-plugins-ui#97f12e11fd10
            const t = context.i18n.t;

            if (isImageRequired && !fieldValue) {
              return t('schema:image.required.title');
            }

            // Validate required if enableVideo is true, since we use this as the base thumbnail for the video to help with ssr
            if (!fieldValue && parent?.enableVideo) {
              return t('schema:image.required.title');
            }

            return true;
          }),
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'image.title',
                description: 'image.description',
              },
            }),
        },
      }),
      defineField({
        name: 'enableVideo',
        description: 'Desc',
        type: 'boolean',
        initialValue: false,
        components: {
          input: (props) => {
            return MediaVideoI18nBooleanInput({
              fieldProps: props,
              translationKeys: {
                title: 'enableVideo.title',
                description: 'enableVideo.description',
              },
            });
          },
        },
      }),
      defineField({
        name: 'videoType',
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
            const parent = context.parent as { [key: string]: unknown } | null;
            const t = context.i18n.t;

            // Validate required if enableVideo is true
            if (parent?.enableVideo && !fieldValue) {
              return t('schema:videoType.required.title');
            }

            return true;
          }),
        ],
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'videoType.title',
              },
            }),
          input: (props) =>
            MediaVideoI18nStringListInput({
              fieldProps: props,
              translationKeys: {
                list: ['videoType.link.title', 'videoType.mux.title'],
              },
            }),
        },
      }),
      defineField({
        name: 'isAutoPlay',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo,
        components: {
          input: (props) =>
            MediaVideoI18nBooleanInput({
              fieldProps: props,
              translationKeys: {
                title: 'isAutoPlay.title',
                description: 'isAutoPlay.description',
              },
            }),
        },
      }),
      defineField({
        name: 'isPipAutomatic',
        type: 'boolean',
        initialValue: false,
        hidden: ({ parent }) => !parent?.enableVideo || !parent?.isAutoPlay,
        components: {
          input: (props) =>
            MediaVideoI18nBooleanInput({
              fieldProps: props,
              translationKeys: {
                title: 'isPipAutomatic.title',
                description: 'isPipAutomatic.description',
              },
            }),
        },
      }),
      defineField({
        name: 'videoUrl',
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
            const parent = context.parent as { [key: string]: unknown } | null;
            const t = context.i18n.t;

            // Validate required if enableVideo is true
            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'link'
            ) {
              return t('schema:videoUrl.required.title');
            }

            return true;
          }),
          Rule.uri({ scheme: ['http', 'https'] }),
        ],
        components: {
          input: VideoInputField,
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'videoUrl.title',
              },
            }),
        },
      }),
      defineField({
        name: 'muxVideo',
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
            const parent = context.parent as { [key: string]: unknown } | null;
            const t = context.i18n.t;

            if (
              parent?.enableVideo &&
              !fieldValue &&
              parent.videoType === 'mux'
            ) {
              return t('schema:muxVideo.required.title');
            }

            return true;
          }),
        ],
        components: {
          field: (props) =>
            MediaVideoI18nFieldInput({
              fieldProps: props,
              translationKeys: {
                title: 'muxVideo.title',
              },
            }),
        },
      }),
    ],
  });
};

export default mediaObject;
