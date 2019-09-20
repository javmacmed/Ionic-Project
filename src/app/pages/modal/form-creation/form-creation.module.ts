import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // SEJMM DS009; Necesario para el control de formularios Reactive es para el template

import { FormCreationPage } from './form-creation.page';
const routes: Routes = [
  {
    path: '',
    component: FormCreationPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // SEJMM DS009;  Necesario para el control de formularios en el template
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormCreationPage],
  entryComponents: [FormCreationPage] // SEJMM DS009; Necesario para poder utilizarlo como un router component y cargarlo imperativamente
})
export class FormCreationPageModule {}
