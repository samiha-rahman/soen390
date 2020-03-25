import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MockComponent } from './mock-component.component';

/*
* A workaround to include 'entryComponents' in the testing module interface
* while Angular have not yet implemented this action.
*/

@NgModule({
    imports: [IonicModule],
    declarations: [MockComponent],
    entryComponents: [MockComponent],
})
export class TestModule {}