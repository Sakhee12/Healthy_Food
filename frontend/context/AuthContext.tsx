import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
    isLoggedIn: boolean;
    login: (phone: string, token: string) => void;
    logout: () => void;
    userPhone: string | null;
    token: string | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userPhone, setUserPhone] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        const loadAuthData = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('authToken');
                const storedPhone = await AsyncStorage.getItem('userPhone');
                if (storedToken && storedPhone) {
                    setToken(storedToken);
                    setUserPhone(storedPhone);
                    setIsLoggedIn(true);
                }
            } catch (error) {
                console.error('Failed to load auth data:', error);
            } finally {
                setLoading(false);
            }
        };
        loadAuthData();
    }, []);

    const login = async (phone: string, authToken: string) => {
        try {
            setIsLoggedIn(true);
            setUserPhone(phone);
            setToken(authToken);
            await AsyncStorage.setItem('authToken', authToken);
            await AsyncStorage.setItem('userPhone', phone);
        } catch (error) {
            console.error('Failed to save auth data:', error);
        }
    };

    const logout = async () => {
        try {
            setIsLoggedIn(false);
            setUserPhone(null);
            setToken(null);
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userPhone');
        } catch (error) {
            console.error('Failed to clear auth data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{
            isLoggedIn,
            login,
            logout,
            userPhone,
            token,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
};
