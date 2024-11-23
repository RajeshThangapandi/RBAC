import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel, Box } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const PermissionsManagement = () => {
  const { roles, updateRole } = useAppContext();
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState([
    'Read', 'Write', 'Delete', 'Execute'
  ]); // Available permissions to be assigned

  useEffect(() => {
    // Initialize with the first role or any other way to select a role
    if (roles.length > 0) {
      setSelectedRole(roles[0]);
    }
  }, [roles]);

  // Handle permission toggle for the selected role
  const handleTogglePermission = (permission) => {
    if (!selectedRole) return;

    const updatedPermissions = selectedRole.permissions.includes(permission)
      ? selectedRole.permissions.filter(p => p !== permission)
      : [...selectedRole.permissions, permission];

    const updatedRole = { ...selectedRole, permissions: updatedPermissions };

    // Update the role in the context (or via API if needed)
    updateRole(updatedRole);
    setSelectedRole(updatedRole); // Update local state
  };

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        Manage Permissions
      </Typography>

      {/* Select Role to modify permissions */}
      <Grid container spacing={2} sx={{ marginBottom: '20px' }}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole ? selectedRole.id : ''}
              onChange={(e) => setSelectedRole(roles.find(role => role.id === e.target.value))}
              label="Select Role"
            >
              {roles.map(role => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Permission toggles for selected role */}
      {selectedRole && (
        <Box sx={{ marginBottom: '20px' }}>
          <Typography variant="h6">Assign Permissions to {selectedRole.name}</Typography>
          <Grid container spacing={2} sx={{ marginTop: '10px' }}>
            {permissions.map(permission => (
              <Grid item xs={12} sm={6} key={permission}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedRole.permissions.includes(permission)}
                      onChange={() => handleTogglePermission(permission)}
                      color="primary"
                    />
                  }
                  label={permission}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Display current permissions for selected role */}
      {selectedRole && selectedRole.permissions.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Current Permissions for {selectedRole.name}:
          </Typography>
          <ul>
            {selectedRole.permissions.map(permission => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </Box>
      )}

      {/* Save Button */}
      <Box sx={{ marginTop: '20px' }}>
        <Button 
          onClick={() => updateRole(selectedRole)} 
          variant="contained" 
          color="primary" 
          fullWidth
        >
          Save Permissions
        </Button>
      </Box>
    </Box>
  );
};

export default PermissionsManagement;
