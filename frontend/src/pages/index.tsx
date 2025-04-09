import Head from 'next/head';
import { useRouter } from 'next/router';
import { Box, Button, Container, Typography, Paper, Grid } from '@mui/material';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>MiniPOS Cloud - Облачна POS система</title>
        <meta name="description" content="Облачна система за синхронизация на касови апарати ELTRADE" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            bgcolor: 'primary.main',
            color: 'white',
            py: 2,
            boxShadow: 1
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Image 
                  src="/logo.png" 
                  alt="MiniPOS Cloud Logo" 
                  width={150} 
                  height={50}
                  priority
                />
              </Box>
              <Box>
                <Button 
                  variant="contained" 
                  color="secondary"
                  sx={{ ml: 2 }}
                  onClick={() => router.push('/auth/login')}
                >
                  Вход
                </Button>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  sx={{ ml: 2 }}
                  onClick={() => router.push('/auth/register')}
                >
                  Регистрация
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8, flexGrow: 1 }}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                MiniPOS Cloud
              </Typography>
              <Typography variant="h5" color="textSecondary" paragraph>
                Облачна система за синхронизация на касови апарати
              </Typography>
              <Typography paragraph>
                Свържете вашите касови апарати ELTRADE в облака и получете достъп до:
              </Typography>
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>Синхронизация на данни за артикули, клиенти и оператори</li>
                <li>Автоматично събиране на информация за продажби и отчети</li>
                <li>Управление на множество обекти от едно място</li>
                <li>Подробни справки и анализ на продажбите</li>
                <li>Cкладови функции и наличности</li>
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="large"
                  onClick={() => router.push('/auth/register')}
                >
                  Регистрирайте се сега
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={3}
                sx={{ 
                  height: '100%', 
                  minHeight: 400, 
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  overflow: 'hidden'
                }}
              >
                {/* Placeholder for product image/illustration */}
                <Typography variant="h6" color="textSecondary">
                  Илюстрация на продукта
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Features */}
          <Box sx={{ mt: 12 }}>
            <Typography variant="h3" component="h2" gutterBottom align="center">
              Нива на услугата
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    Базово ниво
                  </Typography>
                  <Typography align="center" paragraph>
                    Получавайте данни от касовите апарати за отчетите
                  </Typography>
                  <Typography component="ul">
                    <li>Автоматично събиране на Z-отчети</li>
                    <li>Справки по касови апарати</li>
                    <li>Експорт на данни в CSV формат</li>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={4}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    bgcolor: 'primary.light',
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    Разширено ниво
                  </Typography>
                  <Typography align="center" paragraph>
                    Двупосочна синхронизация на данни с касовите апарати
                  </Typography>
                  <Typography component="ul">
                    <li>Всички функции от базовото ниво</li>
                    <li>Управление на артикули и цени</li>
                    <li>Детайлни справки за продажби</li>
                    <li>Управление на клиенти и оператори</li>
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 4, 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    Складово ниво
                  </Typography>
                  <Typography align="center" paragraph>
                    Пълен контрол над стоките и наличностите
                  </Typography>
                  <Typography component="ul">
                    <li>Всички функции от разширеното ниво</li>
                    <li>Следене на наличности по артикули</li>
                    <li>Документи за доставка и изписване</li>
                    <li>Ревизии и инвентаризация</li>
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            py: 3,
            px: 2,
            mt: 'auto',
            backgroundColor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="body2" color="text.secondary" align="center">
              © {new Date().getFullYear()} ELTRADE Ltd. Всички права запазени.
            </Typography>
            <Typography variant="body2" color="text.secondary" align="center">
              <a href="https://eltrade.com" target="_blank" rel="noopener noreferrer">
                www.eltrade.com
              </a>{' | '}
              <a href="https://support.eltrade.com" target="_blank" rel="noopener noreferrer">
                support.eltrade.com
              </a>{' | '}
              <a href="https://partners.eltrade.com" target="_blank" rel="noopener noreferrer">
                partners.eltrade.com
              </a>
            </Typography>
          </Container>
        </Box>
      </Box>
    </>
  );
} 