import { Routes } from '@angular/router';
import { WalletComponent } from './wallet/wallet.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LandingComponent } from './landing/landing.component';
import { AuthGuard } from './auth/auth.guard'; // Guard to protect the wallet route

export const routes: Routes = [
  { path: '', component: LandingComponent }, // Default route
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'wallet', component: WalletComponent, canActivate: [AuthGuard] }, // Protected wallet route
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Catch-all for undefined routes
];
