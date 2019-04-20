import { Directive, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from '../../services/loader.service';

/**
 * Modal Block UI Directive
 *
 * @export
 * @class ModalBlockUIDirective
 * @implements {OnInit}
 * @implements {AfterViewInit}
 */
@Directive({
    selector: '[appModalBlock]'
})
export class ModalBlockUIDirective implements AfterViewInit, OnDestroy {
    private blockUiDiv: HTMLDivElement;
    private spinnerDiv: HTMLDivElement;
    private modal: HTMLDivElement;
    private subscription: Subscription;

    @Input()
    set modalBlockUI(show: boolean) {
        if (this.modal !== undefined) {
            if (show) {
                this.loader.isForceBlockUI = true;
                this.blockUiDiv.className = 'modal-block-overlay';
                this.spinnerDiv.className = 'modal-block-spinner';
                this.modal.appendChild(this.blockUiDiv);
                this.modal.appendChild(this.spinnerDiv);
            } else {
                this.loader.isForceBlockUI = false;
                if (this.modal.querySelector('div.modal-block-overlay')) {
                    this.blockUiDiv.className = 'modal-block-overlay-remove';
                    this.spinnerDiv.className = 'modal-block-spinner-remove';
                    setTimeout(() => {
                        this.modal.removeChild(this.blockUiDiv);
                        this.modal.removeChild(this.spinnerDiv);
                    }, 500);
                }
            }
        }
    }

    constructor(private loader: LoaderService) {

    }

    public ngAfterViewInit(): void {
        this.modal = document.querySelector('div.modal-content');
        this.blockUiDiv = document.createElement('div');
        this.spinnerDiv = document.createElement('div');
        this.spinnerDiv.className = 'modal-block-spinner';
        this.spinnerDiv.innerHTML = '<div class="spinner-small"></div>';

        this.subscription = this.loader.modalBlockUI().subscribe((value) => {
            this.modalBlockUI = value;
        });
    }

    public ngOnDestroy(): void {
        this.loader.isForceBlockUI = false;
        this.subscription.unsubscribe();
    }
}
