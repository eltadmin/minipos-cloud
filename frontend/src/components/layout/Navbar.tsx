import { AppBar, IconButton, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountMenu from './AccountMenu';

interface NavbarProps {
  drawerWidth: number;
  onDrawerToggle: () => void;
}

export default function Navbar({ drawerWidth, onDrawerToggle }: NavbarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          MiniPOS Cloud
        </Typography>

        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
} 