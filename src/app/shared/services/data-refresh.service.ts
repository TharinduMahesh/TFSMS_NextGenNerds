import { Injectable } from "@angular/core"
import { Subject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class DataRefreshService {
  private incentiveRefreshSubject = new Subject<void>()
  private paymentRefreshSubject = new Subject<void>()

  // Observable streams
  incentiveRefresh$ = this.incentiveRefreshSubject.asObservable()
  paymentRefresh$ = this.paymentRefreshSubject.asObservable()

  // Trigger refresh methods
  refreshIncentives() {
    this.incentiveRefreshSubject.next()
  }

  refreshPayments() {
    this.paymentRefreshSubject.next()
  }
}
