import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // SEJMM DS009.1; Necesario para el control de formularios Reactive es para el template

import { FormModPage } from './form-mod.page';

const routes: Routes = [
  {
    path: '',
    component: FormModPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // SEJMM DS009.1; Necesario para el control de formularios en el template
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FormModPage],
  entryComponents: [FormModPage]
})
export class FormModPageModule {}
