import React, { useState } from 'react';
import { Button, Modal, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Switch, Typography, Box, IconButton } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import DeleteIcon from '@mui/icons-material/Delete';
import { Search as SearchIcon } from '@mui/icons-material';

const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser, roles } = useAppContext();
  const [newUser, setNewUser] = useState({ name: '', email: '', role: '', status: true });
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Handle opening the modal (for both adding and editing users)
  const handleOpenModal = (user) => {
    setEditMode(!!user);
    setUserToEdit(user);
    setNewUser(user ? { ...user } : { name: '', email: '', role: '', status: true });
    setOpenModal(true);
    setError('');
  };

  // Validate new user data
  const validateUser = () => {
    if (!newUser.name.trim()) {
      setError('User name cannot be empty.');
      return false;
    }
    if (!newUser.email.trim()) {
      setError('Email cannot be empty.');
      return false;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(newUser.email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!newUser.role.trim()) {
      setError('Role must be selected.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSaveUser = () => {
    if (!validateUser()) return;

    // If editing, update the user; if new, add to the list
    if (userToEdit) {
      updateUser({ ...userToEdit, ...newUser });
    } else {
      addUser({ ...newUser, id: Date.now() });
    }
    setOpenModal(false);
  };

  const filteredUsers = [...users] // Add the dummy user to the list
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((user) => (filterRole ? user.role === filterRole : true))
    .filter((user) => (filterStatus !== '' ? user.status === filterStatus : true));

  // Sorting users based on the selected field and order
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name) 
        : b.name.localeCompare(a.name);
    } else if (sortBy === 'email') {
      return sortOrder === 'asc' 
        ? a.email.localeCompare(b.email) 
        : b.email.localeCompare(a.email);
    }
    return 0;
  });

  return (
    <Box sx={{ padding: { xs: '10px', sm: '20px' } }}>
      {/* Hero Section with Search and Filters */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px', 
        flexDirection: { xs: 'column', sm: 'row' }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: { xs: '15px', sm: '0' } }}>
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ marginRight: '10px', width: { xs: '100%', sm: '250px' } }}
            InputProps={{
              startAdornment: <SearchIcon sx={{ marginRight: '8px' }} />,
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ borderRadius: '50px', padding: '10px 20px' }}
            onClick={() => handleOpenModal(null)}
          >
            Add User
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <FormControl variant="outlined" sx={{ minWidth: '150px' }}>
            <InputLabel>Role</InputLabel>
            <Select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              label="Role"
            >
              <MenuItem value="">All</MenuItem>
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: '150px' }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value === 'true')}
              label="Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Active</MenuItem>
              <MenuItem value="false">Inactive</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: '150px' }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="email">Email</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* User Cards */}
      <Grid container spacing={3}>
        {sortedUsers.length === 0 ? (
          <Grid item xs={12}>
            <Box sx={{ padding: '20px', background: '#f7f7f7', borderRadius: '10px', textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                No users available. Please add a user.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{ marginTop: '20px', borderRadius: '50px' }}
                onClick={() => handleOpenModal(null)}
              >
                Add User
              </Button>
            </Box>
          </Grid>
        ) : (
          sortedUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Box sx={{ padding: '20px', background: '#f7f7f7', borderRadius: '10px', boxShadow: 2 }}>
                <Typography variant="h6">{user.name}</Typography>
                <Typography variant="body2" color="textSecondary">{user.email}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                  {user.role}
                </Typography>
                <Box sx={{ marginTop: '10px' }}>
                  <Switch
                    checked={user.status}
                    onChange={() => updateUser({ ...user, status: !user.status })}
                    color="primary"
                  />
                </Box>
                <Box sx={{ marginTop: '15px' }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ borderRadius: '20px', marginRight: '10px' }}
                    onClick={() => handleOpenModal(user)}
                  >
                    Edit
                  </Button>
                  <IconButton
                    onClick={() => deleteUser(user.id)}
                    sx={{ color: 'red' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add/Edit User Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            padding: '30px',
            borderRadius: '10px',
            boxShadow: 3,
            width: { xs: '90%', sm: '400px' }, // Responsive width
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Edit User' : 'Add New User'}
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          <TextField
            label="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              label="Role"
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.name}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <Button variant="outlined" onClick={() => setOpenModal(false)}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveUser}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default UserManagement;
