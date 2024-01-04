'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import * as React from 'react';
import * as z from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Typography,
  TextField,
  Switch,
  Container,
  Stack,
  Box,
  FormControlLabel,
  Button,
} from '@mui/material';
import { SignInIllustration } from '@/components/icons/icons';
import { FloatingAlert } from '@/components/ui/floating-alert';
import { useSearchParams } from 'next/navigation';
import { willDisableSubmit } from '@/lib/form-helpers';
import { Metadata } from 'next';

const signInFormSchema = z.object({
  username: z.string().min(1, 'Username tidak boleh kosong.'),
  password: z.string().min(1, 'Password tidak boleh kosong.'),
  rememberMe: z.boolean(),
});

type SignInFormSchema = z.infer<typeof signInFormSchema>;

export function SignInPanel() {
  const session = useSession();

  const search = useSearchParams();
  const callbackURLError = search.get('error');
  const [errorMessage, setErrorMessage] = React.useState('');

  const [isAlertOn, setIsAlertOn] = React.useState(false);
  const { register, handleSubmit, formState } = useForm<SignInFormSchema>({
    resolver: zodResolver(signInFormSchema),
  });

  const turnOnErrorAlert = React.useCallback((message: string) => {
    setErrorMessage(message);
    setIsAlertOn(true);
    setTimeout(() => setIsAlertOn(false), 3000);
  }, []);

  // Logout if logged in
  React.useEffect(() => {
    if (session.data) {
      signOut({ callbackUrl: '/sign-in', redirect: false });
    }
  }, [session.data]);

  // Handle URL error
  React.useEffect(() => {
    if (callbackURLError) {
      turnOnErrorAlert('Email atau password salah!');
    }
  }, [callbackURLError, turnOnErrorAlert]);

  const onSubmit: SubmitHandler<SignInFormSchema> = async data => {
    try {
      await signIn('credentials', {
        username: data.username,
        password: data.password,
        callbackUrl: '/',
      });
    } catch (error) {
      turnOnErrorAlert('Gagal untuk sign in, silahkan coba di lain waktu!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100%' }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        textAlign="center"
        height="100%"
      >
        <Stack height="100%" justifyContent="center">
          <Box mb={1}>
            <Typography variant="h4" component="p" fontWeight={700}>
              Selamat Datang!
            </Typography>
            <Typography variant="h4" component="h1" fontWeight={700}>
              E-Confection Manager
            </Typography>
          </Box>

          <Typography variant="h6" component="p">
            Mohon isi form dibawah agar bisa mengakses aplikasi.
          </Typography>

          <Stack direction="row" justifyContent="center" my={4}>
            <SignInIllustration />
          </Stack>

          <Stack gap={2} mb={3}>
            <TextField
              label="Username"
              variant="filled"
              error={!!formState.errors.username}
              helperText={formState.errors.username?.message}
              {...register('username')}
            />

            <TextField
              label="Password"
              type="password"
              variant="filled"
              helperText={formState.errors.password?.message}
              error={!!formState.errors.password}
              {...register('password')}
            />
            {/* 
            <FormControlLabel
              sx={{
                width: '100%',
                marginLeft: 0,
                justifyContent: 'space-between',
              }}
              labelPlacement="start"
              control={<Switch {...register('rememberMe')} />}
              label="Remember Me"
            /> */}
          </Stack>

          <Button
            disabled={willDisableSubmit(formState)}
            type="submit"
            variant="contained"
          >
            {formState.isSubmitting ? 'LOADING' : 'SIGN IN'}
          </Button>
        </Stack>
      </Box>

      <FloatingAlert
        isActive={isAlertOn}
        onClose={() => setIsAlertOn(false)}
        severity="error"
      >
        {errorMessage}
      </FloatingAlert>
    </Container>
  );
}
