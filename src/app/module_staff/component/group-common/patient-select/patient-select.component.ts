import {
  Component,
  OnInit,
  ViewChild,
  AfterViewChecked,
  Input,
  AfterViewInit,
  EventEmitter,
  Output
} from '@angular/core';
import {NzFormatEmitEvent, NzTreeComponent} from "ng-zorro-antd";
import {PatientService} from "../../../../service/patient.service";

@Component({
  selector: 'app-patient-select',
  templateUrl: './patient-select.component.html',
  styleUrls: ['./patient-select.component.css']
})
export class PatientSelectComponent implements OnInit {

  //nodes: any = [];
  @ViewChild(NzTreeComponent, {static: false}) nzTreeComponent: NzTreeComponent;
  @Input() expendAll: any;
  @Input() selectAll: any = true;

  patientSelectChangedEvent: EventEmitter<any> = new EventEmitter();
  patientNodes: any = [];
  @Input() allowMultiple: any = true;
  @Input() checkable: any = true;
  @Input() loadAllOnInit: any = true;
  @Output() initEvent = new EventEmitter<any>();
  @Input() triggerOnNode: any = false;


  getSelectedPatientList() {
    let allPatientNodes = [];
    this.patientNodes
      .forEach(wardNode => wardNode.children
        .forEach(roomNode => roomNode.children
          .forEach(patientNode => allPatientNodes.push(patientNode))
        ));
    let selectedNodeKeyList = [];
    allPatientNodes.filter(node => node.checked == true)
      .forEach(checkedNode => selectedNodeKeyList.push(checkedNode.key));
    return selectedNodeKeyList;
  }

  constructor(private patientService: PatientService) {
  }

  ngOnInit() {
    if (this.loadAllOnInit)
      this.loadPatientTree({wardIdList: undefined});

  }

  nzCheck($event: NzFormatEmitEvent) {
    this.patientSelectChangedEvent.emit(this.getSelectedPatientList());
  }

  nzClicked(event: NzFormatEmitEvent) {
    if (this.triggerOnNode)
      this.patientSelectChangedEvent.emit([event.node]);
    else if (event.node.level == 2) {
      this.patientSelectChangedEvent.emit([event.node.key]);
    }
    // if (this.checkable)
    //   event.node.isChecked = !event.node.isChecked

  }

  public loadPatientTree(wardFilter) {
    return this.patientService.getWardPatientTreeList(wardFilter)
      .toPromise()
      .then(response => {
        if (response) {
          if (!this.selectAll)
            this.unSelectAllNodes(response.content);
          this.patientNodes = response.content;
          this.patientSelectChangedEvent.emit(this.getSelectedPatientList());
        }
      });
  }


  //此处为INIT时 TREE还没有INIT
  private unSelectAllNodes(patientTree) {
    for (let wardNode of patientTree) {
      wardNode.checked = false;
      for (let roomNode of wardNode.children) {
        roomNode.checked = false;
        for (let patientNode of roomNode.children)
          patientNode.checked = false;
      }
    }
  }

}
