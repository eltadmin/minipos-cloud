import { ReactNode, useState } from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '@/styles/theme';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

const drawerWidth = 240;

export default function MainLayout({ children }: MainLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        
        <Navbar 
          drawerWidth={drawerWidth} 
          onDrawerToggle={handleDrawerToggle} 
        />
        
        <Sidebar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          onDrawerToggle={handleDrawerToggle}
        />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
          }}
        >
          {/* Toolbar spacer */}
          <Box sx={{ height: 64 }} />
          
          {/* Main content */}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
} 