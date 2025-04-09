import { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Симулиране на зареждане на данни
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MainLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Регистрирани каси
              </Typography>
              <Typography component="p" variant="h4">
                3
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Активни потребители
              </Typography>
              <Typography component="p" variant="h4">
                7
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Продажби днес
              </Typography>
              <Typography component="p" variant="h4">
                42
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6} lg={3}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                height: 140,
              }}
            >
              <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Приход днес
              </Typography>
              <Typography component="p" variant="h4">
                2,740 лв.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </MainLayout>
  );
} 