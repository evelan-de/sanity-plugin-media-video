import { Button, Spinner, useToast } from '@sanity/ui';
import React, { FC, useCallback, useState } from 'react';
import { useClient, useFormValue } from 'sanity';

import { I18N_NAMESPACE } from '../../utils/constants';
import {
  canResolveThumbnail,
  resolveThumbnailUrl,
} from '../../utils/thumbnailProviders';
import ThumbnailConfirmDialog from './ThumbnailConfirmDialog';

interface GetThumbnailButtonProps {
  videoUrl: string | undefined;
  t: (key: string) => string;
}

const GetThumbnailButton: FC<GetThumbnailButtonProps> = ({ videoUrl, t }) => {
  const client = useClient({ apiVersion: '2024-01-01' });
  const documentId = useFormValue(['_id']) as string | undefined;
  const imageValue = useFormValue(['image']) as { asset?: unknown } | undefined;
  const toast = useToast();

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

        // Use the raw document ID (strip "drafts." prefix if present for patching)
        const rawId = documentId.replace(/^drafts\./, '');

        await client
          .patch(
            documentId.startsWith('drafts.') ? documentId : `drafts.${rawId}`,
          )
          .set({
            'image.asset': {
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
    [client, documentId, toast, t],
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
