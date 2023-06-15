import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardDiarioComponent } from '../../components/dashboard-diario/dashboard-diario.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';
import { DashboardTempoRealComponent } from '../../components/dashboard-tempoReal/dashboard-tempo-real.component';
import { DashboardMensalComponent } from '../../components/dashboard-mensal/dashboard-mensal.component';
import { PaginaInicialComponent } from '../../components/pagina-inicial/pagina-inicial.component';


const routes: Routes = [
  {path: '', component: HomeComponent,
    children: [
      {path: '', redirectTo: 'inicial', pathMatch: 'full'},
      {path: 'settings', component: SettingsComponent},
      {path: 'edit-user', component: EditUserComponent},
      {path: 'inicial', component: PaginaInicialComponent, children: [
        {path: '', redirectTo: 'dash-diario', pathMatch: 'full'},
        {path: 'dash-diario', pathMatch: 'full', component: DashboardDiarioComponent},
        {path: 'dash-mensal', component: DashboardMensalComponent},
        {path: 'dash-tempo-real', component: DashboardTempoRealComponent}
      ]},
      {
        path: '**',
        redirectTo: 'inicial',
        pathMatch: 'full'
      }
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
