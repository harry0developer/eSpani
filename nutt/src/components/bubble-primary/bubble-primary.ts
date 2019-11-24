import { Component, Input } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { MessageData } from '../../models/message';

@Component({
  selector: 'bubble-primary',
  templateUrl: 'bubble-primary.html'
})
export class BubblePrimaryComponent {

  @Input() chatData: MessageData;

  constructor(private dataProvider: DataProvider) { }

  getDate(date): string {
    return this.dataProvider.getDateTimeMoment(date);
  }

}
