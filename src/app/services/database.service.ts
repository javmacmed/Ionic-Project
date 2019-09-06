/**
 * SEJMM DS002 02/06/2019; Servicio para controlar nuestra base de datos SQLite
 * */

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Elem {
  id: number;
  spanishName: string;
  englishName: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private database: SQLiteObject;
  private dbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private tableReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  selectedTable = new BehaviorSubject<Elem[]>([]); // SEJMM DS007; Preparamos para tabla creada mediante "Crea tu tabla"
  selectedTableForGame = new BehaviorSubject<Elem[]>([]); // SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
  tablesArrayName = new BehaviorSubject<string[]>([]); // SEJMM DS007; Preparamos para multitabla.

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'sayMyName.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  /**
   * @description Importa a la base de datos las tablas de la semilla inicial 'seed.sql' y tras eso activa la bandera dbReady a True.
   * Siempre comprobaremos que el estado de dicha bandera sea True en cualquier componente desde el que utilicemos la base de datos.
   */
  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }
  getTableState() {
    return this.tableReady.asObservable();
  }

  /**
   * SEJMM DS007; Preparamos para tabla creada mediante "Crea tu tabla"
   */
  getSelectedTable(): Observable<Elem[]> {
    return this.selectedTable.asObservable();
  }

   /**
   * SEJMM DS009.2; Fix memory leak  provocado por suscripción y Fix de repetición de tablas provocado por suscripción
   */
  getSelectedTableForGame(): Observable<Elem[]> {
    return this.selectedTableForGame.asObservable();
  }

  /**** SEJMM INI DS007; Preparar base de datos para las multiples tablas creadas mediante "Crea tu tabla" ****/
  /**
   * 28/08/2019 - First version
   * SEJMM DS007
   * @description: Carga lista de elementos aplicando un limite de elementos
   * @param tableName Nombre tabla a cargar
   * @param limit Limite de elementos a cargar
   */
  loadTableForGame(tableName: string, limit: number) {
    let query = 'SELECT * FROM ';
    query = query.concat(tableName + ' LIMIT ' + limit); // DS003.3.1: UPDATE REORDER CON LIMITE
    return this.database.executeSql(query, []).then(data => {
      const table: Elem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          table.push({
            id: data.rows.item(i).id,
            spanishName: data.rows.item(i).spanishName,
            englishName: data.rows.item(i).englishName
          });
        }
      }
      this.selectedTableForGame.next(table);
      this.tableReady.next(true);
    });
  }

  /**
   * 07/08/2019 - First version
   * SEJMM DS007
   * @description: Carga lista de elementos
   * @param tableName
   */
  loadTable(tableName: string) {
    // this.selectedTable = new BehaviorSubject([]); // SEJMM DS009.1; Fix Reinicialización de this.selectedTable para evitar dos tablas en una
    let query = 'SELECT * FROM ';
    query = query.concat(tableName);
    return this.database.executeSql(query, []).then(data => {
      const table: Elem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          table.push({
            id: data.rows.item(i).id,
            spanishName: data.rows.item(i).spanishName,
            englishName: data.rows.item(i).englishName
          });
        }
      }
      this.selectedTable.next(table);
    });
  }
  /**
   * 07/08/2019 - First version
   * SEJMM DS007
   * @description: Añade un elemento a la tabla.
   * @param tableName Tabla a la que se añadirá el elemento
   * @param spanishName Nombre elemento en español
   * @param englishName Nombre elemento en inglés
   */
  addTableElement(tableName: string, spanishName: string, englishName: string) {
    const data = [spanishName, englishName];
    return this.database.executeSql('INSERT INTO ' + tableName + ' (spanishName, englishName) VALUES (?, ?)', data).then(data => {
      this.loadTable(tableName);
    });
  }

  /**
   * 07/08/2019 - First version
   * SEJMM DS007
   * @description: Obtiene y devuelve un elemento de la tabla deseada de la DB en base a un ID
   * @param id: ID para determinar la fila que deseamos obtener
   * @param tableName: Nombre de la tabla desde la cual queremos obtener el elemento
   */
  getTableElement(id: number, tableName: string): Promise<Elem> {
    return this.database.executeSql('SELECT * FROM ? WHERE id = ?', [tableName, id]).then(data => {
      return {
        id: data.rows.item(0).id,
        spanishName: data.rows.item(0).spanishName,
        englishName: data.rows.item(0).englishName
      };
    });
  }

 /**
   * 07/08/2019 - First version
   * SEJMM DS007
   * @description: Borra un elemento de la tabla deseada de la DB en base a un ID
   * @param id: ID para determinar la fila que deseamos borrar
   * @param tableSelected: Nombre de la tabla desde la cual queremos borrar el elemento
   */
  deleteTableElement(id: number, tableSelected: string) {
    const query = 'DELETE FROM ' + tableSelected + ' WHERE id = ' + id;
    return this.database.executeSql(query, []).then(_ => {
      this.loadTable(tableSelected);
    });
  }

  /**
   * 07/08/2019 - First version
   * SEJMM DS007
   * @description: Dado un elemento (Elem), actualiza un elemento de la tabla deseada
   * @param elemento
   * @param tablaSelected
   */
  updateTableElement(elemento: Elem, tablaSelected: string) {
    const query = `UPDATE ` + tablaSelected + ` SET spanishName = '` + elemento.spanishName + `', englishName = '` + elemento.englishName + `' WHERE id = ` + elemento.id;

    // const data = [elemento.spanishName, elemento.englishName];
    return this.database.executeSql(query, []).then(_ => {
      this.loadTable(tablaSelected);
    });
  }

  /**
   * 15/08/2019 - First version
   * SEJMM DS007
   * @description: Crea una tabla en la DB dado un nombre de tabla y recarga la variable observable "tablesArrayName".
   */
  createTable(tableName: string) {
    let query = 'CREATE TABLE IF NOT EXISTS ';
    query = query.concat(tableName + ' (id INTEGER PRIMARY KEY AUTOINCREMENT, spanishName TEXT NOT NULL, englishName TEXT NOT NULL)');
    return this.database.executeSql(query, []).then(data => {
      this.loadTables();
    });
  }

  /**
   * 18/08/2019 - First version
   * SEJMM DS007
   * @description: Borra una tabla de la DB dado un nombre de tabla y recarga la variable observable "tablesArrayName".
   */
  deleteTable(tableName: string) {
    let query = 'DROP TABLE IF EXISTS ';
    query = query.concat(tableName);
    return this.database.executeSql(query, []).then(data => {
      this.loadTables();
    });
  }

   /**
   * 29/08/2019 - First version
   * SEJMM DS009.1
   * @description: Actualiza el nombre de una tabla pasada como parametro.
   */
  updateTableName(tableName: string, newTableName: string) {
    let query = 'ALTER TABLE ';
    query = query.concat(tableName + ' RENAME TO ' + newTableName);
    return this.database.executeSql(query, []).then(data => {
      this.loadTables();
    });
  }


  /**
   * 11/08/2019 - First version
   * SEJMM DS007
   * @description: Devuelve un array con los nombres de todas las tablas existentes en la base de datos. (Lo ideamos como un observable para que en
   * el caso de la pagina "Crea tu Tabla", cuando añadamos una tabla nueva, al estar suscritos como observable, refresquemos la lista de tablas creadas).
   */
  getTables(): Observable<string[]> {
    return this.tablesArrayName.asObservable();
  }

   /**
   * 11/08/2019 - First version
   * SEJMM DS007
   * @description: Carga lista de tablas en la DB y las almacena en "tablesArrayName".
   */
  loadTables() {
    const query = `SELECT tbl_name FROM sqlite_master WHERE type = 'table' AND tbl_name NOT LIKE 'sqlite_%'`;
    return this.database.executeSql(query, []).then(data => {
      const tables: string[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          tables.push(data.rows.item(i).tbl_name);
        }
      }
      this.tablesArrayName.next(tables);
    });
  }

  /**** SEJMM FIN DS007; Preparar base de datos para las multiples tablas creadas mediante "Crea tu tabla" ****/

}
