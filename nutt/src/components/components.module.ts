import { NgModule } from '@angular/core';
import { BubblePrimaryComponent } from './bubble-primary/bubble-primary';
import { BubbleSecondaryComponent } from './bubble-secondary/bubble-secondary';
@NgModule({
	declarations: [BubblePrimaryComponent,
    BubbleSecondaryComponent],
	imports: [],
	exports: [BubblePrimaryComponent,
    BubbleSecondaryComponent]
})
export class ComponentsModule {}
