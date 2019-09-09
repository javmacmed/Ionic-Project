import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  // SEJMM DS001 Esta primera linea redirige a la pagina inicial de la app
  { path: '', redirectTo: 'home-results', pathMatch: 'full' },
  { path: 'login', loadChildren: './pages/login/login.module#LoginPageModule' },
  { path: 'register', loadChildren: './pages/register/register.module#RegisterPageModule' },
  { path: 'home-results', loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule' },
  { path: 'about', loadChildren: './pages/about/about.module#AboutPageModule' },
  { path: 'settings', loadChildren: './pages/settings/settings.module#SettingsPageModule' },
  { path: 'edit-profile', loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule' },
  { path: 'une-palabras/:tableName', loadChildren: './pages/une-palabras/une-palabras.module#UnePalabrasPageModule' }, // SEJMM DS007; Preparación multitabla
  { path: 'manage-tables', loadChildren: './pages/manage-tables/manage-tables.module#ManageTablesPageModule' },
  { path: 'select-table', loadChildren: './pages/select-table/select-table.module#SelectTablePageModule' },
  { path: 'select-game/:tableName', loadChildren: './pages/select-game/select-game.module#SelectGamePageModule' },
  { path: 'di-mi-nombre/:tableName', loadChildren: './pages/di-mi-nombre/di-mi-nombre.module#DiMiNombrePageModule' },
  { path: 'results', loadChildren: './pages/results/results.module#ResultsPageModule' },
  { path: 'show-results/:tableName', loadChildren: './pages/show-results/show-results.module#ShowResultsPageModule' } // SEJMM DS011
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
