import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NavController, IonSearchbar } from '@ionic/angular';
import { DirectionFormStore } from '../../providers/state-stores/direction-form-store.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.page.html',
  styleUrls: ['./location-search.page.scss'],
})
export class LocationSearchPage implements OnInit {

  // @ViewChild(IonSearchbar) searchbar: IonSearchbar;

  query: string;
  itemList: string[];

  private _itemList: string[];
  private _queryType: string;

  public currentQuery: string;

  constructor(
    private _navController: NavController,
    private _activatedRoute: ActivatedRoute,
    private _directionFormStore: DirectionFormStore
  ) {
    this._activatedRoute.queryParams.subscribe(params => {
      this._queryType = params['query'];
    })
  }

  ngOnInit() {
    // setTimeout(() => { this.searchbar.setFocus(); }, 150);
    // TODO: get from config once available
    this._itemList = ['H-811', 'H-815', 'H-817', 'H-819', 'H-821', 'CC-101', 'H-617'];
  }

  goToHomePage() {
    this._navController.navigateBack("home");
  }

  changeQuery(query: string) {
    this.itemList = [];
    this.currentQuery = query;
    for (const item of this._itemList) {
      if (item.toUpperCase().includes(query.toUpperCase())) {
        this.itemList.push(item);
      }
    }
  }

  enterQuery(query: string) {
    switch (this._queryType) {
      case 'start': {
        this._directionFormStore.setSource(query);
        break;
      }
      case 'final': {
        this._directionFormStore.setDestination(query);
        break;
      }
    }
    this._navController.navigateBack("home");
  }
}
