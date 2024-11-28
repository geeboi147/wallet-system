import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // To interact with the backend
import { Router } from '@angular/router'; // To redirect after registration
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [FormsModule],
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    const payload = { name: this.name, email: this.email, password: this.password };
    this.http.post('http://localhost:5000/api/auth/register', payload).pipe(
      catchError((error) => {
        console.error('Registration failed:', error);
        alert('Registration failed. Please try again.');
        return of(null);
      })
    ).subscribe((response) => {
      if (response) {
        alert('Registration successful!');
        this.router.navigate(['/login']); // Redirect to login
      }
    });
  }
}
