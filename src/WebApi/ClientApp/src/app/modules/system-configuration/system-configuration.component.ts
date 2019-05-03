import { Component } from "@angular/core";
import { FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/base/base.component";
import { SystemConfigService } from "src/app/api-service/service/system-config.service";
import { CONSTANT } from "src/app/shared/common/constant";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-system-configuration",
  templateUrl: "./system-configuration.component.html",
  providers: [SystemConfigService]
})
export class SystemConfigurationComponent extends BaseComponent {
  public formGroup: FormGroup;
  public data: any;
  public obj: any;
  public systemObj: any;
  public c: any = CONSTANT.config;
  constructor(
    private service: SystemConfigService,
    private messageService: MessageService
  ) {
    super();
    this.currentUser = service.getCurrentUser();
  }

  public ngOnInit(): void {
    this.setForm();
    this.getData();
  }
  public update(data: any, title: string): void {
    var title = this.translate.get(title)["value"];
    if (data && data.length > 0) {
      var obj2 = this.formGroup.value;
      var listChange = [];
      var invalid = false;
      data.forEach(item => {
        if (obj2[item] == null || obj2[item] === "") {
          invalid = true;

          return;
        }
        if (obj2[item] !== this.obj[item]) {
          var config = this.getObj(this.c[item]);
          config.value = obj2[item];
          listChange.push(config);
        }
      });
      if (listChange.length > 0) {
        this.callUpdateAPI(listChange, title);
      } else if (!invalid) {
        this.messageService.add({
          severity: "warn",
          summary: title,
          detail: this.translate.get("dialog.noChange")["value"]
        });
      }
    }
  }

  public updateSystemLog(): void {
    var titleS = this.translate.get("sidebar.systemLog")["value"];
    var listChange = [];
    var obj = {
      Error: this.formGroup.controls.error.value,
      Warning: this.formGroup.controls.warning.value,
      Information: this.formGroup.controls.information.value
    };
    if (
      obj.Error === this.obj.error &&
      obj.Warning === this.obj.warning &&
      obj.Information === this.obj.information
    ) {
      this.messageService.add({
        severity: "warn",
        summary: titleS,
        detail: this.translate.get("dialog.noChange")["value"]
      });
    } else {
      var config = this.getObj(CONSTANT.config.systemLog);
      if (config) {
        config.value = JSON.stringify(obj);
        listChange.push(config);
        this.callUpdateAPI(listChange, titleS);
      }
    }
  }

  public updateCheckBox(data: any, title: string): void {
    var titleS = this.translate.get(title)["value"];
    var listChange = [];
    var config =
      title === "config.EAMAuthentication"
        ? this.getObj("OpenEAM")
        : this.getObj("UPSLoginViaInternet");
    if (config) {
      config["value"] = data.target.checked;
      listChange.push(config);
      this.callUpdateAPI(listChange, titleS);
    }
  }

  private callUpdateAPI(listChange: any, title: string): void {
    this.startBlockUI();
    this.service.update(listChange).subscribe(res => {
      this.getData();
      this.stopBlockUI();
      if (res.success) {
        this.messageService.add({
          severity: "success",
          summary: title,
          detail: this.translate.get("dialog.changeSuccess")["value"]
        });
      } else {
        this.messageService.add({
          severity: "success",
          summary: title,
          detail: this.translate.get("dialog.somethingWrong")["value"]
        });
      }
    });
  }

  private getObjValue(key: string): any {
    var obj = this.data.filter(x => x.key === key)[0];
    if (obj && obj.value) {
      return obj.value;
    }

    return "";
  }

  private getObj(key: string): any {
    return this.data.filter(x => x.key === key)[0];
  }

  private getData(): void {
    this.startBlockUI();
    this.service.getAll().subscribe(res => {
      this.stopBlockUI();
      if (res.data && res.data.length > 0) {
        this.data = res.data;
        var c = CONSTANT.config;
        var obj = this.getObjValue(c.systemLog);
        this.systemObj = obj ? JSON.parse(obj) : null;
        this.obj = {
          webPassExpDate: this.getObjValue(c.webPassExpDate),
          appPassExpDate: this.getObjValue(c.appPassExpDate),
          webSessExpDate: this.getObjValue(c.webSessExpDate),
          appSessExpDate: this.getObjValue(c.appSessExpDate),
          archiveLogData: this.getObjValue(c.archiveLogData),
          archiveJobHistory: this.getObjValue(c.archiveJobHistory),
          openEAM: this.getObjValue(c.openEAM) === "true" ? true : false,
          upsLoginViaInternet:
            this.getObjValue(c.upsLoginViaInternet) === "true" ? true : false,
          error: this.systemObj != null ? this.systemObj.Error : false,
          information: this.systemObj != null ? this.systemObj.Information : false,
          warning: this.systemObj != null ? this.systemObj.Warning : false
        };
        this.formGroup.setValue(this.obj);
      }
    });
  }
  private setForm(): void {
    this.formGroup = this.formBuilder.group({
      webPassExpDate: ["", [Validators.required]],
      appPassExpDate: ["", [Validators.required]],
      webSessExpDate: ["", [Validators.required]],
      appSessExpDate: ["", [Validators.required]],
      archiveLogData: ["", [Validators.required]],
      archiveJobHistory: ["", [Validators.required]],
      openEAM: ["", [Validators.required]],
      upsLoginViaInternet: ["", [Validators.required]],
      error: [false],
      information: [false],
      warning: [false]
    });
  }
}
