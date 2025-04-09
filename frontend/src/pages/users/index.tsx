import { Typography } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';

export default function UsersPage() {
  return (
    <MainLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Потребители
      </Typography>
      <Typography paragraph>
        Страницата е в процес на разработка. Тук ще бъде показан списъкът с всички потребители.
      </Typography>
    </MainLayout>
  );
} 