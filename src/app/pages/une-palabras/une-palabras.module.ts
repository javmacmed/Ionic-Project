import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UnePalabrasPage } from './une-palabras.page';

// SEJMM DS0003.3 Tuberia para reordenar aleatoriamente un array.
import { AlterOrderPipe } from '../../alter.order.pipe';

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
  declarations: [UnePalabrasPage, AlterOrderPipe] // SEJMM DS0003.3 Declaracion de clase AlterOrderPipe.
})
export class UnePalabrasPageModule {}
