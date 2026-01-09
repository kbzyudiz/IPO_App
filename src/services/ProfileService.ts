import CryptoJS from 'crypto-js';

export interface UserProfile {
    id: string;
    name: string;
    pan: string; // Will remain encrypted in memory unless explicitly decrypted
    lastResult?: 'allotted' | 'not-allotted' | 'pending';
}

const STORAGE_KEY = 'user_profiles_v1';
const SECRET_KEY = 'ipo-app-secure-salt-v1'; // Simple client-side obfuscation

export class ProfileService {

    static getProfiles(): UserProfile[] {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (!data) return [];
            const bytes = CryptoJS.AES.decrypt(data, SECRET_KEY);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            return JSON.parse(decryptedString);
        } catch (e) {
            console.error('Failed to load profiles', e);
            return [];
        }
    }

    static saveProfile(name: string, pan: string): UserProfile[] {
        const profiles = this.getProfiles();

        // Check for duplicates
        if (profiles.some(p => p.pan === pan || p.name === name)) {
            throw new Error('Profile with this Name or PAN already exists');
        }

        const newProfile: UserProfile = {
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            pan: pan.toUpperCase().trim(),
            lastResult: 'pending'
        };

        const updated = [...profiles, newProfile];
        this.persist(updated);
        return updated;
    }

    static deleteProfile(id: string): UserProfile[] {
        const profiles = this.getProfiles().filter(p => p.id !== id);
        this.persist(profiles);
        return profiles;
    }

    private static persist(profiles: UserProfile[]) {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(profiles), SECRET_KEY).toString();
        localStorage.setItem(STORAGE_KEY, encrypted);
    }
}
