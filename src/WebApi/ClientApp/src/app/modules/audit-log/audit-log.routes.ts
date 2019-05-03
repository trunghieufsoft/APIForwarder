import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
// import { SynchronizationLogComponent } from './synchronization-log/synchronization-log.component';
// import { TransactionLogComponent } from './transaction-log/transaction-log.component';
import { SystemLogComponent } from './system-log/system-log.component';
const ROUTER: Routes = [
  // {
  //   path: "synchronization-log",
  //   component: SynchronizationLogComponent,
  //   data: { title: "Synchronization Log Management" }
  // },
  {
    path: "system-log",
    component: SystemLogComponent,
    data: { title: "System Log Management" }
  },
  // {
  //   path: "transaction-log",
  //   component: TransactionLogComponent,
  //   data: { title: "Transaction Log Management" }
  // }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTER)],
  exports: [RouterModule]
})
export class AuditLogManagementRoutingModule {}
