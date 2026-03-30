import { Box, Button, Spinner, Text, Tooltip, useToast } from '@sanity/ui';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { Path, useClient, useFormValue } from 'sanity';

import { I18N_NAMESPACE } from '../../utils/constants';
import {
  canResolveThumbnail,
  resolveThumbnailUrl,
} from '../../utils/thumbnailProviders';
import ThumbnailConfirmDialog from './ThumbnailConfirmDialog';

/**
 * Converts a Sanity path array to a dot-notation string for client.patch().set().
 *
 * Examples:
 *   ['media', 'image']                                     → 'media.image'
 *   ['body', {_key: 'abc'}, 'media', 'image']              → 'body[_key=="abc"].media.image'
 *   ['hero', 'media', 'image']                              → 'hero.media.image'
 *   ['sections', {_key: 'a'}, 'content', 'media', 'image'] → 'sections[_key=="a"].content.media.image'
 */
const pathToString = (path: Path): string => {
  return path
    .map((segment) => {
      if (typeof segment === 'string') {
        return segment;
      }
      if (typeof segment === 'object' && '_key' in segment) {
        return `[_key=="${segment._key}"]`;
      }
      return `[${String(segment)}]`;
    })
    .reduce((acc, segment) => {
      if (segment.startsWith('[')) {
        return acc + segment;
      }
      return acc ? `${acc}.${segment}` : segment;
    }, '');
};

interface GetThumbnailButtonProps {
  videoUrl: string | undefined;
  path: Path;
  t: (key: string) => string;
}

const GetThumbnailButton: FC<GetThumbnailButtonProps> = ({
  videoUrl,
  path,
  t,
}) => {
  const client = useClient({ apiVersion: '2024-01-01' });
  const documentId = useFormValue(['_id']) as string | undefined;
  const toast = useToast();

  // Derive sibling image path from current field's path
  // path = [..., 'videoUrl'] → parentPath = [...] → imagePath = [..., 'image']
  const parentPath = useMemo(() => path.slice(0, -1), [path]);
  const imagePath = useMemo(() => [...parentPath, 'image'], [parentPath]);

  const imageValue = useFormValue(imagePath) as { asset?: unknown } | undefined;

  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fetchedThumbnailUrl, setFetchedThumbnailUrl] = useState<string | null>(
    null,
  );

  const isDisabled = !videoUrl || !canResolveThumbnail(videoUrl) || isLoading;

  const uploadAndPatch = useCallback(
    async (thumbnailUrl: string) => {
      if (!documentId) {
        return;
      }

      try {
        const response = await fetch(thumbnailUrl);

        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();

        const asset = await client.assets.upload('image', blob, {
          filename: `youtube-thumbnail.jpg`,
          contentType: 'image/jpeg',
        });

        const patchId = documentId.startsWith('drafts.')
          ? documentId
          : `drafts.${documentId}`;

        const imagePathStr = pathToString(imagePath);

        await client
          .patch(patchId)
          .set({
            [`${imagePathStr}.asset`]: {
              _type: 'reference',
              _ref: asset._id,
            },
          })
          .commit();

        toast.push({
          status: 'success',
          title: t(`${I18N_NAMESPACE}:getThumbnail.success`),
        });
      } catch (error) {
        console.error('Thumbnail upload failed:', error);
        toast.push({
          status: 'error',
          title: t(`${I18N_NAMESPACE}:getThumbnail.error.upload`),
        });
      }
    },
    [client, documentId, imagePath, toast, t],
  );

  const handleClick = useCallback(async () => {
    if (!videoUrl) {
      return;
    }

    setIsLoading(true);

    try {
      const thumbnailUrl = await resolveThumbnailUrl(videoUrl);

      if (!thumbnailUrl) {
        toast.push({
          status: 'error',
          title: t(`${I18N_NAMESPACE}:getThumbnail.error.unsupported`),
        });
        return;
      }

      const hasExistingImage = !!imageValue?.asset;

      if (hasExistingImage) {
        setFetchedThumbnailUrl(thumbnailUrl);
        setDialogOpen(true);
      } else {
        await uploadAndPatch(thumbnailUrl);
      }
    } catch (error) {
      console.error('Thumbnail fetch failed:', error);
      toast.push({
        status: 'error',
        title: t(`${I18N_NAMESPACE}:getThumbnail.error.fetch`),
      });
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl, imageValue, uploadAndPatch, toast, t]);

  const handleDialogConfirm = useCallback(async () => {
    setDialogOpen(false);

    if (fetchedThumbnailUrl) {
      setIsLoading(true);

      try {
        await uploadAndPatch(fetchedThumbnailUrl);
      } finally {
        setIsLoading(false);
        setFetchedThumbnailUrl(null);
      }
    }
  }, [fetchedThumbnailUrl, uploadAndPatch]);

  const handleDialogCancel = useCallback(() => {
    setDialogOpen(false);
    setFetchedThumbnailUrl(null);
  }, []);

  return (
    <>
      <Tooltip
        content={
          <Box padding={2}>
            <Text size={1} muted>
              {t(`${I18N_NAMESPACE}:getThumbnail.button.tooltip`)}
            </Text>
          </Box>
        }
        placement='top'
        portal
      >
        <Button
          text={
            isLoading
              ? undefined
              : t(`${I18N_NAMESPACE}:getThumbnail.button.title`)
          }
          icon={isLoading ? Spinner : undefined}
          mode='ghost'
          tone='primary'
          disabled={isDisabled}
          onClick={handleClick}
          style={{ whiteSpace: 'nowrap' }}
        />
      </Tooltip>
      {fetchedThumbnailUrl && (
        <ThumbnailConfirmDialog
          open={dialogOpen}
          onConfirm={handleDialogConfirm}
          onCancel={handleDialogCancel}
          thumbnailUrl={fetchedThumbnailUrl}
          title={t(`${I18N_NAMESPACE}:getThumbnail.dialog.title`)}
          description={t(`${I18N_NAMESPACE}:getThumbnail.dialog.description`)}
          confirmLabel={t(`${I18N_NAMESPACE}:getThumbnail.dialog.confirm`)}
          cancelLabel={t(`${I18N_NAMESPACE}:getThumbnail.dialog.cancel`)}
        />
      )}
    </>
  );
};

export default GetThumbnailButton;
