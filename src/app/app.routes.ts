import { Routes } from '@angular/router';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ResultPageComponent } from './pages/result-page/result-page.component';
import { ConnectionDetailsComponent } from './pages/connection-details/connection-details.component';
import { OnboardComponent } from './pages/onboard/onboard.component';
import { SettingsComponent } from './pages/settings/settings.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
    },
    {
        path: 'search',
        component: SearchPageComponent
    },
    {
        path: 'result',
        component: ResultPageComponent
    },
    {
        path: 'details/:index',
        component: ConnectionDetailsComponent
    },
    {
        path: 'onboard',
        component: OnboardComponent
    },
    {
        path: 'settings',
        component: SettingsComponent
    }
];
