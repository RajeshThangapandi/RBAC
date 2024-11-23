import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Context
const AppContext = createContext();

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);

// Helper function to load data from localStorage or return default data
const loadDataFromStorage = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const roles = JSON.parse(localStorage.getItem('roles')) || [
    { id: 1, name: 'Admin', permissions: ['Read', 'Write', 'Delete'] },
    { id: 2, name: 'Editor', permissions: ['Read', 'Write'] },
    { id: 3, name: 'Viewer', permissions: ['Read'] },
  ];

 

  return { users, roles };
};

// Helper function to save data to localStorage
const saveDataToStorage = (users, roles) => {
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('roles', JSON.stringify(roles));
};

export const AppProvider = ({ children }) => {
  // Load initial state from localStorage
  const { users: initialUsers, roles: initialRoles } = loadDataFromStorage();

  const [users, setUsers] = useState(initialUsers);
  const [roles, setRoles] = useState(initialRoles);

  // Sync context data with localStorage whenever it changes
  useEffect(() => {
    saveDataToStorage(users, roles);
  }, [users, roles]);

  // CRUD operations for users
  const addUser = (user) => setUsers((prev) => [...prev, user]);
  const updateUser = (updatedUser) => {
    setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  };
  const deleteUser = (id) => setUsers((prev) => prev.filter((user) => user.id !== id));

  // CRUD operations for roles
  const addRole = (role) => setRoles((prev) => [...prev, role]);
  
  const updateRole = (updatedRole) => {
    setRoles((prev) => {
      // Update the role with matching id
      return prev.map((role) => role.id === updatedRole.id ? updatedRole : role);
    });
  };
  
  const deleteRole = (id) => setRoles((prev) => prev.filter((role) => role.id !== id));

  return (
    <AppContext.Provider value={{ users, roles, addUser, updateUser, deleteUser, addRole, updateRole, deleteRole }}>
      {children}
    </AppContext.Provider>
  );
};
