import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Button, Drawer, IconButton, List, ListItem } from '@mui/material';
import { styled } from '@mui/system';
import { Menu as MenuIcon, Home, Settings, Lock } from '@mui/icons-material';

const Logo = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  color: '#333333', // Dark color for the logo to ensure visibility on light backgrounds
  fontWeight: 'bold',
  fontSize: '28px',
  textDecoration: 'none',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)', // Logo grows slightly on hover
  },
}));

const NavLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: theme.spacing(4),
  [theme.breakpoints.down('sm')]: {
    display: 'none', // Hide nav links on small screens
  },
}));

const NavItem = styled(Button)(({ theme, isDrawerOpen }) => ({
  color: isDrawerOpen ? '#ffffff' : '#333333', // White color when drawer is open, otherwise black
  textDecoration: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  position: 'relative',
  padding: '8px 12px',
  transition: 'all 0.3s ease', // Smooth hover transition
  '&:hover': {
    color: '#ffffff', // White text on hover
    backgroundColor: '#1976d2', // Blue background on hover
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Hover shadow effect
    transform: 'scale(1.05)', // Slight scale effect on hover
  },
  '&.active': {
    color: '#1976d2', // Active link color
    borderBottom: '2px solid #1976d2', // Underline effect for active link
  },
}));

const DrawerNav = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: '250px',
    backgroundColor: '#263238', // Dark background for the drawer
    color: theme.palette.common.white,
  },
}));

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [activeLink, setActiveLink] = useState('/'); // Track active link

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setScrolling(true);
    } else {
      setScrolling(false);
    }
  };

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        sx={{
          transition: '0.3s',
          boxShadow: scrolling ? 3 : 0, // Adds a subtle shadow when scrolling
          background: scrolling ? 'rgba(0, 0, 0, 0.8)' : 'transparent', // Transparent background initially
          backdropFilter: 'blur(10px)', // Apply blur effect to the background on scroll
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Logo variant="h6">RBAC</Logo>
          </Link>

          {/* Main Navigation Links (Visible on larger screens) */}
          <NavLinks>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <NavItem
                isDrawerOpen={drawerOpen}
                className={activeLink === '/' ? 'active' : ''}
                onClick={() => handleLinkClick('/')}
              >
                <Home /> User Management
              </NavItem>
            </Link>
            <Link to="/roles" style={{ textDecoration: 'none' }}>
              <NavItem
                isDrawerOpen={drawerOpen}
                className={activeLink === '/roles' ? 'active' : ''}
                onClick={() => handleLinkClick('/roles')}
              >
                <Lock /> Role Management
              </NavItem>
            </Link>
            <Link to="/permissions" style={{ textDecoration: 'none' }}>
              <NavItem
                isDrawerOpen={drawerOpen}
                className={activeLink === '/permissions' ? 'active' : ''}
                onClick={() => handleLinkClick('/permissions')}
              >
                <Settings /> Permissions Management
              </NavItem>
            </Link>
          </NavLinks>

          {/* Hamburger Menu Icon for Mobile (Three dots on the right side) */}
          <IconButton
            onClick={handleDrawerToggle}
            color="inherit"
            sx={{ display: { xs: 'block', sm: 'none' } }} // Only show this on smaller screens
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for mobile devices */}
      <DrawerNav anchor="right" open={drawerOpen} onClose={handleDrawerToggle}>
        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '20px' }}>
          <List>
            <ListItem onClick={() => handleLinkClick('/')}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <NavItem isDrawerOpen={drawerOpen} onClick={handleDrawerToggle}>
                  <Home /> User Management
                </NavItem>
              </Link>
            </ListItem>
            <ListItem onClick={() => handleLinkClick('/roles')}>
              <Link to="/roles" style={{ textDecoration: 'none', color: 'inherit' }}>
                <NavItem isDrawerOpen={drawerOpen} onClick={handleDrawerToggle}>
                  <Lock /> Role Management
                </NavItem>
              </Link>
            </ListItem>
            <ListItem onClick={() => handleLinkClick('/permissions')}>
              <Link to="/permissions" style={{ textDecoration: 'none', color: 'inherit' }}>
                <NavItem isDrawerOpen={drawerOpen} onClick={handleDrawerToggle}>
                  <Settings /> Permissions Management
                </NavItem>
              </Link>
            </ListItem>
          </List>
        </Box>
      </DrawerNav>
    </>
  );
};

export default Navbar;
