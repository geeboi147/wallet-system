import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwtDecode

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';
  private isLoggedIn = false;
  private token: string | null = null;

  constructor(private http: HttpClient) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
      this.isLoggedIn = true;
      console.log('Token found in localStorage:', storedToken);  // Debugging log
    }
  }

  // Register a new user
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { name, email, password }).pipe(
      catchError((error) => {
        console.error('Registration error:', error);
        throw error;
      })
    );
  }

  // Login the user
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      catchError((error) => {
        console.error('Login error:', error);
        throw error;
      })
    );
  }

  // Logout the user
  logout() {
    this.isLoggedIn = false;
    this.token = null;
    localStorage.removeItem('token');
    console.log('User logged out, token removed from localStorage');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    console.log('Checking authentication status:', this.token); // Debugging log
    return !!this.token;
  }

  // Save the JWT token in localStorage
  setToken(token: string) {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
    console.log('Token set:', token);  // Debugging log
  }

  // Get the stored JWT token
  getToken(): string | null {
    return this.token || localStorage.getItem('token');
  }

  // Decode the JWT token
  decodeToken(): any {
    const token = this.getToken();
    if (!token) {
      console.error('No token found');
      return null;
    }
    
    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded token:', decoded);  // Debugging log
      // Check for expiration
      const now = Date.now() / 1000;  // Current time in seconds
      if (decoded.exp && decoded.exp < now) {
        console.error('Token expired');
        this.logout();  // Optionally log out the user if the token is expired
        return null;
      }
      return decoded;
    } catch (error) {
      console.error('Token decoding error:', error);
      return null;
    }
  }
}
