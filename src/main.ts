import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes'; // Your route setup
import { AppComponent } from './app/app.component';

// Bootstrap the application with HttpClientModule and RouterModule
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, RouterModule.forRoot(routes)), // Provide globally
  ],
})
  .catch((err) => console.error(err));
