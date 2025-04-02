import { Injectable } from '@angular/core';

// Define a constant key to store user data in localStorage
const USER = 'q_user';

@Injectable({
  providedIn: 'root',
})
export class UserStorageService {
  constructor() {}

  // Method to save user data in localStorage
  static saveUser(user: any): void {
    // First, remove any existing user data
    window.localStorage.removeItem(USER);
    // Then, store the new user data as a JSON string
    window.localStorage.setItem(USER, JSON.stringify(user));
  }

  // Method to retrieve user data from localStorage
  static getUser(): any {
    const user = localStorage.getItem(USER);
    return user ? JSON.parse(user) : null; // Return null if no user is found
  }

  // Method to get the user ID
  static getUserId(): number | null {
    const user = this.getUser(); // Get the user object
    return user ? user.id : null; // Return the user ID or null if no user is found
  }

  // Method to get the user role
  static getUserRole(): string | null {
    const user = this.getUser(); // Get the user object
    return user ? user.role : null; // Return the user role or null if no user is found
  }

  // Method to check if an admin user is logged in
  static isAdminLoggedIn(): boolean {
    const role = this.getUserRole(); // Get the user role
    return role === 'ADMIN'; // Return true if the role is 'ADMIN', otherwise false
  }

  // Method to check if a normal user (not admin) is logged in
  static isUserLoggedIn(): boolean {
    const role = this.getUserRole(); // Get the user role
    return role === 'USER'; // Return true if the role is 'USER', otherwise false
  }

  // Method to sign out the user (remove user data)
  static signOut(): void {
    window.localStorage.removeItem(USER); // Remove user data from localStorage
  }
}