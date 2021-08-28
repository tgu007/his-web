import {Component, OnInit, ViewChild} from '@angular/core';
import {PatientDetailComponent} from "../patient-detail/patient-detail.component";
import {DrgGroupDetailComponent} from "../drg-group-detail/drg-group-detail.component";
import {FormBuilder} from "@angular/forms";
import {PatientService} from "../../../../service/patient.service";
import {NzMessageService} from "ng-zorro-antd";

@Component({
  selector: 'app-drg-group-list',
  templateUrl: './drg-group-list.component.html',
  styleUrls: ['./drg-group-list.component.css']
})
export class DrgGroupListComponent implements OnInit {
  drgGroupDetailModalVisible: any = false;
  @ViewChild(DrgGroupDetailComponent, {static: true}) drgGroupDetailComponent: DrgGroupDetailComponent;
  loading: boolean;
  drgGroupList: any;

  constructor(
    private patientService: PatientService,
    private message: NzMessageService) {
  }

  ngOnInit() {
    this.loadDrgGroupList();
  }

  newDrgGroupClicked() {
    this.drgGroupDetailComponent.restUi(undefined)
    this.drgGroupDetailModalVisible = true;
  }

  loadDrgGroupList() {
    this.loading = true;
    this.patientService.loadDrgGroupList()
      .subscribe(response => {
          if (response) {
            this.drgGroupList = response.content;
          }
          this.loading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.loading = false;
        }
      );
  }

  handleCancel() {
    this.drgGroupDetailModalVisible = false;
  }

  editGroup(group: any) {
    this.drgGroupDetailComponent.restUi(group)
    this.drgGroupDetailModalVisible = true;
  }
}
