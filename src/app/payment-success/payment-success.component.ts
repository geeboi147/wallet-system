import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Required for standalone components

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css'],
})
export class PaymentSuccessComponent implements OnInit {
  tx_ref: string | null = null;
  status: string | null = null;
  paymentVerified: boolean = false;
  loading: boolean = false;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    // Capture query parameters from the URL
    this.route.queryParams.subscribe(params => {
      this.tx_ref = params['tx_ref'];
      this.status = params['status'];

      // If payment status is 'successful', verify the payment
      if (this.status === 'successful') {
        this.verifyPayment();
      } else {
        this.error = 'Payment was not successful.';
      }
    });
  }

  // Method to verify the payment with the backend
  verifyPayment(): void {
    if (this.tx_ref) {
      this.loading = true;

      // Retrieve the token from localStorage
      const token = localStorage.getItem('token'); // Replace with your authentication method if different
      if (!token) {
        this.error = 'User not authenticated. Please log in.';
        this.loading = false;
        return;
      }

      console.log('Verifying payment with tx_ref:', this.tx_ref);

      // Send the request to verify the payment with the token in the Authorization header
      this.http.post(
        'http://localhost:5000/api/wallet/verify',  // Ensure this is the correct endpoint for payment verification
        { tx_ref: this.tx_ref },
        { headers: { Authorization: `Bearer ${token}` } }  // Include Authorization header with Bearer token
      ).subscribe(
        (response) => {
          this.paymentVerified = true;
          this.loading = false;
          console.log('Payment verified:', response);
        },
        (error) => {
          this.paymentVerified = false;
          this.loading = false;
          this.error = 'Payment verification failed. Please try again later.';
          console.error('Payment verification failed:', error);

          // Log the full error for debugging
          if (error.error && error.error.message) {
            console.error('Error message from server:', error.error.message);
          }
          if (error.status === 401) {
            console.error('Unauthorized access - check token');
          }
        }
      );
    }
  }
}
