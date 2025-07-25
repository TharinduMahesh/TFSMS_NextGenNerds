import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts'; // Keep this import

bootstrapApplication(AppComponent, {
  providers: [
    // Spread the existing providers from your appConfig
    ...appConfig.providers,
    // Add the chart providers here
    provideCharts(withDefaultRegisterables()), provideCharts(withDefaultRegisterables())
  ]
})
  .catch(err => console.error(err));
              

