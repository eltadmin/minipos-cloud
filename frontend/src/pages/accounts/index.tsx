import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon, Business as BusinessIcon } from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';

// Типове данни
interface Account {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  serviceTier: number;
}

export default function AccountsPage() {
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Състояния за диалога за създаване на акаунт
  const [openDialog, setOpenDialog] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [accountDescription, setAccountDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState('');

  // Зареждаме акаунтите при първоначално зареждане
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Функция за зареждане на акаунтите от API
  const fetchAccounts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Предполагаме, че сме запазили токена в localStorage
        },
      });
      
      if (!response.ok) {
        throw new Error('Грешка при зареждане на акаунтите');
      }
      
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError('Възникна проблем при зареждане на акаунтите. Моля, опитайте отново.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция за отваряне на диалога за създаване на акаунт
  const handleOpenDialog = () => {
    setOpenDialog(true);
    setAccountName('');
    setAccountDescription('');
    setDialogError('');
  };

  // Функция за затваряне на диалога
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Функция за създаване на нов акаунт
  const handleCreateAccount = async () => {
    if (!accountName.trim()) {
      setDialogError('Моля, въведете име на акаунта.');
      return;
    }
    
    setIsSubmitting(true);
    setDialogError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: accountName,
          description: accountDescription || null,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Грешка при създаване на акаунт');
      }
      
      // Добавяме новия акаунт към списъка
      const newAccount = await response.json();
      setAccounts([...accounts, newAccount]);
      
      // Затваряме диалога
      handleCloseDialog();
      
      // Пренасочваме потребителя към новия акаунт
      router.push(`/accounts/${newAccount.id}/dashboard`);
    } catch (err) {
      setDialogError(err instanceof Error ? err.message : 'Възникна грешка при създаване на акаунта');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Функция за влизане в акаунт
  const handleEnterAccount = (accountId: string) => {
    router.push(`/accounts/${accountId}/dashboard`);
  };

  // Функция за показване на нивото на услугата като текст
  const getServiceTierName = (tier: number): string => {
    switch (tier) {
      case 1:
        return 'Базово ниво';
      case 2:
        return 'Разширено ниво';
      case 3:
        return 'Складово ниво';
      default:
        return 'Неизвестно ниво';
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            Моите акаунти
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
          >
            Създай нов акаунт
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        ) : accounts.length === 0 ? (
          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <BusinessIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Нямате създадени акаунти
            </Typography>
            <Typography color="text.secondary" paragraph>
              Създайте нов акаунт, за да започнете да управлявате вашите касови апарати.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
              sx={{ mt: 2 }}
            >
              Създай първия си акаунт
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {accounts.map((account) => (
              <Grid item xs={12} md={6} lg={4} key={account.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderColor: account.isActive ? 'primary.main' : 'error.main',
                    borderWidth: 1,
                    borderStyle: 'solid',
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" component="h2" gutterBottom>
                      {account.name}
                    </Typography>
                    
                    <Box sx={{ mt: 1, mb: 2 }}>
                      <Typography variant="caption" color="text.secondary">
                        Ниво на услугата
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {getServiceTierName(account.serviceTier)}
                      </Typography>
                    </Box>
                    
                    {account.description && (
                      <Typography color="text.secondary" paragraph>
                        {account.description}
                      </Typography>
                    )}
                    
                    <Typography variant="caption" color="text.secondary">
                      Създаден на: {new Date(account.createdAt).toLocaleDateString()}
                    </Typography>
                    
                    {!account.isActive && (
                      <Alert severity="warning" sx={{ mt: 2 }}>
                        Този акаунт е деактивиран
                      </Alert>
                    )}
                  </CardContent>
                  
                  <Divider />
                  
                  <CardActions>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="primary"
                      onClick={() => handleEnterAccount(account.id)}
                      disabled={!account.isActive}
                    >
                      {account.isActive ? 'Влез в акаунта' : 'Деактивиран'}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Диалог за създаване на нов акаунт */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="create-account-dialog-title"
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id="create-account-dialog-title">
          Създаване на нов акаунт
        </DialogTitle>
        
        <DialogContent>
          {dialogError && (
            <Alert severity="error" sx={{ mb: 3, mt: 1 }}>
              {dialogError}
            </Alert>
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Име на акаунта"
            fullWidth
            required
            variant="outlined"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            helperText="Въведете име за вашия бизнес акаунт"
            sx={{ mb: 2, mt: 1 }}
          />
          
          <TextField
            margin="dense"
            label="Описание (незадължително)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={accountDescription}
            onChange={(e) => setAccountDescription(e.target.value)}
            helperText="Кратко описание на вашия бизнес"
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog} disabled={isSubmitting}>
            Отказ
          </Button>
          <Button 
            onClick={handleCreateAccount} 
            variant="contained" 
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Създаване...' : 'Създай'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
} 