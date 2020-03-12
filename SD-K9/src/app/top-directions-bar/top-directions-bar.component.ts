import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'top-directions-bar',
  templateUrl: './top-directions-bar.component.html',
  styleUrls: ['./top-directions-bar.component.scss'],
})
export class TopDirectionsBarComponent implements OnInit {

  @Output() formCompleteEvent: EventEmitter<any> = new EventEmitter();

  start: string;
  end: string;
  transport: string;

  constructor() { }

  ngOnInit() {
    this.transport = 'TRANSIT';
  }

  segmentChanged(event) {
    this.transport = event.detail.value;
    this.sendMessage();
  }

  sendMessage() {
    if (this.start && this.end && this.transport) {
      this.formCompleteEvent.emit(
        {
          start: this.start,
          end: this.end,
          transport: this.transport
        }
      );
    }
  }

}
