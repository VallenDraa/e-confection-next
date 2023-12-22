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
import { signOut, useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const MENU_NAMES = {
  home: 'home',
  baju: 'baju',
  karyawan: 'karyawan',
  keluar: 'keluar',
};

export default function Menubar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = React.useState(() => {
    if (pathname === '/sign-in' || pathname === '/') {
      return MENU_NAMES.home;
    }

    const currPath = pathname.split('/')[1];
    return currPath in MENU_NAMES ? currPath : MENU_NAMES.home;
  });

  const [willLogout, setWillLogout] = React.useState(false);
  const router = useRouter();
  const session = useSession();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    if (newValue === MENU_NAMES.keluar) {
      setWillLogout(true);
    } else {
      setActiveMenu(newValue);

      router.push(newValue === MENU_NAMES.home ? '/' : `/${newValue}`);
    }
  };

  return !session.data ? null : (
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
        value={activeMenu}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Home"
          value={MENU_NAMES.home}
          icon={<HomeTwoToneIcon />}
        />
        <BottomNavigationAction
          label="Baju"
          value={MENU_NAMES.baju}
          icon={<AssignmentTwoToneIcon />}
        />
        <BottomNavigationAction
          label="Karyawan"
          value={MENU_NAMES.karyawan}
          icon={<PeopleTwoToneIcon />}
        />
        <BottomNavigationAction
          label="Keluar"
          value={MENU_NAMES.keluar}
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
            onClick={() =>
              signOut({
                callbackUrl: '/sign-in',
                redirect: false,
              })
            }
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
