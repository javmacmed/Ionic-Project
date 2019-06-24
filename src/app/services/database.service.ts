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

  constructor(private plt: Platform, private sqlitePorter: SQLitePorter, private sqlite: SQLite, private http: HttpClient) {
    this.plt.ready().then(() => {
      this.sqlite.create({
        name: 'sayMyName.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
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
   * @description: Carga lista de usuarios
   */
  loadUsers() {
    return this.database.executeSql('SELECT * FROM users', []).then(data => {
      let users: User[] = [];

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
    let data = [userName, password];
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
   * @description: Borra usuario en base a un ID de users
   */
  updateUser(user: User) {
    let data = [user.userName, user.password];
    return this.database.executeSql(`UPDATE users SET userName = ?, password = ? WHERE id = ${user.id}`, data).then(data => {
      this.loadUsers();
    });
  }

  /**
   * @description: Carga lista de animales
   */
  loadAnimals() {
    let query = 'SELECT * FROM animals';
    return this.database.executeSql(query, []).then(data => {
      let animals: Elem[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
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
    let data = [spanishName, englishName];
    return this.database.executeSql('INSERT INTO animals (spanishName, englishName) VALUES (?, ?)', data).then(data => {
      this.loadAnimals();
    });
  }

  /**
   * @description: Obtiene y devuelve animal en base a un ID de users
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
   * @description: Borra animal en base a un ID de animals
   */
  updateAnimal(user: User) {
    let data = [user.userName, user.password];
    return this.database.executeSql(`UPDATE animals SET spanishName = ?, englishName = ? WHERE id = ${user.id}`, data).then(data => {
      this.loadAnimals();
    });
  }
}
