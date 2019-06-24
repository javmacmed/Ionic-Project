import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnePalabrasPage } from './une-palabras.page';

const routes: Routes = [
  {
    path: '',
    component: UnePalabrasPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UnePalabrasPage]
})
export class UnePalabrasPageModule {}
