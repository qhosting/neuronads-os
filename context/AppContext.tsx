import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { User, UserRole } from '../types';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'TRANSACTION' | 'INFO' | 'ERROR' | 'SUCCESS';
}

interface AppContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const login = (role: UserRole) => {
    setUser({ id: 'USR-' + Math.random().toString(36).substr(2, 4).toUpperCase(), role, nodeName: 'ALPHA-NODE' });
  };

  const logout = () => {
    setUser(null);
  };

  const removeNotification = useCallback((id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Date.now();
    const newNotif = { ...notification, id };
    setNotifications((prev) => [newNotif, ...prev]);
    setTimeout(() => removeNotification(id), 5000);
  }, [removeNotification]);

  return (
    <AppContext.Provider value={{ user, login, logout, notifications, addNotification, removeNotification }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
