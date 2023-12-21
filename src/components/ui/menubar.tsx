'use client';

import * as React from 'react';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeTwoToneIcon from '@mui/icons-material/HomeTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import { Header } from './header';
import { grey } from '@mui/material/colors';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Menubar() {
  const [value, setValue] = React.useState('home');
  const [willLogout, setWillLogout] = React.useState(false);
  const router = useRouter();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === 'keluar') {
      setWillLogout(true);
    } else {
      setValue(newValue);

      router.push(newValue === 'home' ? '/' : `/${newValue}`);
    }
  };

  return (
    <>
      <BottomNavigation
        sx={{
          width: '100%',
          boxShadow: 3,
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          position: 'fixed',
          bottom: 0,
        }}
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeTwoToneIcon />}
        />
        <BottomNavigationAction
          label="Barang"
          value="barang"
          icon={<AssignmentTwoToneIcon />}
        />
        <BottomNavigationAction
          label="Karyawan"
          value="karyawan"
          icon={<PeopleTwoToneIcon />}
        />
        <BottomNavigationAction
          label="Keluar"
          value="keluar"
          icon={<LogoutTwoToneIcon />}
        />
      </BottomNavigation>

      <Dialog
        PaperProps={{ square: false }}
        open={willLogout}
        onClose={setWillLogout}
      >
        <Header type="danger">
          <Box display="flex" alignItems="center" px={3}>
            <Typography
              component="h2"
              variant="h6"
              fontWeight={700}
              color={grey[200]}
            >
              Apakah anda ingin keluar?
            </Typography>
          </Box>
        </Header>

        <DialogContent>
          <Typography>
            Jika anda keluar, maka anda harus melakukan proses sign in lagi.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setWillLogout(false)}
            variant="contained"
            color="success"
          >
            BATAL
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: '/sign-in' })}
            variant="contained"
            color="error"
          >
            KELUAR
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
