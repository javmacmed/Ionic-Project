/**
 * SEJMM DS002 02/06/2019; Servicio para controlar nuestra base de datos SQLite
 * */

import { Platform } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { HttpClient } from '@angular/common/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: number;
  userName: string;
  password: string;
}

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

  users = new BehaviorSubject([]);
  animals = new BehaviorSubject([]);
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
   * @description Importa a la base de datos las tablas de la semilla inicial 'seed.sql'
   */
  seedDatabase() {
    this.http.get('assets/seed.sql', { responseType: 'text' })
      .subscribe(sql => {
        this.sqlitePorter.importSqlToDb(this.database, sql)
          .then(_ => {
            this.loadUsers(); // Cargamos la tabla usuarios
            this.loadAnimals(); // Cargamos la tabla animales
            this.dbReady.next(true);
          })
          .catch(e => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getUsers(): Observable<User[]> {
    return this.users.asObservable();
  }

  getAnimals(): Observable<Elem[]> {
    return this.animals.asObservable();
  }

  /**
   * SEJMM DS007; Preparamos para tabla creada mediante "Crea tu tabla"
   */
  getSelectedTable(): Observable<Elem[]> {
    return this.selectedTable.asObservable();
  }

  /**
   * @description: Carga lista de usuarios
   */
  loadUsers() {
    return this.database.executeSql('SELECT * FROM users', []).then(data => {
      const users: User[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          users.push({
            id: data.rows.item(i).id,
            userName: data.rows.item(i).userName,
            password: data.rows.item(i).password
          });
        }
      }
      this.users.next(users);
    });
  }

  /**
   * @description: Añade usuario a la tabla users
   */
  addUsers(userName: string, password: string) {
    const data = [userName, password];
    return this.database.executeSql('INSERT INTO users (userName, password) VALUES (?, ?)', data).then(data => {
      this.loadUsers();
    });
  }

  /**
   * @description: Obtiene y devuelve usuario en base a un ID de users
   */
  getUser(id: number): Promise<User> {
    return this.database.executeSql('SELECT * FROM users WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        userName: data.rows.item(0).userName,
        password: data.rows.item(0).password
      };
    });
  }

  /**
   * @description: Borra usuario en base a un ID de users
   */
  deleteUser(id: number) {
    return this.database.executeSql('DELETE FROM users WHERE id = ?', [id]).then(_ => {
      this.loadUsers();
    });
  }

  /**
   * @description: Actualiza usuario en base a un ID de users
   */
  updateUser(user: User) {
    const data = [user.userName, user.password];
    return this.database.executeSql(`UPDATE users SET userName = ?, password = ? WHERE id = ${user.id}`, data).then(data => {
      this.loadUsers();
    });
  }

  /**
   * @description: Carga lista de animales
   */
  loadAnimals() {
    const query = 'SELECT * FROM animals';
    return this.database.executeSql(query, []).then(data => {
      const animals: Elem[] = [];
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          animals.push({
            id: data.rows.item(i).id,
            spanishName: data.rows.item(i).spanishName,
            englishName: data.rows.item(i).englishName
          });
        }
      }
      this.animals.next(animals);
    });
  }

  /**
   * @description: Añade un animal
   */
  addAnimal(spanishName: string, englishName: string) {
    const data = [spanishName, englishName];
    return this.database.executeSql('INSERT INTO animals (spanishName, englishName) VALUES (?, ?)', data).then(data => {
      this.loadAnimals();
    });
  }

  /**
   * @description: Obtiene y devuelve animal en base a un ID de animals
   */
  getAnimal(id: number): Promise<Elem> {
    return this.database.executeSql('SELECT * FROM animals WHERE id = ?', [id]).then(data => {
      return {
        id: data.rows.item(0).id,
        spanishName: data.rows.item(0).spanishName,
        englishName: data.rows.item(0).englishName
      };
    });
  }

  /**
   * @description: Borra animal en base a un ID de animals
   */
  deleteAnimal(id: number) {
    return this.database.executeSql('DELETE FROM animals WHERE id = ?', [id]).then(_ => {
      this.loadAnimals();
    });
  }

  /**
   * @description: Actualiza animal en base a un ID de animals
   */
  updateAnimal(animal: Elem) {
    const data = [animal.spanishName, animal.englishName];
    return this.database.executeSql(`UPDATE animals SET spanishName = ?, englishName = ? WHERE id = ${animal.id}`, data).then(data => {
      this.loadAnimals();
    });
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
    query = query.concat('animals');
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
  deleteTable(id: number, tableSelected: string) {
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
