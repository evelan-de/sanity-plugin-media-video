import * as Dialog from '@radix-ui/react-dialog';
import { Box, Button, Card, Flex, Text } from '@sanity/ui';
import React, { FC } from 'react';

interface ThumbnailConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  thumbnailUrl: string;
  confirmLabel: string;
  cancelLabel: string;
  title: string;
  description: string;
}

const ThumbnailConfirmDialog: FC<ThumbnailConfirmDialogProps> = ({
  open,
  onConfirm,
  onCancel,
  thumbnailUrl,
  confirmLabel,
  cancelLabel,
  title,
  description,
}) => {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 1001,
            maxWidth: '500px',
            width: '90vw',
          }}
        >
          <Card padding={4} radius={2} shadow={2}>
            <Flex direction='column' gap={4}>
              <Dialog.Title asChild>
                <Text size={2} weight='bold'>
                  {title}
                </Text>
              </Dialog.Title>

              <Box>
                <img
                  src={thumbnailUrl}
                  alt='YouTube thumbnail preview'
                  style={{
                    width: '100%',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                />
              </Box>

              <Dialog.Description asChild>
                <Text size={1} muted>
                  {description}
                </Text>
              </Dialog.Description>

              <Flex gap={2} justify='flex-end'>
                <Button mode='ghost' text={cancelLabel} onClick={onCancel} />
                <Button
                  tone='primary'
                  text={confirmLabel}
                  onClick={onConfirm}
                />
              </Flex>
            </Flex>
          </Card>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ThumbnailConfirmDialog;
