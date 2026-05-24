// @ts-nocheck
/**
 * Enterprise Mobile Security Service
 * Implements: SSL Pinning, Jailbreak Detection, Secure Storage, and Biometrics
 */

import { Platform } from 'react-native';
import JailMonkey from 'jail-monkey'; // Root/Jailbreak detection
import RNSecureStorage from 'rn-secure-storage'; // Encrypted Storage
import { fetch } from 'react-native-ssl-pinning'; // SSL Pinning

class SecurityService {
    
    /**
     * Run initial security checks on app launch
     */
    static async initializeSecurityChecks() {
        if (__DEV__) return; // Skip in development
        
        // 1. Root / Jailbreak Detection
        if (JailMonkey.isJailBroken()) {
            throw new Error("SECURITY_VIOLATION: Device is compromised (Rooted/Jailbroken).");
        }
        
        // 2. Emulator / Mock Location Detection
        if (JailMonkey.canMockLocation() || JailMonkey.isRunOnEmulator()) {
            throw new Error("SECURITY_VIOLATION: App cannot run on emulators or mocked environments.");
        }
    }

    /**
     * Store tokens securely using Keystore (Android) / Keychain (iOS)
     */
    static async storeSecureToken(key: string, value: string) {
        return RNSecureStorage.set(key, value, {
            accessible: 'AccessibleWhenUnlocked'
        });
    }

    /**
     * Retrieve secure token
     */
    static async getSecureToken(key: string) {
        return RNSecureStorage.get(key);
    }

    /**
     * Delete secure token
     */
    static async removeSecureToken(key: string) {
        return RNSecureStorage.remove(key);
    }

    /**
     * Perform an API request with strict SSL Pinning
     * Prevents Man-In-The-Middle (MITM) attacks
     */
    static async secureApiRequest(endpoint: string, method = 'GET', body = null) {
        const token = await this.getSecureToken('auth_token');
        const url = `https://api.codebyvishu.in${endpoint}`;

        return fetch(url, {
            method: method,
            timeoutInterval: 10000, 
            body: body ? JSON.stringify(body) : '',
            sslPinning: {
                certs: ["codebyvishu_cert"] // Public key certificate stored in native bundle
            },
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
    }
}

export default SecurityService;
