import { Typography } from '@mui/material';
import MainLayout from '@/components/layout/MainLayout';

export default function SettingsPage() {
  return (
    <MainLayout>
      <Typography variant="h4" component="h1" gutterBottom>
        Настройки
      </Typography>
      <Typography paragraph>
        Страницата е в процес на разработка. Тук ще бъдат показани настройките на системата.
      </Typography>
    </MainLayout>
  );
} 