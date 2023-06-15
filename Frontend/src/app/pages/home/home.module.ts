import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialUIModule } from 'src/shared/material-UI/material-ui.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatTabsModule} from '@angular/material/tabs';
import {MatSelectModule} from '@angular/material/select';


import { HomeRoutingModule } from './home-routing.module';

import { DashboardDiarioComponent } from '../../components/dashboard-diario/dashboard-diario.component';
import { SettingsComponent } from '../../pages/settings/settings.component';
import { EditUserComponent } from '../../components/edit-user/edit-user.component';
import { DashboardTempoRealComponent } from '../../components/dashboard-tempoReal/dashboard-tempo-real.component';
import { DashboardMensalComponent } from '../../components/dashboard-mensal/dashboard-mensal.component';
import { PaginaInicialComponent } from '../../components/pagina-inicial/pagina-inicial.component';

import { TextCutPipe } from 'src/shared/pipes/text-cut.pipe';
import { DecimalCutPipe } from 'src/shared/pipes/decimal-cut-pipe';



@NgModule({
  declarations: [
    HomeComponent,
    DashboardDiarioComponent,
    SettingsComponent,
    TextCutPipe,
    DecimalCutPipe,
    EditUserComponent,
    DashboardTempoRealComponent,
    DashboardMensalComponent,
    PaginaInicialComponent,

  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialUIModule,
    MatSidenavModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTabsModule,
    MatSelectModule
  ],
  providers: [
    MatDatepickerModule, MatNativeDateModule
  ]
})
export class HomeModule { }
