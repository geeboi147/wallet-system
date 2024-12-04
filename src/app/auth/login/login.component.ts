import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service'; // Your AuthService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [FormsModule, RouterModule], // Import necessary modules for standalone component
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false; // Loading state
  error: string | null = null; // Error message state

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Ensure required fields are filled
    if (!this.email || !this.password) {
      this.error = 'Please fill in both email and password.';
      return;
    }
  
    // Start loading state
    this.isLoading = true;
    this.error = null;
  
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
  
        // Store the token securely
        this.authService.setToken(response.token);
  
        // Navigate to the wallet page
        this.router.navigate(['/wallet']).then((success) => {
          if (success) {
            console.log('Navigation to /wallet was successful');
          } else {
            console.error('Navigation to /wallet failed');
          }
        }).catch((error) => {
          console.error('Error during navigation:', error);
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
  
        // Provide a friendly error message to the user
        this.error = 'Invalid credentials. Please check your email and password.';
      },
      complete: () => {
        // Stop the loading spinner
        this.isLoading = false;
      },
    });
  }
}