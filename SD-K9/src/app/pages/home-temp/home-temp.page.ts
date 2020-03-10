import { Component, OnInit } from '@angular/core';
import { MapItem } from 'src/app/helpers/map-item';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';

@Component({
  selector: 'app-home-temp',
  templateUrl: './home-temp.page.html',
  styleUrls: ['./home-temp.page.scss'],
})
export class HomeTempPage implements OnInit {
  maps: MapItem[];

  constructor(private _mapCoordinator: MapCoordinator) { }

  ngOnInit() {
    //TODO: update MapCoordinator.getMap() to better automate this.
    this.maps = [
      this._mapCoordinator.getMap('outside'),
      this._mapCoordinator.getMap('hall')
    ];
  }

}
