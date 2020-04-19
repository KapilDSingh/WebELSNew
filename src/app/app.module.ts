import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { APP_BASE_HREF } from '@angular/common';
import { environment } from '../environments/environment';

import { AngularResizedEventModule } from 'angular-resize-event';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

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
import { GenMixComponent } from './gen-mix/gen-mix.component';
import { GenmixResolverService } from './services/genmix-resolver.service';
import { MeterResolverService } from './services/meter-resolver.service';
import { MeterChartsComponent } from './meter-charts/meter-charts.component';
import { KwChartComponent } from './kw-chart/kw-chart.component';


@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    NavbarComponent,
    IntroComponent,
    LoadChartComponent,
    
    IsoChartsComponent,
    LmpChartComponent,
    GenMixComponent,
    MeterChartsComponent,
    KwChartComponent,
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
        resolve: { LmpData: LmpResolverService, LoadData: LoadResolverService, GenmixData: GenmixResolverService},

        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'app-iso-charts/app-lmp-chart',
            component: LmpChartComponent,
          },
          {
            path: 'app-iso-charts/app-load-chart',
            component: LoadChartComponent,
          },
          {
            path: 'app-iso-charts/app-gen-mix',
            component: GenMixComponent,
          }
        ]
      },
      {
        path: 'app-meter-charts', component: MeterChartsComponent,
        resolve: { MeterData: MeterResolverService },

        runGuardsAndResolvers: 'always',
        children: [
          {
            path: 'app-meter-charts/app-kw-chart',
            component: KwChartComponent,
          },
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
