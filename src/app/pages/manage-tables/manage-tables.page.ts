/**
 * Descripción: Componente/pagina que implementa la funcionalidad de crear, modificar o eliminar tablas de la DB.
 * First version: SEJMM DS009 16/08/2019; Desarrollo página manage-tables.
 * */

import { Component, OnInit } from '@angular/core';
import { DatabaseService, Elem } from './../../services/database.service'; // Importamos clases DB
import {
  NavController,
  ModalController } from '@ionic/angular';
// Modals
import {ImagePage } from './../modal/image/image.page';

@Component({
  selector: 'app-manage-tables',
  templateUrl: './manage-tables.page.html',
  styleUrls: ['./manage-tables.page.scss'],
})
export class ManageTablesPage implements OnInit {

  tablesArrayName: string[] = [];
  themeCover = 'assets/img/SayMyName.png'; // SEJMM Imagen portada modificada

  constructor(private db: DatabaseService, // DS002: Base de datos SQLite
    public navCtrl: NavController, // SEJMM DS007: Preparación multitabla
    public modalCtrl: ModalController // SEJMM DS009; Modal que usaremos como formulario para modificar las tablas
  ) { }

  ngOnInit() {
    this.db.getDatabaseState().subscribe(rdy => {
      if (rdy) {
        this.db.loadTables();
        this.db.getTables().subscribe(tables => {
          this.tablesArrayName = tables;
          this.tablesArrayName.sort(function (a, b) {
            if (a < b) { return -1; }
            if (a > b) { return 1; }
            return 0;
          });
        });
      }
    });
  }

  /**
   * @description: Presenta la pagina a modo de ion-modal de la clase "ImagePage"
   * @param image: Imagen a presentar en el modal
   */
  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image },
      mode: 'ios'
    });
    return await modal.present();
  }

  deleteTable(tableName: string) {
    this.db.deleteTable(tableName);
  }

}
