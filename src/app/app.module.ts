import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';

import { AngularResizedEventModule } from 'angular-resize-event';

import { SignalrISOdataService } from './services/signalr-ISOdata.service';
import { LoadService } from './services/load.service';
import { LoadResolverService } from './services/load-resolver.service';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { IntroComponent } from './intro/intro.component';

import { IsoChartsComponent } from './iso-charts/iso-charts.component';
import { LoadChartComponent } from './load-chart/load-chart.component';

import { GoogleChartService } from './services/google-chart.service';

import { LmpResolverService } from './services/lmp-resolver.service';
import { LmpService } from './services/lmp.service';
import { LmpChartComponent } from './lmp-chart/lmp-chart.component';


@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    NavbarComponent,
    IntroComponent,
    LoadChartComponent,
    
    IsoChartsComponent,
    LmpChartComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,

    AngularResizedEventModule,
    RouterModule.forRoot([

      { path: 'home', component: HomeComponent },

      {
        path: 'app-iso-charts', component: IsoChartsComponent,
        resolve: { LmpData: LmpResolverService, LoadData: LoadResolverService  },
       
        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'app-iso-charts/app-lmp-chart',
            component: LmpChartComponent,
          },
          {
            
            path: 'app-iso-charts/app-load-chart',
            component: LoadChartComponent,
          }
        ]
      },

      { path: 'app-intro', component: IntroComponent },

      { path: '', redirectTo: '/home', pathMatch: 'full' }
    ],
      {
        onSameUrlNavigation: 'reload'
      }),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [SignalrISOdataService, GoogleChartService, { provide: APP_BASE_HREF, useValue: ' ' }, LoadService, LmpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
