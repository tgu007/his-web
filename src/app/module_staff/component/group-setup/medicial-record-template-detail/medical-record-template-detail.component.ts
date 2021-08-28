import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {UEditorComponent} from "ngx-ueditor";
import {BasicService} from "../../../../service/basic.service";
import {DatePipe} from "@angular/common";
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
  NzFormatEmitEvent,
  NzMessageService, NzTreeComponent,
  NzTreeNode
} from "ng-zorro-antd";
import {SessionService} from "../../../../service/session.service";
import {UserService} from "../../../../service/user.service";
import {MedicalRecordTemplateTagComponent} from "../medical-record-template-tag/medical-record-template-tag.component";

@Component({
  selector: 'app-medical-record-template-detail',
  templateUrl: './medical-record-template-detail.component.html',
  styleUrls: ['./medical-record-template-detail.component.css']
})
export class MedicalRecordTemplateDetailComponent implements OnInit {
  collapsed: any;
  isBusy: any;
  @ViewChild(UEditorComponent, {static: false}) templateEditor: UEditorComponent;
  @Input() template: any;
  departmentList: any;
  selectDepartment: any;
  selectDoctor: any;
  doctorList: any;
  selectTemplateType: any;
  @Input() templateTypeList: any;
  @Output() onTemplateSavedEvent: EventEmitter<any> = new EventEmitter();
  tagNodes: any;
  isSiderLoading = false;
  activeNode: any
  tagOptionModalVisible: any;
  @ViewChild(MedicalRecordTemplateTagComponent, {static: true}) tagComponent: MedicalRecordTemplateTagComponent;
  @ViewChild(NzTreeComponent, {static: false}) nzTreeComponent: NzTreeComponent;
  templateHeader = '<header><p class="yymc"><input value = "{医院名称}" disabled size="10"/></p ><p class="blmc">模板名称</p>replaceWithCommonHeader</header><p>内容......</p >';
  replacedTemplateHeader: any;
  isFirstEntry = true;


  constructor(public basicService: BasicService,
              private datePipe: DatePipe,
              private message: NzMessageService,
              public sessionService: SessionService,
              private userService: UserService,
              private nzContextMenuService: NzContextMenuService
  ) {
  }

  ngOnInit() {
    this.isSiderLoading = true;
    this.basicService.getTemplateTagTree({employeeId: this.sessionService.loginUser.id})
      .subscribe(response => {
          this.isSiderLoading = false;
          //response.content.foreach(n=> n["isLeaf"] = n["leaf"]);
          this.tagNodes = response.content;

        },
        error => {
          this.message.create("error", error.error.message);
          this.isSiderLoading = false;
        }
      );

    if (this.sessionService.loginUser.userRole.userRoleType == '系统管理员') {
      this.basicService.getDepartmentList({departmentType: '诊疗'})
        .subscribe(response => {
          this.departmentList = response.content;

        });

      this.userService.getUserList({userRoleType: '医生', enabled: true})
        .subscribe(response => {
            this.doctorList = response.content;
          },
          error => {
            this.message.create("error", error.error.message);
          }
        );
    }
    if (!this.template.uuid)
      this.selectTemplateType = this.template.recordType;

    //this.selectTemplateType = this.templateTypeList.find(t => t.uuid == this.template.recordType.uuid);
  }

  saveTemplateClicked(permissionType: any) {
    if (!this.template.name) {
      this.message.create("error", "模板名不能为空");
      return;
    }

    let data = this.getData(permissionType);
    if (!data)
      return;

    this.isBusy = true;
    this.basicService.saveTemplate(this.getData(permissionType))
      .subscribe(response => {
          if (response) {
            this.message.create("success", "模板更新成功");
            this.template.uuid = response.content;
            this.templateEditor.Instance.reset();
            this.template["modified"] = false;
            this.onTemplateSavedEvent.emit(this.template.recordType);
          }
          this.isBusy = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        }
      );
  }

  private getData(permissionType: any) {
    let loginUser = this.sessionService.loginUser;
    let departmentIdList = [];
    if (permissionType == '科室模板') {
      if (loginUser.userRole.userRoleType == '系统管理员') {
        departmentIdList = this.selectDepartment;
        if (!departmentIdList || departmentIdList.length == 0) {
          this.message.create("error", "没有选择科室");
          return undefined;
        }
      } else
        departmentIdList = loginUser.departmentIdList;
    }

    let ownerDoctorId = undefined;
    if (permissionType == '个人模板') {
      if (loginUser.userRole.userRoleType == '系统管理员') {
        ownerDoctorId = this.selectDoctor;
        if (!ownerDoctorId) {
          this.message.create("error", "没有选择医生");
          return undefined;
        }
      } else
        ownerDoctorId = loginUser.uuid
    }

    if (!this.template.uuid)
      this.template.recordType = this.selectTemplateType;

    let data =
      {
        uuid: this.template.uuid,
        enabled: this.template.uuid ? this.template.enabled : true,
        typeId: this.template.recordType.uuid,
        ownedByDoctorId: ownerDoctorId,
        permissionType: permissionType,
        permittedDepartmentIdList: departmentIdList,
        name: this.template.name,
        template: this.templateEditor.Instance.getContent(),
      };
    return data;
  }


  private loadTemplateContent(templateId: any) {

    this.isBusy = true;
    this.basicService.getMedicalRecordTemplate(templateId)
      .subscribe(response => {
          this.isBusy = false;
          if (response) {
            let content = response.content.template;
            this.templateEditor.Instance.reset();
            this.templateEditor.Instance.setContent(content, false);
            this.template["modified"] = false;
            //管理员界面
            if (this.sessionService.loginUser.userRole.userRoleType == '系统管理员') {
              let template = response.content;
              if (template.permissionType == '科室模板')
                this.selectDepartment = template.permittedDepartmentIdList;

              if (template.permissionType == '个人模板')
                this.selectDoctor = template.ownedByDoctorId;
            }
          }
        },
        error => {
          this.message.create("error", error.error.message);
          this.isBusy = false;
        });
  }

  editorReady() {
    if (this.isFirstEntry)
      this.isFirstEntry = false;
    else
      return;

    if (this.template.uuid)
      this.loadTemplateContent(this.template.uuid);
    else {
      if (this.replacedTemplateHeader)
        this.setNewTemplateContent();
      this.isBusy = true;
      this.basicService.getNewTemplateCommonHeader()
        .subscribe(response => {
            this.isBusy = false;
            if (response) {
              this.replacedTemplateHeader = this.templateHeader.replace("replaceWithCommonHeader", response.content);
              this.setNewTemplateContent();
            }
          },
          error => {
            this.message.create("error", error.error.message);
            this.isBusy = false;
          }
        );
    }
    this.templateEditor.Instance.addListener('contentChange', (editor) => {
      this.template["modified"] = true;
    });
  }

  private setNewTemplateContent() {
    this.templateEditor.Instance.setContent(this.replacedTemplateHeader, false);
    this.template["modified"] = false;
  }


  nodeDoubleClicked(clickedNode: NzFormatEmitEvent) {
    if (clickedNode.node.isLeaf)
      this.templateEditor.Instance.execCommand('inserthtml', clickedNode.node.origin.templateHtml);
    else
      this.openFolder(clickedNode.node)
  }

  editTag(node: any) {
    this.tagComponent.restUi(node.origin);
    this.tagOptionModalVisible = true;
  }

  nodeClicked(clickedNode: NzFormatEmitEvent) {
    this.activeNode = clickedNode.node!;
  }

  contextMenu($event: MouseEvent, menu: NzDropdownMenuComponent): void {
    this.nzContextMenuService.create($event, menu);
  }

  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    // do something if u want
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      if (node) {
        node.isExpanded = !node.isExpanded;
      }
    }
  }

  newTag(node) {
    let tag = {parentId: node.origin.key, enabled: true, ownerId: undefined};
    this.tagComponent.restUi(tag);
    this.tagOptionModalVisible = true;
  }

  closeModal() {
    this.tagOptionModalVisible = false;
  }

  saveTagDescription() {
    this.tagComponent.save();
  }

  tagSaved(tagNode) {
    let parentNode = this.nzTreeComponent.getTreeNodeByKey(tagNode.parentId);
    if (parentNode) {
      let childNode = parentNode.children.find(c => c.key == tagNode.key);
      if (childNode) {
        childNode.title = tagNode.title;
        childNode.origin = tagNode;
      } else
        parentNode.addChildren([tagNode]);
    }
    this.tagOptionModalVisible = false;
  }


}
