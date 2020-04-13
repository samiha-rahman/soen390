import { Component, OnInit } from '@angular/core';
import { SQLiteQueuedRoutes } from 'src/app/providers/sqlite/queued-routes.sqlite.service';
import { QueuedRoute } from 'src/app/interfaces/sqlite/queued-route';

@Component({
  selector: 'app-queued-routes',
  templateUrl: './queued-routes.page.html',
  styleUrls: ['./queued-routes.page.scss'],
})
export class QueuedRoutesPage implements OnInit {
  private _queuedRoutes: QueuedRoute[] = [];

  constructor(
    private _sqliteQueuedRoutes: SQLiteQueuedRoutes
    ) {
    this._sqliteQueuedRoutes.getDatabaseState().subscribe(ready => {
      if (ready) {
        this._sqliteQueuedRoutes.getQueuedRoutes().subscribe(queuedRoutes => {
          this._queuedRoutes = queuedRoutes;
        });
      }
    });
  }

  ngOnInit() {
  }

}
