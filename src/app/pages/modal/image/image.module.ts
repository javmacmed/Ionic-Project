import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // SEJMM DS009; Necesario para el control de formularios

import { ImagePage } from './image.page';
const routes: Routes = [
  {
    path: '',
    component: ImagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ImagePage],
  entryComponents: [ImagePage]
})
export class ImagePageModule {}
