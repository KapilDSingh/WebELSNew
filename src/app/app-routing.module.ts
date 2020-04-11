import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { IsoChartsComponent } from './iso-charts/iso-charts.component';
import { LmpResolverService } from './services/lmp-resolver.service';
import { LoadResolverService } from './services/load-resolver.service';
import { LmpChartComponent } from './lmp-chart/lmp-chart.component';
import { LoadChartComponent } from './load-chart/load-chart.component';
import { IntroComponent } from './intro/intro.component';
import { OriginalComponent } from './original/original.component';
import { NgModule } from '@angular/core';



const routes: Routes = [{ path: 'home', component: HomeComponent },
{
  path:'app-iso-charts', component: IsoChartsComponent,
  resolve: { LmpData: LmpResolverService, LoadData: LoadResolverService },

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

{ path: 'app-original', component: OriginalComponent },

{ path: '', redirectTo: '/home', pathMatch: 'full' },

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  onSameUrlNavigation: 'reload'
}

