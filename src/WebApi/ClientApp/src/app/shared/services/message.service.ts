import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { Message } from "../common/message";

@Injectable({providedIn: "root"})
export class DefinedMessageService {
  public messageSource: Subject<Message> = new Subject<Message>();
  public clearSource: Subject<string> = new Subject<string>();

  public messageObserver: Observable<Message> = this.messageSource.asObservable();
  public clearObserver: Observable<string> = this.clearSource.asObservable();

  public add(message: Message): void {
    if (message) {
      this.messageSource.next(message);
    }
  }

  public clear(key?: string): void {
    this.clearSource.next(key || null);
  }
}
