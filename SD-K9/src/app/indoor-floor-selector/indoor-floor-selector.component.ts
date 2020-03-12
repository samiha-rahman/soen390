import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { PickerController } from '@ionic/angular';
import { PickerOptions, PickerColumnOption } from '@ionic/core';

@Component({
  selector: 'indoor-floor-selector',
  templateUrl: './indoor-floor-selector.component.html',
  styleUrls: ['./indoor-floor-selector.component.scss'],
})
export class IndoorFloorSelectorComponent implements OnInit {

  // TODO: get floors dynamically based on building
  @Input('current-floor') currentFloor: string;
  @Input() floors: any[];

  @Output() floorChangeEvent: EventEmitter<any> = new EventEmitter();

  constructor(private _pickerCtrl: PickerController) { }

  ngOnInit() { }

  private createPickerOptions(): PickerColumnOption[] {
    const out = [];
    for (const floor of this.floors) {
      out.push({ text: floor, value: floor });
    }
    return out;
  }

  async showFloorPicker() {
    let opts: PickerOptions = {
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Confirm',
          handler: (data) => {
            this.currentFloor = data.floor.value;
            this.sendMessage(this.currentFloor)
          }
        }
      ],
      columns: [{
        name: 'floor',
        options: this.createPickerOptions()
      }]
    };

    const picker = await this._pickerCtrl.create(opts);
    picker.present();
  }

  sendMessage(floor) {
    this.floorChangeEvent.emit({ floor });
  }
}