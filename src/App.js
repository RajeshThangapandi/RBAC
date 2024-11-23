import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Navbar from './components/NavBar';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserManagement from './components/usermanagment';
import RoleManagement from './components/rolemanagement';
import PermissionsManagement from './components/permissionmanagement';

const theme = createTheme({
  // Customize your theme here if needed
  palette: {
    primary: {
      main: '#1976d2',  // Primary color
    },
    secondary: {
      main: '#d32f2f',  // Secondary color
    },
    common: {
      white: '#ffffff',  // White color definition
    },
  },
});

const App = () => {
  return (
    <AppProvider>
      <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<UserManagement />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/permissions" element={<PermissionsManagement />} />
        </Routes>
      </Router>
      </ThemeProvider>
    
    </AppProvider>
  );
};

export default App;
