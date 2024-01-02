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

type ConfirmAddDialogProps = {
  message?: string;
  onAdd: () => void;
  children: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => React.ReactNode;
};

export function ConfirmAddDialog(props: ConfirmAddDialogProps) {
  const { children, onAdd, message } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      {children(setOpen)}
      <Dialog PaperProps={{ square: false }} open={open} onClose={setOpen}>
        <Header>
          <Box display="flex" alignItems="center" px={3}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={700}
              color={grey[200]}
            >
              Data Akan Di Tambahkan
            </Typography>
          </Box>
        </Header>

        <DialogContent>
          <Typography>
            {message ||
              `Apakah anda yakin ingin menambahkan data ini? Data yang telah ditambakan tidak bisa diedit di kemudian hari!`}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpen(false)}
            variant="contained"
            color="error"
          >
            BATAL
          </Button>
          <Button
            onClick={() => {
              onAdd();
              setOpen(false);
            }}
            variant="contained"
            color="success"
          >
            TAMBAH
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
