/*
This file is the authentication manager for the frontend.
It handles the storage and retrieval of authentication tokens.
and provides methods for logging in, logging out, and refreshing sessions
by using local storage to store the tokens and expiry time.
*/
import logger from './logger';

class AuthManager {
    static TOKEN_KEY = 'accessToken';
    static EXPIRY_KEY = 'tokenExpiry';
    static SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

    static setToken(token) {
        try {
            const expiry = Date.now() + this.SESSION_DURATION;
            localStorage.setItem(this.TOKEN_KEY, token);
            localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
            logger.info('🔑 Access token stored securely');
        } catch (error) {
            logger.error('❌ Failed to store access token', error);
            throw new Error('Failed to store authentication token');
        }
    }

    static getToken() {
        try {
            const token = localStorage.getItem(this.TOKEN_KEY);
            const expiry = parseInt(localStorage.getItem(this.EXPIRY_KEY));

            if (!token || !expiry) {
                logger.debug('🔒 No token found or token expired');
                return null;
            }

            // Check if token has expired
            if (Date.now() > expiry) {
                logger.info('⏰ Token expired, clearing session');
                this.clearSession();
                return null;
            }

            return token;
        } catch (error) {
            logger.error('❌ Error retrieving token', error);
            return null;
        }
    }

    static clearSession() {
        try {
            localStorage.removeItem(this.TOKEN_KEY);
            localStorage.removeItem(this.EXPIRY_KEY);
            logger.info('🧹 Session cleared successfully');
        } catch (error) {
            logger.error('❌ Error clearing session', error);
        }
    }

    static async logout() {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`,
                }
            });

            if (!response.ok) {
                throw new Error('Logout failed');
            }

            this.clearSession();
            logger.info('👋 User logged out successfully');
        } catch (error) {
            logger.error('❌ Logout error', error);
            throw error;
        }
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static async refreshSession() {
        try {
            const token = this.getToken();
            if (!token) {
                logger.debug('🔒 No token available for refresh');
                return false;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Session refresh failed');
            }

            const data = await response.json();
            this.setToken(data.access_token);
            logger.info('🔄 Session refreshed successfully');
            return true;
        } catch (error) {
            logger.error('❌ Session refresh failed', error);
            this.clearSession();
            return false;
        }
    }
}

export default AuthManager; 