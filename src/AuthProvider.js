import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

axios.defaults.baseURL = 'http://airlock-example.test';

export const AuthContext = React.createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (email, password) => {
          
          const fakeUser = {
            email: 'bob@bob.com',
            token: 'fake-token'
          }

          setUser(fakeUser)
          SecureStore.setItemAsync('user', JSON.stringify(fakeUser))
        },
        logout: () => {
          setUser(null);
          SecureStore.deleteItemAsync('user')
        }
      }}>
      {children}
    </AuthContext.Provider>
  );
}
