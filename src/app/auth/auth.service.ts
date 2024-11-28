import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';  // Correct import for jwtDecode

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
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.token;
  }

  // Save the JWT token in localStorage
  setToken(token: string) {
    this.token = token;
    this.isLoggedIn = true;
    localStorage.setItem('token', token);
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
      return jwtDecode(token);  // Call jwtDecode function
    } catch (error) {
      console.error('Token decoding error:', error);
      return null;
    }
  }
  
}
