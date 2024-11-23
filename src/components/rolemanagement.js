import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, TextField, Checkbox, Grid, FormControlLabel, Typography } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';

const RoleManagement = () => {
  const api = axios.create({
    baseURL: 'http://localhost:9000',
    headers: { 'Content-Type': 'application/json' },
  });

  const { roles, addRole, updateRole, deleteRole } = useAppContext();
  const [newRole, setNewRole] = useState({ name: '', permissions: [] });
  const [permissions] = useState(['Read', 'Write', 'Delete']);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [roleToEdit, setRoleToEdit] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (roles.length === 0) {
      api.get('/roles')
        .then((response) => {
          if (response.data && response.data.length > 0) {
            response.data.forEach((role) => {
              if (!roles.some((r) => r.id === role.id)) {
                addRole(role);
              }
            });
          }
        })
        .catch((error) => {
          console.error('Error fetching roles:', error);
        });
    }
  }, [roles, addRole]);

  const handleTogglePermission = (permission) => {
    setNewRole({
      ...newRole,
      permissions: newRole.permissions.includes(permission)
        ? newRole.permissions.filter((p) => p !== permission)
        : [...newRole.permissions, permission],
    });
  };

  const handleAddRole = () => {
    // Validate role name and permissions
    if (!newRole.name.trim()) {
      setError('Role name cannot be empty.');
      return;
    }

    if (newRole.permissions.length === 0) {
      setError('At least one permission must be selected.');
      return;
    }

    if (!roles.some((r) => r.name === newRole.name)) {
      addRole({ ...newRole, id: Date.now() });
      setNewRole({ name: '', permissions: [] });
      setOpenModal(false);
      setError('');
    } else {
      setError('Role already exists!');
    }
  };

  const handleOpenModal = (role) => {
    setEditMode(!!role);
    setRoleToEdit(role);
    setNewRole(role ? { ...role } : { name: '', permissions: [] });
    setOpenModal(true);
    setError('');
  };

  const handleSaveRole = () => {
    // Validate role name and permissions
    if (!newRole.name.trim()) {
      setError('Role name cannot be empty.');
      return;
    }

    if (newRole.permissions.length === 0) {
      setError('At least one permission must be selected.');
      return;
    }

    if (roleToEdit) {
      const updatedRole = { ...roleToEdit, ...newRole };
      updateRole(updatedRole);
      setRoleToEdit(null);
    } else {
      handleAddRole();
    }
    setOpenModal(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Button
        onClick={() => handleOpenModal(null)}
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
      >
        Add Role
      </Button>

      <Table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Permissions</th>
            <th style={{ padding: '10px', textAlign: 'left' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px' }}>{role.name}</td>
              <td style={{ padding: '10px' }}>{role.permissions.join(', ')}</td>
              <td style={{ padding: '10px' }}>
                <Button
                  onClick={() => handleOpenModal(role)}
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: '10px' }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteRole(role.id)}
                  variant="outlined"
                  color="secondary"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {error && (
        <Typography color="error" style={{ marginTop: '20px', textAlign: 'center' }}>
          {error}
        </Typography>
      )}

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div
          className="modal-content"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: '#fff',
            padding: '30px',
            borderRadius: '8px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
            width: '90%',
            maxWidth: '400px',
          }}
        >
          <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '20px' }}>
            {editMode ? 'Edit Role' : 'Add New Role'}
          </Typography>

          <TextField
            label="Role Name"
            variant="outlined"
            fullWidth
            value={newRole.name}
            onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
            style={{ marginBottom: '20px' }}
            error={!!error}
            helperText={error && error.includes('name') ? error : ''}
          />

          <div style={{ marginBottom: '20px' }}>
            <Typography variant="subtitle1">Permissions</Typography>
            {permissions.map((permission) => (
              <FormControlLabel
                key={permission}
                control={
                  <Checkbox
                    checked={newRole.permissions.includes(permission)}
                    onChange={() => handleTogglePermission(permission)}
                    color="primary"
                  />
                }
                label={permission}
                style={{ marginRight: '10px' }}
              />
            ))}
          </div>

          <Button
            onClick={handleSaveRole}
            variant="contained"
            color="primary"
            style={{ width: '100%' }}
          >
            {editMode ? 'Save Changes' : 'Add Role'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default RoleManagement;
