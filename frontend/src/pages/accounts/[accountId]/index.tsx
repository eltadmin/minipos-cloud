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
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Store as StoreIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
} from '@mui/icons-material';
import MainLayout from '@/components/layout/MainLayout';

// Типове данни
interface Account {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  createdAt: string;
  serviceTier: number;
  schemaName: string;
}

interface Location {
  id: string;
  name: string;
  address: string;
  accountId: string;
  cashRegisters: CashRegister[];
}

interface CashRegister {
  id: string;
  serialNumber: string;
  fiscalMemoryNumber: string;
  registrationNumber: string;
  status: 'active' | 'inactive' | 'demo' | 'suspended';
  locationId: string;
  accountId: string;
  subscriptionExpiresAt: string | null;
  lastSyncAt: string | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

// Компонент за табове
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AccountDetailsPage() {
  const router = useRouter();
  const { accountId } = router.query;
  
  const [account, setAccount] = useState<Account | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  
  // Състояния за диалога за създаване на обект
  const [openLocationDialog, setOpenLocationDialog] = useState(false);
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [isSubmittingLocation, setIsSubmittingLocation] = useState(false);
  const [locationDialogError, setLocationDialogError] = useState('');

  // Състояния за диалога за добавяне на касов апарат
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [registerSerialNumber, setRegisterSerialNumber] = useState('');
  const [registerFiscalNumber, setRegisterFiscalNumber] = useState('');
  const [registerRegistrationId, setRegisterRegistrationId] = useState('');
  const [isSubmittingRegister, setIsSubmittingRegister] = useState(false);
  const [registerDialogError, setRegisterDialogError] = useState('');

  // Зареждаме данните при първоначално зареждане
  useEffect(() => {
    if (accountId) {
      fetchAccountData();
    }
  }, [accountId]);

  // Функция за промяна на активния таб
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Функция за зареждане на данните за акаунта
  const fetchAccountData = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Зареждаме данните за акаунта
      const accountResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${accountId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!accountResponse.ok) {
        throw new Error('Грешка при зареждане на данните за акаунта');
      }
      
      const accountData = await accountResponse.json();
      setAccount(accountData);
      
      // Зареждаме обектите за този акаунт
      const locationsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${accountId}/locations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!locationsResponse.ok) {
        throw new Error('Грешка при зареждане на обектите');
      }
      
      const locationsData = await locationsResponse.json();
      setLocations(locationsData);
    } catch (err) {
      setError('Възникна проблем при зареждане на данните. Моля, опитайте отново.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция за отваряне на диалога за създаване на обект
  const handleOpenLocationDialog = () => {
    setOpenLocationDialog(true);
    setLocationName('');
    setLocationAddress('');
    setLocationDialogError('');
  };

  // Функция за затваряне на диалога за създаване на обект
  const handleCloseLocationDialog = () => {
    setOpenLocationDialog(false);
  };

  // Функция за създаване на нов обект
  const handleCreateLocation = async () => {
    if (!locationName.trim()) {
      setLocationDialogError('Моля, въведете име на обекта.');
      return;
    }
    
    setIsSubmittingLocation(true);
    setLocationDialogError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${accountId}/locations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: locationName,
          address: locationAddress,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Грешка при създаване на обект');
      }
      
      // Добавяме новия обект към списъка
      const newLocation = await response.json();
      setLocations([...locations, newLocation]);
      
      // Затваряме диалога
      handleCloseLocationDialog();
    } catch (err) {
      setLocationDialogError(err instanceof Error ? err.message : 'Възникна грешка при създаване на обекта');
    } finally {
      setIsSubmittingLocation(false);
    }
  };

  // Функция за отваряне на диалога за добавяне на касов апарат
  const handleOpenRegisterDialog = (locationId: string) => {
    setOpenRegisterDialog(true);
    setSelectedLocationId(locationId);
    setRegisterSerialNumber('');
    setRegisterFiscalNumber('');
    setRegisterRegistrationId('');
    setRegisterDialogError('');
  };

  // Функция за затваряне на диалога за добавяне на касов апарат
  const handleCloseRegisterDialog = () => {
    setOpenRegisterDialog(false);
  };

  // Функция за добавяне на касов апарат
  const handleAddCashRegister = async () => {
    if (!registerSerialNumber.trim() || !registerFiscalNumber.trim() || !registerRegistrationId.trim()) {
      setRegisterDialogError('Моля, попълнете всички задължителни полета.');
      return;
    }
    
    setIsSubmittingRegister(true);
    setRegisterDialogError('');
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/${accountId}/locations/${selectedLocationId}/registers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          serialNumber: registerSerialNumber,
          fiscalMemoryNumber: registerFiscalNumber,
          registrationNumber: registerRegistrationId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Грешка при добавяне на касов апарат');
      }
      
      // Обновяваме списъка с обекти, за да се покаже новият касов апарат
      await fetchAccountData();
      
      // Затваряме диалога
      handleCloseRegisterDialog();
    } catch (err) {
      setRegisterDialogError(err instanceof Error ? err.message : 'Възникна грешка при добавяне на касовия апарат');
    } finally {
      setIsSubmittingRegister(false);
    }
  };

  // Функция за показване на статуса на касов апарат като текст и цвят
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return { label: 'Активен', color: 'success' as const };
      case 'inactive':
        return { label: 'Неактивен', color: 'default' as const };
      case 'demo':
        return { label: 'Демо', color: 'info' as const };
      case 'suspended':
        return { label: 'Прекратен', color: 'error' as const };
      default:
        return { label: 'Неизвестен', color: 'default' as const };
    }
  };

  // Функция за форматиране на дата
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Няма данни';
    return new Date(dateString).toLocaleDateString();
  };

  // Функция за показване на ниво на услуга като текст
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

  if (isLoading) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/accounts')}
          >
            Назад към акаунтите
          </Button>
        </Container>
      </MainLayout>
    );
  }

  if (!account) {
    return (
      <MainLayout>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning">
            Акаунтът не е намерен
          </Alert>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push('/accounts')}
            sx={{ mt: 2 }}
          >
            Назад към акаунтите
          </Button>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* Заглавие и информация за акаунта */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={9}>
              <Typography variant="h4" component="h1" gutterBottom>
                {account.name}
              </Typography>
              {account.description && (
                <Typography color="text.secondary" paragraph>
                  {account.description}
                </Typography>
              )}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
                <Chip
                  label={`ID: ${account.id}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`База данни: ${account.schemaName}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={`Създаден на: ${formatDate(account.createdAt)}`}
                  variant="outlined"
                  size="small"
                />
                <Chip
                  label={getServiceTierName(account.serviceTier)}
                  color="primary"
                  size="small"
                />
                <Chip
                  label={account.isActive ? 'Активен' : 'Деактивиран'}
                  color={account.isActive ? 'success' : 'error'}
                  size="small"
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start' }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<SettingsIcon />}
                onClick={() => router.push(`/accounts/${accountId}/settings`)}
              >
                Настройки
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Табове */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="account tabs">
            <Tab label="Обекти и касови апарати" />
            <Tab label="Потребители" />
          </Tabs>
        </Box>

        {/* Секция Обекти и Касови апарати */}
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Обекти
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleOpenLocationDialog}
              disabled={!account.isActive}
            >
              Добави обект
            </Button>
          </Box>

          {locations.length === 0 ? (
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              <StoreIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Няма създадени обекти
              </Typography>
              <Typography color="text.secondary" paragraph>
                Добавете обект, за да можете да регистрирате касови апарати към него.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleOpenLocationDialog}
                sx={{ mt: 2 }}
                disabled={!account.isActive}
              >
                Добави първия обект
              </Button>
            </Paper>
          ) : (
            <Grid container spacing={3}>
              {locations.map((location) => (
                <Grid item xs={12} key={location.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" component="h3">
                          {location.name}
                        </Typography>
                        <Box>
                          <IconButton
                            color="primary"
                            aria-label="редактирай обект"
                            disabled={!account.isActive}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            aria-label="изтрий обект"
                            disabled={!account.isActive}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      
                      {location.address && (
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          Адрес: {location.address}
                        </Typography>
                      )}

                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="subtitle1" gutterBottom>
                        Касови апарати
                      </Typography>

                      {location.cashRegisters && location.cashRegisters.length > 0 ? (
                        <List>
                          {location.cashRegisters.map((register) => {
                            const statusInfo = getStatusInfo(register.status);
                            return (
                              <ListItem key={register.id} divider>
                                <ListItemIcon>
                                  <BusinessIcon />
                                </ListItemIcon>
                                <ListItemText
                                  primary={`${register.serialNumber} (${register.fiscalMemoryNumber})`}
                                  secondary={
                                    <>
                                      <Typography component="span" variant="body2">
                                        Рег. номер: {register.registrationNumber}
                                      </Typography>
                                      <br />
                                      <Typography component="span" variant="body2">
                                        Последна синхронизация: {register.lastSyncAt ? formatDate(register.lastSyncAt) : 'Няма'}
                                      </Typography>
                                      {register.subscriptionExpiresAt && (
                                        <>
                                          <br />
                                          <Typography component="span" variant="body2">
                                            Абонамент до: {formatDate(register.subscriptionExpiresAt)}
                                          </Typography>
                                        </>
                                      )}
                                    </>
                                  }
                                />
                                <Chip
                                  label={statusInfo.label}
                                  color={statusInfo.color}
                                  size="small"
                                  sx={{ mr: 2 }}
                                />
                                <ListItemSecondaryAction>
                                  <IconButton
                                    edge="end"
                                    aria-label="настройки на касов апарат"
                                    onClick={() => router.push(`/accounts/${accountId}/registers/${register.id}`)}
                                  >
                                    <SettingsIcon />
                                  </IconButton>
                                </ListItemSecondaryAction>
                              </ListItem>
                            );
                          })}
                        </List>
                      ) : (
                        <Typography color="text.secondary" sx={{ ml: 2 }}>
                          Няма регистрирани касови апарати в този обект
                        </Typography>
                      )}

                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenRegisterDialog(location.id)}
                        sx={{ mt: 2 }}
                        disabled={!account.isActive}
                      >
                        Добави касов апарат
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        {/* Секция Потребители */}
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Потребители с достъп до акаунта
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              disabled={!account.isActive}
            >
              Добави потребител
            </Button>
          </Box>

          <Paper
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <PeopleAltIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Функцията е в процес на разработка
            </Typography>
            <Typography color="text.secondary" paragraph>
              Управлението на потребителите ще бъде достъпно в следващите версии на приложението.
            </Typography>
          </Paper>
        </TabPanel>

        {/* Диалог за създаване на обект */}
        <Dialog
          open={openLocationDialog}
          onClose={handleCloseLocationDialog}
          aria-labelledby="create-location-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="create-location-dialog-title">
            Добавяне на нов обект
          </DialogTitle>
          
          <DialogContent>
            {locationDialogError && (
              <Alert severity="error" sx={{ mb: 3, mt: 1 }}>
                {locationDialogError}
              </Alert>
            )}
            
            <TextField
              autoFocus
              margin="dense"
              label="Име на обекта"
              fullWidth
              required
              variant="outlined"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              helperText="Въведете име за обекта, например: Магазин София Център"
              sx={{ mb: 2, mt: 1 }}
            />
            
            <TextField
              margin="dense"
              label="Адрес (незадължително)"
              fullWidth
              variant="outlined"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              helperText="Адрес на обекта"
            />
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseLocationDialog} disabled={isSubmittingLocation}>
              Отказ
            </Button>
            <Button 
              onClick={handleCreateLocation} 
              variant="contained" 
              color="primary"
              disabled={isSubmittingLocation}
            >
              {isSubmittingLocation ? 'Създаване...' : 'Създай'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Диалог за добавяне на касов апарат */}
        <Dialog
          open={openRegisterDialog}
          onClose={handleCloseRegisterDialog}
          aria-labelledby="add-register-dialog-title"
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle id="add-register-dialog-title">
            Добавяне на касов апарат
          </DialogTitle>
          
          <DialogContent>
            {registerDialogError && (
              <Alert severity="error" sx={{ mb: 3, mt: 1 }}>
                {registerDialogError}
              </Alert>
            )}
            
            <TextField
              autoFocus
              margin="dense"
              label="Сериен номер"
              fullWidth
              required
              variant="outlined"
              value={registerSerialNumber}
              onChange={(e) => setRegisterSerialNumber(e.target.value)}
              helperText="Въведете серийния номер на касовия апарат"
              sx={{ mb: 2, mt: 1 }}
            />
            
            <TextField
              margin="dense"
              label="Номер на фискалната памет"
              fullWidth
              required
              variant="outlined"
              value={registerFiscalNumber}
              onChange={(e) => setRegisterFiscalNumber(e.target.value)}
              helperText="Номер на фискалната памет"
              sx={{ mb: 2 }}
            />
            
            <TextField
              margin="dense"
              label="Регистрационен номер в НАП"
              fullWidth
              required
              variant="outlined"
              value={registerRegistrationId}
              onChange={(e) => setRegisterRegistrationId(e.target.value)}
              helperText="Регистрационен номер от системата на НАП"
            />
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={handleCloseRegisterDialog} disabled={isSubmittingRegister}>
              Отказ
            </Button>
            <Button 
              onClick={handleAddCashRegister} 
              variant="contained" 
              color="primary"
              disabled={isSubmittingRegister}
            >
              {isSubmittingRegister ? 'Добавяне...' : 'Добави'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
} 