
export class DemoIndoorNavPageModule { }

import { Component, OnInit } from '@angular/core';
import { MapCoordinator } from 'src/app/providers/map-coordinator.service';
import { SVGManager } from 'src/app/providers/svg-manager.service';
import { Location } from '../../helpers/location';
import { SVGCoordinate } from 'src/app/interfaces/svg-coordinate.model';
import { LoadingController } from '@ionic/angular';
import { RouteOptions } from 'src/app/interfaces/route-options';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-demo',
  templateUrl: 'demo-indoor-nav.page.html',
  styleUrls: ['demo-indoor-nav.page.scss']
})

export class DemoIndoorNavPage implements OnInit {
  showFloorPlan = true;
  hasNextRoute = false;

  floor = 8;
  // TODO: GET FLOORS AUTOMATICALLY BASED ON BUILDING
  floors = [6, 8];
  building = 'hall';

  steps: any[];
  options: RouteOptions;

  routeDetails;

  private _initLocation: Location;
  private _destination: Location;

  constructor(
    private _mapCoordinator: MapCoordinator,
    private _svgService: SVGManager,
    private _loadingController: LoadingController,
    private _toastController: ToastController
  ) { }

  async ngOnInit() {
    this._initLocation = new Location();
    this._destination = new Location();
    this.steps = this.getRouteSteps();
  }

  async toSVGCoordinate(id: string) {
    let building;
    let floor;
    if (id.split('-').length !== 2) {
      throw { message: 'Invalid classroom format.' };
    }
    if (id.split('-')[0].toUpperCase() === 'H') {
      building = 'hall';
    } else {
      building = 'loyola';
    }
    if (id.split('-')[1].length === 3) {
      floor = parseInt(id.split('-')[1].substr(0, 1));
    } else {
      floor = parseInt(id.split('-')[1].substr(0, 2));
    }
    let svgCoordinate: SVGCoordinate;
    svgCoordinate = await this._svgService.getClassroom(id, building, floor);

    return (svgCoordinate);
  }

  // TODO: Base on user input, determine if we must use SVGCoordinate or GoogleCoordinate for Location.Coordinate
  async getRoute(start, end) {
    this._initLocation.setCoordinate(await this.toSVGCoordinate(start));
    this.floor = this._initLocation.getCoordinate().floor;
    this._destination.setCoordinate(await this.toSVGCoordinate(end));

    this._mapCoordinator.getRoute(this._initLocation, this._destination)
      .catch((e) => {
        console.log(e);
      });

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

  setMode(mode: string) {
    this._mapCoordinator.setVerticalTransportationMode(mode);
  }

  async previewRoute(event) {
    const loading = await this._loadingController.create({
      message: 'Please wait...'
    });
    await loading.present();

    this.options = event;
    this.getRoute(this.options.start, this.options.end)
      .catch(async (error) => {
        let toast: HTMLIonToastElement;

        if (error && error.status === 404) {
          console.log(this.floor, this.building)
          toast = await this._toastController.create({
            message: 'Input Floor plan was not implemented.',
            color: 'danger',
            duration: 2000
          });
        } else {
          toast = await this._toastController.create({
            message: error.message,
            color: 'danger',
            duration: 2000
          });
        }
        loading.dismiss();
        toast.present();
      });

    this.routeDetails = {
      time: '2min',
      distance: '0.4 km'
    };

    loading.dismiss();
  }

  startRoute(event) {
    // TODO: IMPLEMENT STARTROUTE
    if (this.options) {
      console.log(event);
      console.log(this.options);
    }
  }

  changeFloor(event) {
    this.floor = event.floor;
  }

  getRouteSteps() {
    // TODO: GENERATE STEPS DYNAMICALLY
    return [
      { icon: 'arrow-forward-circle', text: 'Turn right in 100m' },
      { icon: 'arrow-back-circle', text: 'Turn left in 100m' },
      { icon: 'arrow-forward-circle', text: 'Turn right in 100m' },
      { icon: 'arrow-back-circle', text: 'Turn left in 100m' },
      { icon: 'arrow-back-circle', text: 'Turn left in 100m' },
      { icon: 'arrow-forward-circle', text: 'Turn right in 100m' },
      { icon: 'arrow-forward-circle', text: 'Turn right in 100m' },
      { icon: 'arrow-back-circle', text: 'Turn left in 100m' },
      { icon: 'arrow-back-circle', text: 'Turn left in 100m' }
    ]
  }

  getRouteDetails() {
    // TODO: GENERATE DETAILS DYNAMICALLY
    return this.routeDetails;
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
