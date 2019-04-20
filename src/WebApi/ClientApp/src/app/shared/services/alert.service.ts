import { Injectable } from "@angular/core";
import swal, { SweetAlertOptions } from "sweetalert2";
import { from } from "rxjs";

export enum AlertType {
  success = "success",
  error = "error",
  warning = "warning",
  info = "info",
  question = "question"
}
@Injectable({
  providedIn: "root"
})
export class AlertService {
  public interval: any;
  /**
   * show success alert
   *
   * @param {string} description
   * @param {string} [title='Success']
   * @memberof AlertService
   */
  public success(description: string, title: string = "Success"): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "success",
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * show error alert
   *
   * @param {string} description
   * @param {string} [title='Error']
   * @memberof AlertService
   */
  public error(description: string, title: string = "Error"): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "error",
      showCloseButton: true,
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  public errorTime(msgWaiting: string, timer: any): any {
    this.interval = setInterval(() => {
      timer = timer - 1;
      if (timer === 0) {
        clearInterval(this.interval);
      }
      var modal = document.querySelector("#swal2-content");
      if (modal) {
        modal.innerHTML = msgWaiting.replace("${value}", timer);
      }
    }, 1000);

    swal({
      title: "Error",
      text: msgWaiting.replace("${value}", timer),
      timer: timer * 1000,
      type: "error",
      showCloseButton: true,
      allowOutsideClick: false
    });
  }

  /**
   * show warning alert
   *
   * @param {string} description
   * @param {string} [title='Reminder']
   * @memberof AlertService
   */
  public warning(description: string, title: string = "Reminder"): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "warning",
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * show warning alert
   *
   * @param {string} description
   * @param {string} [title='Reminder']
   * @memberof AlertService
   */
  public warningWithCancel(
    description: string,
    title: string = "Reminder"
  ): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "warning",
      showCancelButton: true,
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * Show multi warning message as a queue
   *
   * @param {SweetAlertOptions[]} warnings
   * @returns
   * @memberof AlertService
   */
  public warningQueue(warnings: SweetAlertOptions[]): any {
    clearInterval(this.interval);
    warnings.forEach(item => {
      if (!item.title) {
        item.title = "Reminder";
      }
      item.type = "warning";
      item.allowOutsideClick = false;
    });

    return from(swal.queue(warnings));
  }

  /**
   * show info alert
   *
   * @param {string} description
   * @param {string} [title='info']
   * @memberof AlertService
   */
  public info(description: string, title: string = "Info"): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "info",
      showCancelButton: true,
      showCloseButton: true,
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * show info alert with HTML content
   *
   * @param {string} description
   * @param {string} [title='info']
   * @memberof AlertService
   */
  public infoByHtmlContent(html: string, title: string = "Info"): any {
    clearInterval(this.interval);

    return from(
      swal({
        title: title,
        type: "info",
        html: html,
        showCloseButton: true,
        allowOutsideClick: false
      })
    );
  }

  /**
   * show question alert
   *
   * @param {string} description
   * @param {string} [title='Question']
   * @memberof AlertService
   */
  public question(description: string, title: string = "Question"): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "question",
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * show confirm alert
   *
   * @param {string} description
   * @param {string} [title='Question']
   * @memberof AlertService
   */
  public confirm(
    description: string,
    title: string = "Confirm",
    confirmText: string = "Yes",
    cancelText: string = "No"
  ): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: "question",
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      showCloseButton: true,
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * show alert
   *
   * @param {AlertType} type
   * @param {string} title
   * @param {string} description
   * @memberof AlertService
   */
  public show(type: AlertType, title: string, description: string): any {
    clearInterval(this.interval);
    const option = {
      title: title,
      text: description,
      type: type,
      allowOutsideClick: false
    } as SweetAlertOptions;

    return from(swal(option));
  }

  /**
   * show custom alert box
   *
   * @param {SweetAlertOptions} option
   * @memberof JpAlertService
   */
  public alert(option: SweetAlertOptions): any {
    return from(swal(option));
  }

  /**
   * Show notify message on the top right of screen
   *
   * @param {string} description
   * @memberof AlertService
   */
  public notify(description: string): any {
    clearInterval(this.interval);
    swal({
      position: "top-right",
      title: description,
      showConfirmButton: false,
      toast: true,
      showCloseButton: true,
      timer: 5000
    });
  }
}
