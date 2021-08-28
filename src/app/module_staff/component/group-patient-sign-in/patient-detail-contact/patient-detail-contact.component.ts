import {Component, Input, OnInit} from '@angular/core';
import {formControlRowTable} from "../../group-common/formControlRowTable";
import {NzMessageService} from "ng-zorro-antd";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-patient-detail-contact',
  templateUrl: './patient-detail-contact.component.html',
  styleUrls: ['./patient-detail-contact.component.css']
})
export class PatientDetailContactComponent extends formControlRowTable implements OnInit {
  @Input() patientDetailForm;
  @Input() formErrors;

  constructor(message: NzMessageService,
              private fb: FormBuilder,
  ) {
    super(message);
  }

  ngOnInit() {
    this.setLineArray(<FormArray>this.patientDetailForm.controls['patientContacts']);
  }

  protected newLineControl() {
    return this.fb.group({
      txtId: [undefined, undefined],
      txtContactName: [undefined, Validators.required],
      txtContactRelationship: [undefined, Validators.required],
      txtContactPhoneNumber: [undefined, Validators.required],
      txtContactAddress: ['', null],
    });
  }


  public getData() {
    let patientContactList: any[] = [];
    for (let rowControl of this.lineArray.controls) {
      let patientContact = {
        uuid: rowControl.value.txtId,
        name: rowControl.value.txtContactName,
        phoneNumber: rowControl.value.txtContactPhoneNumber,
        address: rowControl.value.txtContactAddress,
        relationship: rowControl.value.txtContactRelationship,
      };
      patientContactList.push(patientContact);
    }
    return patientContactList;
  }

  patchTableFromValue(lineList: any) {
    for (let line of lineList) {
      this.addLineControl(false);
      let rowIndex = this.lineArray.controls.length - 1;
      let orderLineControl = this.lineArray.controls [rowIndex];

      orderLineControl.patchValue({
        txtId: line.uuid,
        txtContactName: line.name,
        txtContactPhoneNumber: line.phoneNumber,
        txtContactAddress: line.address,
        txtContactRelationship: line.relationship,
      });
    }
  }
}


interface contactData {
  name: string;
  relationship: string;
  phoneNumber: string;
  address: string;
}
