import { Routes } from '@angular/router';
import { WalletComponent } from './wallet/wallet.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { AuthGuard } from './auth/auth.guard';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'wallet', 
    component: WalletComponent, 
    canActivate: [AuthGuard], // Ensure guard is applied correctly
  },
  { path: 'payment-success', component: PaymentSuccessComponent },
  //{ path: '**', redirectTo: 'login', pathMatch: 'full' }, // Catch-all for undefined routes
];
