import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {BasicService} from "../../../../service/basic.service";
import {NzMessageService} from "ng-zorro-antd";
import {PatientService} from "../../../../service/patient.service";
import {FormValidator} from "../../../../../validation/FormValidator";

@Component({
  selector: 'app-drg-group-detail',
  templateUrl: './drg-group-detail.component.html',
  styleUrls: ['./drg-group-detail.component.css']
})
export class DrgGroupDetailComponent implements OnInit {
  saving: any = false;
  drgGroup: any = undefined;
  drgGroupDetailForm: any;
  @Output() drgGroupSavedEvent: any = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
              private patientService: PatientService,
              private message: NzMessageService,) {

    this.drgGroupDetailForm = this.fb.group({
      txtName: [undefined, [Validators.required]],
      selectGroupType: [undefined, [Validators.required]],
      chkDisabled: [false, [Validators.required]],
      numberUpperLimit: [0, [Validators.required]],
      numberLowerLimit: [0, undefined],
    });
  }

  ngOnInit() {
  }

  save() {
    if (!this.drgGroupDetailForm.valid) {
      FormValidator.validateFormInput(this.drgGroupDetailForm);
      this.message.create("error", "验证错误");
      return;
    }
    const formData = this.drgGroupDetailForm.value;
    let dataToSave = this.getData(formData);
    this.saving = true;
    this.patientService.saveDrgGroup(dataToSave)
      .subscribe(response => {
          this.saving = false;
          if (response) {
            this.drgGroup = response.content;
            this.message.success("保存成功");
            this.drgGroupSavedEvent.emit();
          }
        },
        error => {
          this.saving = false;
          this.message.create("error", error.error.message);
        });

  }

  restUi(drgGroup: any) {
    this.drgGroupDetailForm.reset();
    this.drgGroup = drgGroup;
    if (this.drgGroup)
      this.patchFormValue();
    else
      this.drgGroupDetailForm.patchValue({
        txtName: undefined,
        selectGroupType: undefined,
        chkDisabled: false,
        numberUpperLimit: 0,
        numberLowerLimit: 0,
      });
  }

  private patchFormValue() {
    this.drgGroupDetailForm.patchValue({
      txtName: this.drgGroup.name,
      selectGroupType: this.drgGroup.groupType,
      chkDisabled: !this.drgGroup.enabled,
      numberUpperLimit: this.drgGroup.upperLimit,
      numberLowerLimit: this.drgGroup.lowerLimit,
    });
  }

  private getData(formData: any) {
    return {
      uuid: this.drgGroup ? this.drgGroup.uuid : undefined,
      name:formData.txtName,
      groupType: formData.selectGroupType,
      enabled: !formData.chkDisabled,
      upperLimit: formData.numberUpperLimit,
      lowerLimit: formData.numberLowerLimit,
    }
  }
}
