import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Button,
  Alert,
  Divider,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Проверка дали потребителят идва от страницата за регистрация
  useEffect(() => {
    if (router.query.registered === 'true') {
      setSuccessMessage('Регистрацията е успешна! Моля, влезте с вашите данни.');
    }
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Невалиден имейл или парола');
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('Възникна грешка. Моля, опитайте отново.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
    >
      <Box
        component="header"
        sx={{
          p: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Link href="/" passHref>
          <Box component="a" sx={{ display: 'inline-block' }}>
            <Image 
              src="/logo.png" 
              alt="MiniPOS Cloud Logo" 
              width={150} 
              height={50}
              priority
            />
          </Box>
        </Link>
      </Box>

      <Container maxWidth="sm" sx={{ mt: 4, mb: 8, flexGrow: 1 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Вход в системата
          </Typography>
          
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Влезте в своя акаунт за управление на касовите апарати
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Имейл"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Парола"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              margin="normal"
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Link href="/auth/forgot-password" passHref>
                <Box component="a" sx={{ color: 'primary.main', textDecoration: 'none', fontSize: '0.875rem' }}>
                  Забравена парола?
                </Box>
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Влизане...' : 'Вход'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="textSecondary">
                или
              </Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Нямате акаунт?{' '}
                <Link href="/auth/register" passHref>
                  <Box component="a" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Регистрирайте се тук
                  </Box>
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          mt: 'auto',
          backgroundColor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} ELTRADE Ltd. Всички права запазени.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
} 