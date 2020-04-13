import { Injectable, OnInit } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { BehaviorSubject, Observable } from 'rxjs';
import { Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { QueuedRoute } from '../../interfaces/sqlite/queued-route';
import { start } from 'repl';

@Injectable({
  providedIn: 'root'
})
export class SQLiteQueuedRoutes implements OnInit {
  private _database: SQLiteObject;
  private _databaseReady: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _databaseName: string = "queuedroutes";

  private _queuedRoutes = new BehaviorSubject([]);

  constructor(
    private _platform: Platform,
    private _sqlitePorter: SQLitePorter,
    private _sqlite: SQLite,
    private _http: HttpClient,
  ) {
    this._platform.ready().then(() => {
      this._sqlite.create({
        name: 'queuedroutes.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
        this._database = db;
        this._seedDatabase();
      })
    })
   }

  ngOnInit() {}

  private _seedDatabase() {
    this._http.get('assets/sqlite/seed.sql', {responseType: 'text'})
    .subscribe(sql => {
      this._sqlitePorter.importSqlToDb(this._database, sql)
      .then( _ => {
        this._loadQueuedRoutes();
        this._databaseReady.next(true);
      })
      .catch(error => console.error(error));
    })
  }

  private _loadQueuedRoutes() {
    return this._database.executeSql(`SELECT * FROM ${this._databaseName}`, []).then(data => {
      let queuedRoutes: QueuedRoute[] = [];

      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          let currentItem = data.rows.item(i);
          queuedRoutes.push({
            id: currentItem.id,
            summary: currentItem.summary,
            location: currentItem.location,
            startTime: currentItem.startTime,
            endTime: currentItem.endTime
          });
        }
      }
      this._queuedRoutes.next(queuedRoutes);
    });
  }

  getDatabaseState(): Observable<boolean> {
    return this._databaseReady.asObservable();
  }

  getQueuedRoutes(): Observable<any[]> {
    return this._queuedRoutes.asObservable();
  }

  async addQueuedRoute({id, summary, location, startTime, endTime}: QueuedRoute) {
    return await this._database.executeSql(`INSERT INTO ${this._databaseName} (id, summary, location, startTime, endTime) VALUES (${id}, ${summary}, ${location}, ${startTime}, ${endTime})`)
    .then(data => {
      this._loadQueuedRoutes();
    })
  }

  async getQueuedRoute(id: string): Promise<QueuedRoute> {
    return await this._database.executeSql(`SELECT * FROM ${this._databaseName} WHERE id = ${id}`)
    .then(data => {
      let queuedRoute = data.rows.item(0);
      return {
        id: queuedRoute.id,
        summary: queuedRoute.summary,
        location: queuedRoute.location,
        startTime: queuedRoute.startTime,
        endTime: queuedRoute.endTime
      }
    });
  }

  async deleteQueuedRoute(id: string) {
    return await this._database.executeSql(`DELETE FROM ${this._databaseName} WHERE id = ${id}`)
    .then( _ => {
      this._loadQueuedRoutes();
    })
  }
}
