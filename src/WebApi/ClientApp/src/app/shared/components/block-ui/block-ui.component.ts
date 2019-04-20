import { Component, Input, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'block-ui',
  templateUrl: './block-ui.component.html',
  animations: [
    trigger('enterAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 0.65 }))
      ]),
      transition(':leave', [
        style({ opacity: 0.65 }),
        animate('500ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class BlockUIComponent implements OnDestroy {
  @Input()
  public isShow: boolean;

  public subscription: Subscription;

  constructor(private loaderService: LoaderService) {
    this.isShow = false;
    this.subscription = this.loaderService.blockUI().subscribe(status => {
      this.isShow = status;
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
