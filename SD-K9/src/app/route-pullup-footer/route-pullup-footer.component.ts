import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'route-pullup-footer',
  templateUrl: './route-pullup-footer.component.html',
  styleUrls: ['./route-pullup-footer.component.scss'],
})
export class RoutePullupFooterComponent implements OnInit {

  @Input() routeType: string;
  @Input() steps: any[];
  @Input() details: string;

  @Output() startRouteEvent: EventEmitter<any> = new EventEmitter();


  footerState: IonPullUpFooterState;
  hasRouteOptions = false;

  constructor() { }

  ngOnInit() {
    this.footerState = IonPullUpFooterState.Collapsed;
  }

  // optional capture events
  footerExpanded() {
    console.log('Footer expanded!');
  }

  // optional capture events
  footerCollapsed() {
    console.log('Footer collapsed!');
  }

  // toggle footer states
  toggleFooter() {
    this.footerState = this.footerState === IonPullUpFooterState.Collapsed ?
      IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

  startRoute() {
    this.footerState = IonPullUpFooterState.Expanded;
    this.sendMessage();
  }

  sendMessage() {
    this.startRouteEvent.emit('start route button pressed');
  }

}
