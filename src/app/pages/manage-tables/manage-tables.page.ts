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
import { FormCreationPage } from './../modal/form-creation/form-creation.page';
import { FormModPage } from './../modal/form-mod/form-mod.page'; // DS009.1: Implementación de formulario para modificación de tablas
// Components
import { AlertController } from '@ionic/angular'; // SEJMM DS009.3: Alert mostrado para confirmar borrado de tabla y elemento de tabla.

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
    public modalCtrl: ModalController, // SEJMM DS009; Modal que usaremos como formulario para modificar las tablas
    public alertController: AlertController // SEJMM DS009.3: Alert mostrado para confirmar borrado de tabla y elemento de tabla.
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
   * @description: Presenta la pagina a modo de ion-modal de la clase "FormCreationPage"
   */
  async presentFormCreationModal() {
    const modal = await this.modalCtrl.create({
      component: FormCreationPage,
      mode: 'ios'
    });
    return await modal.present();
  }
  /**
   * @description: Presenta la pagina a modo de ion-modal de la clase "FormModPage"
   * @param table: Tabla a presentar en el modal
   */
  async presentFormModModal(table: string) {
    const modal = await this.modalCtrl.create({
      component: FormModPage,
      componentProps: { 'tableNameInput': table },
      mode: 'ios'
    });
    return await modal.present();
  }

  /**
   * SEJMM DS009.3: Alert mostrado para confirmar borrado de tabla y elemento de tabla.
   * @description: Presenta el alert para confirmación de borrado
   * @param table: Tabla a presentar en el modal
   */
  async presentAlertConfirmDeletion(tableName: string) {
    const tableNameUpperCase: string = tableName.toUpperCase();
    const alert = await this.alertController.create({
      header: 'Borrar Tabla ' + tableNameUpperCase,
      message: '¿Está seguro de que desea <strong>eliminar la tabla definitivamente</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            console.log('Borrado confirmado');
            this.db.deleteTable(tableName);
          }
        }
      ],
      mode: 'ios'
    });

    await alert.present();
  }


  /**
   * @description Presenta alert para confirmar borrado de una tabla de DB.
   * @param tableName Tabla para borrar de DB.
   */
  deleteTable(tableName: string) {
    this.presentAlertConfirmDeletion(tableName);
  }

}
