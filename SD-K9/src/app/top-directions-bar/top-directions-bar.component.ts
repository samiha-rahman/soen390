import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

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
  vertical: string;

  @Input() indoor: boolean;

  constructor() { }

  ngOnInit() {
    this.transport = 'TRANSIT';
    this.vertical = 'ESCALATOR';
  }

  transportModeChanged(event) {
    this.transport = event.detail.value;
    this.sendMessage();
  }

  verticalModeChanged(event) {
    this.vertical = event.detail.value;
    this.sendMessage();
  }

  sendMessage() {
    if (this.start && this.end && this.transport && this.vertical) {
      this.formCompleteEvent.emit(
        {
          start: this.start,
          end: this.end,
          transport: this.transport,
          vertical: this.vertical
        }
      );
    }
  }

}
