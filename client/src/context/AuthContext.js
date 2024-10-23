import { createContext, useState } from "react";
import { baseUrl, postRequest } from "../utils/servise.js";
import axios from 'axios';

const INITIAL_STATE = {
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

export const AuthContextProvider = ({ children }) => {
  const [registerError, setRegisterError] = useState(null);
  const [registerLoading, setIsRegisterLoading] = useState(false);
  const [registerSuccess, setregisterSuccess] = useState(null);
  const [success, setIsSuccess] = useState(false);
  const [toerror, setIstoError] = useState(false);

  const registerUser = async (formDataWithInterests) => {
    setIsRegisterLoading(true);
    setregisterSuccess(null); 
    setRegisterError(null);    
    setIsSuccess(false);
    setIstoError(false);

    try {
      const response = await postRequest(
        `${baseUrl}/auth/register`,
        JSON.stringify({ formDataWithInterests }),
        {
          headers: {
            'Content-Type': 'application/json',  
          },
        }
      );


      if (response.message === "You successfully registered!") {
        setIsSuccess(true);
        setIstoError(false);

        setregisterSuccess(response);   
        
      } else {
        console.log("δεν ειναι")
        setIsSuccess(false);
        setIstoError(true);

        setRegisterError(response || 'Unknown error occurred');
      }

    } catch (error) {
      setRegisterError(error.response?.data?.message || 'Registration failed');  
    } finally {
      setIsRegisterLoading(false);  

    }
  };


  const getParticipants = async () => {
      try {
          const response = await axios.get(`${baseUrl}/auth/getparticipants`, {
              headers: {
                  'Content-Type': 'application/json',
              },
          });
  
          if (response.status === 200) {
              const contentType = response.headers['content-type'];
              if (contentType && contentType.includes('application/json')) {
                  return response.data; 
              } else {
                  console.error("Expected JSON but got:", response.data);
                  return [];
              }
          } else {
              console.error("Failed to fetch participants. Status:", response.status);
              return [];
          }
      } catch (error) {
          console.error("Error fetching participants:", error);
          return [];
      }
  };
  

  return (
    <AuthContext.Provider
      value={{
        registerUser,
        registerError,
        registerLoading,
        registerSuccess,
        success,
        toerror,
        getParticipants
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
