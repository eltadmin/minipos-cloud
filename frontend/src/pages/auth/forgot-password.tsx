import { useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Container,
  TextField,
  Typography,
  Paper,
  Button,
  Alert,
} from '@mui/material';
import Image from 'next/image';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Моля, въведете имейл адрес.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // API заявка към бекенда за възстановяване на парола
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Грешка при изпращане на заявката');
      }
      
      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Възникна грешка, моля опитайте отново.');
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
            Забравена парола
          </Typography>
          
          {!isSubmitted ? (
            <>
              <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                Въведете вашия имейл адрес и ще ви изпратим инструкции за възстановяване на паролата.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Имейл адрес"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  variant="outlined"
                  margin="normal"
                  required
                />

                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                  sx={{ mt:.3, mb: 2 }}
                >
                  {isLoading ? 'Изпращане...' : 'Изпрати инструкции'}
                </Button>

                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Link href="/auth/login" passHref>
                    <Box component="a" sx={{ color: 'primary.main', textDecoration: 'none' }}>
                      Обратно към входа
                    </Box>
                  </Link>
                </Box>
              </Box>
            </>
          ) : (
            <>
              <Alert severity="success" sx={{ mb: 3 }}>
                Изпратихме инструкции за възстановяване на паролата на посочения имейл адрес.
              </Alert>
              
              <Typography variant="body2" paragraph>
                Моля, проверете вашата електронна поща и следвайте инструкциите за възстановяване на паролата. 
                Ако не получите имейл в рамките на няколко минути, проверете и папката със спам.
              </Typography>
              
              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Link href="/auth/login" passHref>
                  <Button variant="contained" color="primary">
                    Обратно към входа
                  </Button>
                </Link>
              </Box>
            </>
          )}
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