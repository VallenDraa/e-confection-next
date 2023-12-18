'use client';

import { signIn } from 'next-auth/react';
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
  Alert,
  Fade,
} from '@mui/material';
import { LoginIllustration } from '@/components/icons/icons';
import { FloatingAlert } from '@/components/ui/floating-alert';

const loginFormSchema = z.object({
  username: z.string().min(1, 'Username tidak boleh kosong.'),
  password: z.string().min(1, 'Password tidak boleh kosong.'),
  rememberMe: z.boolean(),
});

type LoginFormSchema = z.infer<typeof loginFormSchema>;

export default function Login() {
  const [isAlertOn, setIsAlertOn] = React.useState(false);
  const { register, handleSubmit, formState } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginFormSchema),
  });

  const onSubmit: SubmitHandler<LoginFormSchema> = async data => {
    try {
      await signIn('credentials', {
        username: data.username,
        password: data.password,
        callbackUrl: '/',
      });
    } catch (error) {
      setIsAlertOn(true);
      setTimeout(() => setIsAlertOn(false), 3000);
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
            <LoginIllustration />
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

            <FormControlLabel
              sx={{
                width: '100%',
                marginLeft: 0,
                justifyContent: 'space-between',
              }}
              labelPlacement="start"
              control={<Switch {...register('rememberMe')} />}
              label="Remember Me"
            />
          </Stack>

          <Button
            disabled={
              !formState.isDirty || !formState.isValid || formState.isSubmitting
            }
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
        Gagal untuk login, silahkan coba di lain waktu.
      </FloatingAlert>
    </Container>
  );
}
