import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Grid,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import MainLayout from '@/components/layout/MainLayout';
import StockLevelsList from '@/components/inventory/StockLevelsList';
import DocumentsList from '@/components/inventory/DocumentsList';
import StockMovementsList from '@/components/inventory/StockMovementsList';
import LocationsList from '@/components/inventory/LocationsList';

enum InventoryTab {
  STOCK = 'stock',
  DOCUMENTS = 'documents',
  MOVEMENTS = 'movements',
  LOCATIONS = 'locations',
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState<InventoryTab>(InventoryTab.STOCK);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stockLevels, setStockLevels] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [movements, setMovements] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Load data based on active tab
    loadTabData(activeTab);
  }, [activeTab]);

  const loadTabData = async (tab: InventoryTab) => {
    setIsLoading(true);
    try {
      switch (tab) {
        case InventoryTab.STOCK:
          // In a real implementation, this would be an API call
          // const response = await api.get('/inventory/stock-levels');
          // setStockLevels(response.data.items);
          setStockLevels([]);
          break;
        case InventoryTab.DOCUMENTS:
          // const docsResponse = await api.get('/inventory/documents');
          // setDocuments(docsResponse.data.items);
          setDocuments([]);
          break;
        case InventoryTab.MOVEMENTS:
          // const movementsResponse = await api.get('/inventory/stock-movements');
          // setMovements(movementsResponse.data.items);
          setMovements([]);
          break;
        case InventoryTab.LOCATIONS:
          // const locationsResponse = await api.get('/inventory/locations');
          // setLocations(locationsResponse.data);
          setLocations([]);
          break;
      }
    } catch (error) {
      console.error('Error loading data for tab', tab, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: InventoryTab) => {
    setActiveTab(newValue);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      );
    }

    switch (activeTab) {
      case InventoryTab.STOCK:
        return <StockLevelsList items={stockLevels} />;
      case InventoryTab.DOCUMENTS:
        return <DocumentsList items={documents} />;
      case InventoryTab.MOVEMENTS:
        return <StockMovementsList items={movements} />;
      case InventoryTab.LOCATIONS:
        return <LocationsList items={locations} />;
      default:
        return null;
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case InventoryTab.DOCUMENTS:
        return 'Нов документ';
      case InventoryTab.LOCATIONS:
        return 'Нов обект';
      default:
        return null;
    }
  };

  const addButtonText = getAddButtonText();

  return (
    <MainLayout>
      <Box mb={3}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="h4" component="h1">
              Инвентар
            </Typography>
          </Grid>
          <Grid item>
            {addButtonText && (
              <Button variant="contained" startIcon={<AddIcon />}>
                {addButtonText}
              </Button>
            )}
          </Grid>
        </Grid>
      </Box>

      <Paper>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="inventory tabs">
            <Tab label="Наличности" value={InventoryTab.STOCK} />
            <Tab label="Документи" value={InventoryTab.DOCUMENTS} />
            <Tab label="Движения" value={InventoryTab.MOVEMENTS} />
            <Tab label="Обекти" value={InventoryTab.LOCATIONS} />
          </Tabs>
        </Box>

        <Box p={2}>
          <Grid container spacing={2} alignItems="center" mb={2}>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Търсене..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {renderTabContent()}
        </Box>
      </Paper>
    </MainLayout>
  );
}