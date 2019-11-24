import { Component, Input } from '@angular/core';
import { DataProvider } from '../../providers/data/data';
import { MessageData } from '../../models/message';

@Component({
  selector: 'bubble-secondary',
  templateUrl: 'bubble-secondary.html'
})
export class BubbleSecondaryComponent {

  @Input() chatData: MessageData;

  constructor(private dataProvider: DataProvider) { }

  getDate(date): string {
    return this.dataProvider.getDateTimeMoment(date);
  }
}
