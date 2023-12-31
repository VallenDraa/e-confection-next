import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import * as React from 'react';
import { Header } from './header';
import { grey } from '@mui/material/colors';

type ConfirmDeleteDialogProps = {
  isOpen?: boolean;
  changeOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  onDelete: () => void;
  children?: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
};

export function ConfirmDeleteDialog(props: ConfirmDeleteDialogProps) {
  const { children, onDelete, isOpen, changeOpen } = props;
  const [open, setOpen] = React.useState(isOpen ?? false);

  return (
    <>
      {children?.(setOpen)}
      <Dialog
        PaperProps={{ square: false }}
        open={isOpen !== undefined ? isOpen : open}
        onClose={changeOpen ?? setOpen}
      >
        <Header type="danger">
          <Box display="flex" alignItems="center" px={3}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={700}
              color={grey[200]}
            >
              Data Akan Di Hapus
            </Typography>
          </Box>
        </Header>

        <DialogContent>
          <Typography>
            Data yang telah dihapus tidak dapat di kembalikan. Apakah anda yakin
            ingin melanjutkan proses penghapusan?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              changeOpen?.(false);
              setOpen(false);
            }}
            variant="contained"
            color="success"
          >
            BATAL
          </Button>
          <Button
            onClick={() => {
              onDelete();
              setOpen(false);
              changeOpen?.(false);
            }}
            variant="contained"
            color="error"
          >
            HAPUS
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
