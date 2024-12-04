import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { PreloadAllModules } from '@angular/router'; // Optional preloading strategy

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules, // Preload lazy-loaded modules
        enableTracing: false, // Set to true for debugging routing issues
      })
    ),
  ],
})
  .catch((err) => {
    console.error('Bootstrap error:', err);
    // You can integrate an error tracking service here
  });
