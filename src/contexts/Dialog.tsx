import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { LoadingButtonProps } from '@mui/lab/LoadingButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';
import { createContext, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { FCC } from 'types/react';
import Logger from 'utils/Logger';
import sleep from 'utils/sleep';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

type Operation = () => Promise<void> | void;

interface Options {
  icon?: ReactNode;
  headline?: string;
  supportingText?: ReactNode;
  content?: ReactNode;
  color?: LoadingButtonProps['color'];
  onConfirm?: Operation;
  onCancel?: Operation | false;
  hideAccept?: boolean;
}

const noop = async () => { };

export type DialogContextValue = (options: Options) => void;

export const DialogContext = createContext<DialogContextValue | null>(null);

const DialogProvider: FCC = (props) => {
  const { children } = props;
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<Options>({});
  const [resolve, setResolve] = useState<Operation>(noop);
  const [reject, setReject] = useState<Operation | false>(noop);

  const handleConfirm = useCallback((options: Options) => {
    const {
      headline,
      supportingText,
      content,
      color,
      icon,
      hideAccept,
      onConfirm = noop,
      onCancel = noop,
    } = options;

    setOptions({ headline, supportingText, content, color, icon, hideAccept });
    setResolve(() => onConfirm);
    setReject(() => onCancel);

    setOpen(true);
  }, []);

  const handleClose = async () => {
    setOpen(false);
    await sleep(350);

    setResolve(noop);
    setReject(noop);
    setLoading(false);
  };

  const handleResolve = async () => {
    try {
      setLoading(true);
      await resolve();
    } catch (error) {
      Logger.log(error);
    } finally {
      handleClose();
    }
  };

  const handleReject = () => {
    if (typeof reject === 'function') {
      reject();
    }
    handleClose();
  };

  const { headline, supportingText, content, color, hideAccept } = options;

  return (
    <DialogContext.Provider value={handleConfirm}>
      {children}
      <Dialog
        open={open}
        onClose={handleReject}
        scroll="paper"
        maxWidth="xs"
        PaperProps={{ elevation: 3 }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            <HelpOutlineIcon />
            {headline}
          </Typography>
          <IconButton onClick={handleReject}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ p: 3 }}>
          {supportingText ? (
            <Typography variant="subtitle1">{supportingText}</Typography>
          ) : (
            content
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            px: 2,
            py: 1.5,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
        >
          <Stack>
            {(hideAccept === undefined || hideAccept === false) && <LoadingButton
              loading={loading}
              color={color}
              // startIcon={<CheckIcon />}
              onClick={handleResolve}
            >
              {t('Đồng ý')}
            </LoadingButton>
            }
            {typeof reject === 'function' && (
              <Button
                variant="outlined"
                color="inherit"
                // startIcon={<CloseIcon />}
                onClick={handleReject}
              >
                {t('Hủy')}
              </Button>
            )}
          </Stack>
        </Box>
      </Dialog>
    </DialogContext.Provider>
  );
};

export default DialogProvider;
