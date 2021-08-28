import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";
import {NzMessageService} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";

@Component({
  selector: 'app-medical-record-template-list',
  templateUrl: './medical-record-template-list.component.html',
  styleUrls: ['./medical-record-template-list.component.css']
})
export class MedicalRecordTemplateListComponent implements OnInit {
  collapsed: any = false;
  medicalRecordTypeList: any;
  sideIsBusy: any = false;
  listIsBusy: any = false;
  templateList: any = [];
  menuList: any = [{title: '已启用的模板类型', expand: true, enabled: true}, {
    title: '未启用的模板类型',
    expand: false,
    enabled: false
  }];
  filterTemplateName: any;
  selectedTemplateType: any;
  @Output() onEditTemplateDetailEvent = new EventEmitter<any>();
  templateTabList: any = [];
  activeTabIndex: number;
  showEnabledTemplateOnly: any = true;

  constructor(
    private basicService: BasicService,
    private datePipe: DatePipe,
    private message: NzMessageService,
    public sessionService: SessionService,
  ) {
  }

  ngOnInit() {
    this.getMedicalRecordType(true);
  }

  private getMedicalRecordType(setDefaultType = false) {
    let filter = {}
    if (!this.sessionService.getUserPermission().fullTemplatePermission)
      filter["userRoleIIdList"] = [this.sessionService.loginUser.userRole.uuid];
    this.sideIsBusy = true;
    this.basicService.getMedicalRecordType(filter)
      .subscribe(response => {
          this.sideIsBusy = false;
          if (response) {
            this.medicalRecordTypeList = response.content;
            if (setDefaultType) {
              this.selectedTemplateType = this.medicalRecordTypeList.find(t => t.enabled);
              if (!this.selectedTemplateType)
                this.selectedTemplateType = this.medicalRecordTypeList.find(t => !t.enabled);
              if (this.selectedTemplateType)
                this.getTemplateList(this.selectedTemplateType);
            }

          }
        },
        error => {
          this.sideIsBusy = false;
          this.message.create("error", error.error.message);
        });
  }


  getTemplateList(medicalRecordType: any, clearFilter = false) {

    if (clearFilter)
      this.filterTemplateName = undefined;
    let filter = {employee: this.sessionService.loginUser, templateName: this.filterTemplateName};
    if (medicalRecordType) {
      filter["typeId"] = medicalRecordType.uuid;
      this.selectedTemplateType = medicalRecordType;
    } else
      this.selectedTemplateType = undefined;

    if (this.showEnabledTemplateOnly)
      filter["enabled"] = true;

    this.listIsBusy = true;
    this.basicService.getMedicalRecordTemplateList(filter)
      .subscribe(response => {
          this.listIsBusy = false;
          if (response) {
            this.templateList = response.content;
          }
        },
        error => {
          this.listIsBusy = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  sideMenuExpandChanged(clickedMenu: any) {
    for (let otherMenu of this.menuList) {
      if (otherMenu.title != clickedMenu.title)
        otherMenu.expand = false;
    }
  }


  enableTemplateType(medicalRecordType: any) {
    let action = medicalRecordType.enabled ? '启用' : '停用';
    this.selectedTemplateType = medicalRecordType;
    this.sideIsBusy = true;
    this.basicService.setMedicalRecordTypeStatus(medicalRecordType.enabled, medicalRecordType.uuid)
      .subscribe(
        response => {
          this.message.create('success', action + '成功');
          let otherMenu = this.menuList.find(m => m.enabled == medicalRecordType.enabled);
          otherMenu["expand"] = true;
          this.sideMenuExpandChanged(otherMenu);
          this.getMedicalRecordType();
          this.sideIsBusy = false;
        },
        error => {
          this.sideIsBusy = false;
          this.message.create("error", error.error.message);
          medicalRecordType.enabled = !medicalRecordType.enabled
        }
      );
  }

  enableTemplate(template: any) {
    let action = template.enabled ? '启用' : '停用';
    template["isBusy"] = true
    this.basicService.setMedicalRecordTemplateStatus(template)
      .subscribe(
        response => {
          this.message.create('success', action + '成功');
          if (!template.enabled && this.showEnabledTemplateOnly)
            this.templateList = this.templateList.filter(t => t.uuid !== template.uuid);
          template["isBusy"] = false
        },
        error => {
          template["isBusy"] = false
          template.enabled = !template.enabled
          this.message.create("error", error.error.message);
        }
      );
  }

  newTemplateDetailTab(template: any) {
    if (template) {
      let openedTemplateTab = this.templateTabList.find(t => t.template.uuid == template.uuid)
      if (openedTemplateTab) {
        this.activeTabIndex = this.templateTabList.indexOf(openedTemplateTab) + 1;
        return;
      }
    } else {
      template = {
        uuid: undefined,
        recordType: this.selectedTemplateType,
      };
    }

    let tab = {tabName: template.name ? template.name : '新模板', template: template}
    this.templateTabList.push(tab);
    this.activeTabIndex = this.templateTabList.length;
  }


  closeTemplateTab(tab: any) {
    this.templateTabList.splice(this.templateTabList.indexOf(tab), 1);
  }

  onTemplateSaved(templateType: any) {
    if (this.selectedTemplateType && this.selectedTemplateType.uuid == templateType.uuid)
      this.getTemplateList(this.selectedTemplateType);
  }

}
