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

  selectedTable = new BehaviorSubject([]); // SEJMM DS007; Preparamos para tabla creada mediante "Crea tu tabla"
  tablesArrayName = new BehaviorSubject([]); // SEJMM DS007; Preparamos para multitabla.

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

  /**
   * SEJMM DS007; Preparamos para tabla creada mediante "Crea tu tabla"
   */
  getSelectedTable(): Observable<Elem[]> {
    return this.selectedTable.asObservable();
  }

  /**** SEJMM INI DS007; Preparar base de datos para las multiples tablas creadas mediante "Crea tu tabla" ****/
  /**
   * 07/08/2019 - First version
   * SEJMM DS007
   * @description: Carga lista de elementos
   * @param tableName
   */
  loadTable(tableName: string) {
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
   * @description: Añade un elemento con @param spanishName y @param englishName a la tabla @param tableName
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
    return this.database.executeSql('DELETE FROM ? WHERE id = ?', [tableSelected, id]).then(_ => {
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
    const data = [elemento.spanishName, elemento.englishName];
    return this.database.executeSql(`UPDATE ${tablaSelected} SET spanishName = ?, englishName = ? WHERE id = ${elemento.id}`, data).then(data => {
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
