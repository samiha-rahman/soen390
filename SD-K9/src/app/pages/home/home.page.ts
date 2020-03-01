import { Component, OnInit } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { SVGManager } from 'src/app/providers/svg-manager.service';
import { Location } from '../../helpers/location';
import { ModalController } from '@ionic/angular';
import { BusPage } from 'src/app/modals/bus/bus.page';
import { AppsettingsPage } from 'src/app/modals/appsettings/appsettings.page';
import { IonPullUpFooterState } from 'ionic-pullup';
import { SVGCoordinate } from 'src/app/interfaces/svg-coordinate.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements OnInit {
  showFloorPlan = true;
  hasNextRoute = false;

  start = 'H-831';
  end = 'H-815';

  floor = 8;
  building = 'hall';

  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _svgService: SVGManager,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  async toSVGCoordinate(id: string) {
    let building;
    let floor;
    if (id.split('-')[0] === 'H') {
      building = 'hall';
    } else {
      building = 'loyola';
    };
    if (id.split('-')[1].length === 3) {
      floor = parseInt(id.split('-')[1].substr(0, 1));
    } else {
      floor = parseInt(id.split('-')[1].substr(0, 2));
    }
    let svgCoordinate: SVGCoordinate;
    svgCoordinate = await this._svgService.getClassroom(id, building, floor);

    return(svgCoordinate);
  }

  // TODO: Base on user input, determine if we must use SVGCoordinate or GoogleCoordinate for Location.Coordinate
  async getRouteTest() {
    this._initLocation.setCoordinate(await this.toSVGCoordinate(this.start));
    this._destination.setCoordinate(await this.toSVGCoordinate(this.end));
    this.floor = this._initLocation.getCoordinate().floor;

    await this._mapCoordinator.getRoute(this._initLocation, this._destination);
    this.hasNextRoute = this._mapCoordinator.hasNextRoute();
  }

  async nextRoute() {
    this.floor = this._destination.getCoordinate().floor;
    // TODO: Call nextRoute only after floorplan has updated
    // sleep for 5ms
    await new Promise(r => setTimeout(r, 5));
    await this._mapCoordinator.nextRoute();
    this.hasNextRoute = this._mapCoordinator.hasNextRoute();
  }

  footerState: IonPullUpFooterState;

  async openModal() {
    const modal = await this.modalController.create({
      component: BusPage
    });
    return await modal.present();
  }

  async openModal1() {
    const modal = await this.modalController.create({
      component: AppsettingsPage
    });
    return await modal.present();
  }

  //optional capture events
  footerExpanded() {
    console.log('Footer expanded!');
  }

  // optional capture events
  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  // toggle footer states
  toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

}
