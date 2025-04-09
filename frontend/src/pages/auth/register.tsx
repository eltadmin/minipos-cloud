import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Image from 'next/image';

export default function RegisterPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Моля попълнете всички полета.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Паролите не съвпадат.');
      return;
    }

    setIsLoading(true);

    try {
      // Тук ще бъде добавен API call към бекенда за регистрация
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Грешка при регистрацията');
      }

      // Redirect to login page after successful registration
      router.push('/auth/login?registered=true');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Възникна грешка при регистрацията.');
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
            Създаване на акаунт
          </Typography>
          
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
            Регистрирайте се, за да управлявате вашите касови апарати в облака
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Име"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Имейл адрес"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Парола"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Потвърдете паролата"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  variant="outlined"
                  required
                />
              </Grid>
            </Grid>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Регистрация...' : 'Регистрирайте се'}
            </Button>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                Вече имате акаунт?{' '}
                <Link href="/auth/login" passHref>
                  <Box component="a" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                    Влезте тук
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