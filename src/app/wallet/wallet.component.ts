import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class WalletComponent implements OnInit {
  balance: number = 0;
  withdrawalAmount: number = 0;
  depositAmount: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  private readonly walletApiUrl = 'http://localhost:5000/api/wallet'; // API base URL

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('WalletComponent initialized');
    this.fetchWalletDetails();
  }

  // Fetch wallet details from the backend
  fetchWalletDetails(): void {
    console.log('Fetching wallet details...');
    this.isLoading = true;
    this.error = null;

    const token = localStorage.getItem('token'); // Ensure token key consistency
    if (!token) {
      this.error = 'User not authenticated. Redirecting to login.';
      this.isLoading = false;
      console.error('Authentication error: No token found');
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .get<{ balance: number }>(`${this.walletApiUrl}/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching wallet details:', error);
          this.error = 'Failed to load wallet details. Please try again later.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Wallet details fetched successfully:', response);
          this.balance = response.balance;
        }
        this.isLoading = false;
      });
  }

  // Handle deposit
  onDeposit(): void {
    if (this.depositAmount <= 0) {
      alert('Deposit amount must be greater than zero.');
      return;
    }
  
    console.log('Initiating deposit:', this.depositAmount);
    this.isLoading = true;
    this.error = null;
  
    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      this.isLoading = false;
      return;
    }
  
    const payload = { amount: this.depositAmount };
  
    this.http
      .post<{ message: string; data: any }>(`${this.walletApiUrl}/deposit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((error) => {
          console.error('Error during deposit:', error);
          this.error = 'Deposit failed. Please try again later.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        console.log('Full Deposit response:', response);
  
        if (!response || !response.data || !response.data.data) {
          console.error('Invalid response structure:', response);
          this.error = 'Invalid response from the server. Please try again later.';
          this.isLoading = false;
          return;
        }
  
        const paymentLink = response.data.data.link;
        if (paymentLink && typeof paymentLink === 'string') {
          console.log('Valid payment link received:', paymentLink);
          alert('Deposit initiated! Redirecting to the payment URL.');
          window.location.href = paymentLink;
        } else {
          console.error('Invalid or missing payment link:', paymentLink);
          this.error = 'Payment link not received or invalid. Please try again.';
        }
  
        this.isLoading = false;
      });
  }
  

  // Handle withdrawal
  onWithdraw(): void {
    if (this.withdrawalAmount <= 0 || this.withdrawalAmount > this.balance) {
      alert('Invalid withdrawal amount. Please check your balance.');
      return;
    }

    console.log('Initiating withdrawal:', this.withdrawalAmount);
    this.isLoading = true;
    this.error = null;

    const token = localStorage.getItem('token');
    if (!token) {
      alert('User not authenticated');
      this.isLoading = false;
      return;
    }

    const payload = { amount: this.withdrawalAmount };

    this.http
      .post<{ message: string }>(`${this.walletApiUrl}/withdraw`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .pipe(
        catchError((error) => {
          console.error('Error during withdrawal:', error);
          this.error = 'Withdrawal failed. Please try again later.';
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Withdrawal successful:', response);
          alert('Withdrawal successful!');
          this.balance -= this.withdrawalAmount; // Update balance
          this.withdrawalAmount = 0; // Reset withdrawal input
        } else {
          this.isLoading = false;
        }
      });
  }

  // Logout function
  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem('token'); // Clear the stored token
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
