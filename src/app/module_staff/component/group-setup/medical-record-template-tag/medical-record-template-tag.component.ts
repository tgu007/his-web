import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {SessionService} from "../../../../service/session.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-medical-record-template-tag',
  templateUrl: './medical-record-template-tag.component.html',
  styleUrls: ['./medical-record-template-tag.component.css']
})
export class MedicalRecordTemplateTagComponent implements OnInit {
  templateTagForm: any;
  @Output() onTagSavedEvent = new EventEmitter<any>();
  tag: any;
  isBusy: any;


  constructor(private fb: FormBuilder, private basicService: BasicService,
              private message: NzMessageService,
              public sessionService: SessionService
  ) {
  }

  ngOnInit() {
    this.templateTagForm = this.fb.group({
      txtOptionList: [Validators.required],
      txtName: ["", [Validators.required]],
      switchTagStatus: ["", null],
      selectTagAppliedTo: ["", null]
    });
  }

  restUi(tag: any) {
    this.tag = tag;
    this.templateTagForm.reset();
    let splittedString = '';
    if (this.tag.description) {
      let stringArray = this.tag.description.split(',');
      splittedString = stringArray.join('\n');
    }
    // splittedString = this.tag.description.replace('，', '\n');
    this.templateTagForm.patchValue({
      txtName: this.tag.title,
      switchTagStatus: this.tag.enabled,
      selectTagAppliedTo: this.tag.ownerId ? 'myself' : 'everyone',
      txtOptionList: splittedString
    });
  }

  save() {
    if (!this.templateTagForm.valid) {
      FormValidator.validateFormInput(this.templateTagForm);
      this.message.create("error", "验证错误");
      return;
    }
    let processedInput = this.createSelectHtml();
    let formData = this.templateTagForm.value;
    let tag = {
      uuid: this.tag.key,
      name: formData.txtName,
      templateHtml: processedInput.html,
      menuId: this.tag.parentId,
      ownerId: formData.selectTagAppliedTo == "myself" ? this.sessionService.loginUser.uuid : undefined,
      tagType: '单选下拉框',
      description: processedInput.description,
      enabled: formData.switchTagStatus,
    }

    this.isBusy = true;
    this.basicService.saveTag(tag).subscribe(
      response => {
        this.isBusy = false;
        if (response.content)
          this.message.create("success", '保存成功');
        this.onTagSavedEvent.emit(response.content);
      },
      error => {
        this.message.create("error", error.error.message);
        this.isBusy = false;
      }
    )

  }

  private createSelectHtml() {
    let optionArray = this.templateTagForm.value.txtOptionList.split('\n').filter(o => o != '');
    let optionHtml = '';
    for (let option of optionArray) {
      optionHtml += `<option>${option}</option>`;
    }
    let selectHtml = `<span><select class="selectbox" onchange="this.after(this.value); this.remove()"><option selected="">${this.templateTagForm.value.txtName}</option>${optionHtml}</select></span>`;
    return {html: selectHtml, description: optionArray.join(',')};
  }
}
