import React, { useState } from 'react';
import { AsyncStorage } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

//axios.defaults.baseURL = 'http://localhost:8000';
//axios.defaults.withCredentials = true

export const AuthContext = React.createContext({});

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (email, password) => {

          axios.post('http://localhost:8000/api/airlock/token', {
            email,
            password,
            device_name: 'mobile'
          })
          .then(res => {
            const userResponse = {
              email: res.data.user.email,
              name: res.data.user.name,
              company: res.data.user.company_id,
              id: res.data.user.id,
              token: res.data.token
            }

            setUser(userResponse)
            SecureStore.setItemAsync('user', JSON.stringify(userResponse))

            console.log(userResponse)
          }).catch(err => {
            console.log(err);
          })
        },
        logout: () => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;

          axios.post('http://localhost:8000/api/logout')
            .then(res => {
              setUser(null);
              SecureStore.deleteItemAsync('user')
            }).catch(err => {
              console.log(err);
            })
        },

        signIn: async (userID, companyID) => {
          console.log(userID, companyID)
          const res = await axios.post('http://localhost:8000/api/timesheet', {
            company_id: companyID,
            job_id: 1,
            user_id: userID,
            started_at: '2020-07-13 22:24:00',
            stopped_at: '',
            total_hours: 2,
          })
        }
      }}>
      {children}
    </AuthContext.Provider>
  );
}
