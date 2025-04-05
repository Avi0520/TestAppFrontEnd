// user-storage.service.ts
import { Injectable } from '@angular/core';

interface UserData {
  id: number;
  role: 'ADMIN' | 'USER';
  email?: string;
  name?: string;
  // Add other optional properties as needed
}

const USER_STORAGE_KEY = 'quiz_app_user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {
  constructor() {}

  // Save user data to localStorage
  static saveUser(user: UserData): void {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  // Get user data from localStorage
  static getUser(): UserData | null {
    try {
      const userData = localStorage.getItem(USER_STORAGE_KEY);
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      // Basic validation
      if (typeof parsed?.id !== 'number' || !['ADMIN', 'USER'].includes(parsed?.role)) {
        this.signOut(); // Clear invalid data
        return null;
      }
      return parsed as UserData;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.signOut(); // Clear corrupted data
      return null;
    }
  }

  // Get user ID
  static getUserId(): number | null {
    return this.getUser()?.id ?? null;
  }

  // Get user role
  static getUserRole(): 'ADMIN' | 'USER' | null {
    return this.getUser()?.role ?? null;
  }

  // Check if admin is logged in
  static isAdminLoggedIn(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  // Check if regular user is logged in
  static isUserLoggedIn(): boolean {
    return this.getUserRole() === 'USER';
  }

  // Check if any user is logged in
  static isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  // Clear user data
  static signOut(): void {
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
    }
  }
}