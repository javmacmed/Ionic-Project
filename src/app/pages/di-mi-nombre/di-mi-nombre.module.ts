import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DiMiNombrePage } from './di-mi-nombre.page';
import { NgArrayPipesModule } from 'ngx-pipes';

// SEJMM DS0003.3 Import Pipes; Dentro está la Tuberia para reordenar aleatoriamente un array desde el template "| alterOrder".
// import { AlterOrderPipe } from '../../alter.order.pipe';
import { PipesModule } from '../../pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: DiMiNombrePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    PipesModule, // SEJMM DS0003.3 Import Pipes
    NgArrayPipesModule
  ],
  declarations: [DiMiNombrePage] // , AlterOrderPipe] // SEJMM DS0003.3 Declaracion de clase AlterOrderPipe.
})
export class DiMiNombrePageModule {}
