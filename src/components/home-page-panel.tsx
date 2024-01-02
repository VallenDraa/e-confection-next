'use client';

import { Avatar, Box, Container, Stack, Typography } from '@mui/material';
import * as React from 'react';
import { Header } from './ui/header';
import PersonIcon from '@mui/icons-material/Person';
import { grey } from '@mui/material/colors';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function HomePagePanel() {
  const { data } = useSession();
  const router = useRouter();

  return (
    <Stack>
      <Header>
        <Container maxWidth="sm">
          <Box display="flex" gap={2} paddingTop={2}>
            <Avatar
              alt="Avatar"
              variant="circular"
              sx={{
                height: 54,
                width: 54,
                background: grey[100],
                boxShadow: 2,
              }}
            >
              <PersonIcon sx={{ fill: grey[900] }} />
            </Avatar>

            <Stack>
              <Typography
                color={grey[100]}
                variant="subtitle2"
                fontWeight="bold"
              >
                Nice to meet you!
              </Typography>
              <Typography color={grey[100]} variant="h5" fontWeight="bold">
                {data?.user.name}
              </Typography>
            </Stack>
          </Box>

          <Box
            boxShadow={2}
            marginTop={1.5}
            marginBottom={2}
            paddingBlock={1}
            paddingInline={2}
            borderRadius={20}
            bgcolor={grey[100]}
          >
            <Typography color={grey[900]} variant="subtitle1" fontWeight="bold">
              Statistik Hari Ini
            </Typography>
          </Box>
        </Container>
      </Header>
    </Stack>
  );
}
