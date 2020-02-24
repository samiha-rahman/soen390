import { Component, OnInit } from '@angular/core';
import { IonPullUpFooterState } from 'ionic-pullup';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit{
  footerState: IonPullUpFooterState;

  constructor() {}

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
      this.footerState = this.footerState === IonPullUpFooterState.Collapsed ? IonPullUpFooterState.Expanded : IonPullUpFooterState.Collapsed;
  }

}
