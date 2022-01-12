import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FeeService} from "../../../../service/fee.service";
import {NzMessageService, NzModalRef, NzModalService} from "ng-zorro-antd";
import {DatePipe} from "@angular/common";
import {PatientFeeDetailComponent} from "../patient-fee-detail/patient-fee-detail.component";
import * as globals from "../../../../../globals";
import {SessionService} from "../../../../service/session.service";
import {PrintService} from "../../../../service/print.service";
import {YbTzService} from "../../../../service/yb-tz.service";
import {PatientSelectComponent} from "../../group-common/patient-select/patient-select.component";
import {PatientService} from "../../../../service/patient.service";
import {BasicService} from "../../../../service/basic.service";
import {UserService} from "../../../../service/user.service";

@Component({
  selector: 'app-patient-fee-list',
  templateUrl: './patient-fee-list.component.html',
  styleUrls: ['./patient-fee-list.component.css']
})
export class PatientFeeListComponent implements OnInit, AfterViewInit {
  @Input() patientSignIn: any;
  feeList: any;
  feeListByDate: any;
  feeListByType: any;
  drawerVisible = false;
  selectListFormat: any = 'simple';
  filterDateRange: any;
  filterFeeName: any;
  listOfSelectedFeeStatus: any = ['正常'];
  listOfSelectedFeeType: any;
  feeTypeList: any;
  isAllDisplayDataChecked: any;
  mapOfCheckedId: { [key: string]: boolean } = {};
  @ViewChild(PatientFeeDetailComponent, {static: true}) patientManualFeeDetailComponent: PatientFeeDetailComponent;
  totalFeeListCount: any;
  tblFeeListPageIndex: any = 1;
  tablePageSize: any = globals.tablePageSize;
  public uiPermission: any;
  isLoading: any = false;
  printButtonText: any = '打印';
  filterPendingUploadFee: any = false;
  recoveryDepartmentCheck: any = false;
  editCache: any = [];
  collapsed: any = true;
  @ViewChild(PatientSelectComponent, {static: true}) patientSelectComponent: PatientSelectComponent;
  @Output() patientChangedEvent = new EventEmitter<any>();
  confirmModal?: NzModalRef;
  orderDesc: any = true;
  showReturnQuantity: any = false;
  listOfSelectedFeeDepartment: any = [];
  feeDepartmentList: any = [];
  nzFilterOption = () => true;


  constructor(private feeService: FeeService,
              private message: NzMessageService, private datePipe: DatePipe,
              private sessionService: SessionService,
              public printService: PrintService,
              private ybService: YbTzService,
              private patientService: PatientService,
              private modal: NzModalService,
              private basicService: BasicService,
              private userService: UserService,
  ) {
  }

  ngOnInit() {
    this.uiPermission = this.sessionService.getUserPermission().commonComponent.fee;
    this.filterDateRange = [new Date(), new Date()]
    //console.log(this.sessionService.loginUser.departmentIdList);
    let filterDto = {feeStatusList: this.listOfSelectedFeeStatus};
    if (!this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      filterDto["departmentIdList"] = this.getUserDepartment();
    filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
    filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');

    this.subscribeFeeList(filterDto);
    this.subscribeFeeTypeList();
    this.loadDepartmentList();
  }

  ngAfterViewInit(): void {
    let wardFilter = {};
    if (!this.sessionService.getUserPermission().fullWardPermission)
      wardFilter['wardIdList'] = this.sessionService.loginUser.wardIdList;
    this.patientSelectComponent.loadPatientTree(wardFilter)
      .then(
        response => {
          this.patientSelectComponent.patientSelectChangedEvent.subscribe(selectedPatientIdList => {
            if (selectedPatientIdList[0] != this.patientSignIn.uuid)
              this.selectedPatientChanged(selectedPatientIdList[0])
          });
        }
      );
  }

  private subscribeFeeTypeList(reloadFeeList: any = false) {
    this.feeService.getFeeTypeList(this.patientSignIn.uuid)
      .subscribe(response => {
        if (response) {
          this.feeTypeList = response.content;
          if (reloadFeeList)
            this.reloadData();
        }
      });
  }

  addNewFee(entityType: any) {
    this.drawerVisible = true;
    this.patientManualFeeDetailComponent.resetDrawerUI(entityType);
  }

  private subscribeFeeList(filterDto: any) {
    this.showReturnQuantity = false;
    let pageIndex;
    if (this.selectListFormat == 'simple')
      pageIndex = this.tblFeeListPageIndex;
    this.isLoading = true;
    this.feeService.getFeeList(this.patientSignIn.uuid, pageIndex, filterDto, this.selectListFormat)
      .subscribe(response => {
          if (response) {
            if (this.selectListFormat == 'simple') {
              this.feeList = undefined;
              this.editCache = [];
              for (let fee of response.content)
                this.editCache.push({inEdit: false});
              this.feeList = response.content;
              this.totalFeeListCount = response.totalCount;
            } else if (this.selectListFormat == "byDate")
              this.feeListByDate = response.content;
            else if (this.selectListFormat == "byType")
              this.feeListByType = response.content;
          }
          this.isLoading = false;
        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        }
      );
  }

  searchClicked() {
    this.tblFeeListPageIndex = 1;
    this.feeList = undefined;
    this.reloadData();
  }

  reloadData() {
    this.checkAll(false);
    this.subscribeFeeList(this.getFilter());
  }

  private getFilter() {
    let filterDto = {};
    if (!this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      filterDto["departmentIdList"] = this.listOfSelectedFeeDepartment;

    filterDto["orderByDesc"] = this.orderDesc;
    if (this.filterDateRange != undefined) {
      filterDto["startDate"] = this.datePipe.transform(this.filterDateRange[0], 'yyyy-MM-dd HH:mm:ss');
      filterDto["endDate"] = this.datePipe.transform(this.filterDateRange[1], 'yyyy-MM-dd HH:mm:ss');
    }
    if (this.listOfSelectedFeeStatus != undefined && this.listOfSelectedFeeStatus.length > 0)
      filterDto["feeStatusList"] = this.listOfSelectedFeeStatus


    if (this.listOfSelectedFeeType != undefined && this.listOfSelectedFeeType.length > 0)
      filterDto["feeTypeList"] = this.listOfSelectedFeeType


    if (this.filterFeeName != undefined && this.filterFeeName != "")
      filterDto["searchCode"] = this.filterFeeName

    if (this.filterPendingUploadFee)
      filterDto["pendingUpload"] = true;


    return filterDto;
  }


  close(): void {
    this.drawerVisible = false;
  }

  createNewFee() {
    this.patientManualFeeDetailComponent.createNewFee();
  }


  updateFeeStatus(feeIdList: any, action: any) {
    this.isLoading = true;
    this.feeService.updateFeeStatus(feeIdList, action)
      .subscribe(response => {
          this.isLoading = false;
          this.reloadData();
          this.message.create("success", "执行成功");
        },
        error => {
          this.processError(error);
        }
      );
  }

  getSelectedList() {
    let selectedIdList = this.feeList.filter(fee => this.mapOfCheckedId[fee.uuid]).map(fee => fee.uuid);
    if (selectedIdList.length == 0) {
      this.message.create("warning", "没有选中的费用");
      return undefined;
    }
    return selectedIdList;
  }


  cancelFeeList(fee: any) {
    this.confirmModal = this.modal.confirm({
      nzContent: '退费确认',
      nzOnOk: () => {
        let feeIdList;
        if (fee) {
          feeIdList = [];
          feeIdList.push(fee.uuid);
        } else {
          feeIdList = this.getSelectedList();
        }
        //this.isLoading = true;
        if (feeIdList) {
          this.updateFeeStatus({uuidList: feeIdList}, 'cancel')
        }
      }
    });
  }

  processError(error: any) {
    this.message.create("error", error.error.message);
    this.isLoading = false;
  }

  cancelHisFeeList(feeIdList: any) {
    if (feeIdList) {
      this.updateFeeStatus({uuidList: feeIdList}, 'cancel')
    }
  }


  checkAll(value: boolean) {
    if (this.feeList) {
      this.feeList.forEach(fee => (this.mapOfCheckedId[fee.uuid] = value));
      this.refreshStatus();
    }
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.feeList.every(fee => this.mapOfCheckedId[fee.uuid]);
  }

  feeCreated($event: any) {
    this.reloadData();
    this.drawerVisible = false;
  }

  getBackgroundColour(fee: any) {
    if (this.recoveryDepartmentCheck) {
      if (fee.overlapping)
        if (fee.allowMultiExecution)
          return 'green'
        else
          return 'red'

      return undefined;
    } else
      return undefined;
  }

  editLineControl(index: any) {
    this.editCache[index].inEdit = true;
  }

  editSupervisorLineControl(index: number) {
    this.editCache[index].supervisorInEdit = true;
  }

  searchSupervisor(searchCode: string, index: number) {
    if (!searchCode || searchCode == '')
      return;
    let filter = {};
    filter['departmentIdList'] = this.sessionService.loginUser.departmentIdList;
    filter['enabled'] = true;
    filter['allowSupervise'] = true;
    filter['nameSearchCode'] = searchCode;
    this.userService.getUserList(filter).subscribe(
      response => {
        this.editCache[index].supervisorList = response.content;
      });
  }

  commitLineControl(index: any, fee: any) {
    //fee.feeDate =
    //console.log(fee.feeDate);
    this.editCache[index].inEdit = false;
    this.isLoading = true;
    this.feeService.timeAdjustment({
      feeId: fee.uuid,
      newTime: this.datePipe.transform(fee.feeDate, 'yyyy-MM-dd HH:mm:ss')
    })
      .subscribe(response => {
          this.reloadData();
        },
        error => {
          this.isLoading = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  commitSupervisorLLineControl(index: number, fee: any) {
    if (!this.editCache[index].supervisor) {
      this.message.warning("请选择带教")
      return;
    }
    this.feeService.supervisorAdjustment({
      feeId: fee.uuid,
      supervisorId: this.editCache[index].supervisor
    })
      .subscribe(response => {
          this.reloadData();
        },
        error => {
          this.isLoading = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  hasEditPermission(fee: any) {
    // if (!this.sessionService.getUserPermission().commonComponent.fee.readonly)
    //   return false;
    if (this.sessionService.getUserPermission().commonComponent.fee.readOnly)
      return false;
    if (this.sessionService.getUserPermission().fullDepartmentPermission)
      return true;
    else if (this.sessionService.loginUser.departmentIdList.includes(fee.departmentId))
      return true;
    else
      return false;
  }

  private selectedPatientChanged(patientSignInId: any) {
    this.patientService.getSignInDetail(patientSignInId).toPromise()
      .then(response => {
        this.patientSignIn = response.content;
        this.patientChangedEvent.emit(this.patientSignIn);
        this.subscribeFeeTypeList(true);
      });
  }

  cancelPartialFeeClicked(fee: any) {
    this.showReturnQuantity = true;
    fee.showReturnQuantity = true;
  }

  cancelPartialCancel(fee: any) {
    this.showReturnQuantity = false;
    fee.showReturnQuantity = false;
  }

  confirmPartialCancel(fee: any) {
    this.showReturnQuantity = false;
    fee.showReturnQuantity = false;
    if (fee.returnQuantity < 1) {
      this.message.create("warning", "退费数量不能小于1");
      return;
    }
    this.isLoading = true;
    let cancelPram = {feeId: fee.uuid, cancelQuantity: fee.returnQuantity};
    this.feeService.cancelPartialFee(cancelPram)
      .subscribe(response => {
          this.reloadData();
        },
        error => {
          this.isLoading = false;
          this.message.create("error", error.error.message);
        }
      );
  }

  printSummary(filterDto) {
    let selectedFormat = 'byType'
    this.isLoading = true;
    this.printButtonText = '加载数据'
    this.feeService.getFeeList(this.patientSignIn.uuid, undefined, filterDto, selectedFormat)
      .subscribe(response => {
          this.isLoading = false;
          if (response) {
            this.printService.onPrintClicked.emit({
              name: 'feeSummaryList',
              data: {
                feeSummaryList: response.content,
                patientSignIn: this.patientSignIn,
              }
            });
          }

        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.printButtonText = '打印'
        }
      );
  }

  private printSimple(filter) {
    filter["orderByDesc"] = false;
    this.isLoading = true;
    this.printButtonText = '加载数据'
    this.feeService.getAllFeeList(filter, this.patientSignIn.uuid)
      .subscribe(response => {
          if (response) {
            this.printService.onPrintClicked.emit({
              name: 'feeList',
              data: {
                feeList: response.content,
                patientSignIn: this.patientSignIn,
                printFormat: this.sessionService.loginUser.uiPermission.commonComponent.fee.printFormat,
              }
            });
          }
        },
        error => {
          this.message.create("error", error.error.message);
        },
        () => {
          this.isLoading = false;
          this.printButtonText = '打印'
        }
      );
  }

  printClicked() {
    let filterDto = this.getFilter();
    filterDto["feeStatusList"] = ['正常']

    if (this.selectListFormat == 'simple')
      this.printSimple(filterDto);
    else if (this.selectListFormat == 'byType')
      this.printSummary(filterDto);
    else
      this.printDaySummary(filterDto);
  }

  private printDaySummary(filter: any) {
    let selectedFormat = 'byDate'
    filter["orderByDesc"] = false;
    this.isLoading = true;
    this.printButtonText = '加载数据'
    this.feeService.getFeeList(this.patientSignIn.uuid, undefined, filter, selectedFormat)
      .subscribe(response => {
          this.isLoading = false;
          if (response) {
            this.printService.onPrintClicked.emit({
              name: 'feeDaySummaryList',
              data: {
                feeDaySummaryList: response.content,
                patientSignIn: this.patientSignIn,
              }
            });
          }

        },
        error => {
          this.message.create("error", error.error.message);
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
          this.printButtonText = '打印'
        }
      );
  }

  private loadDepartmentList() {
    if (this.sessionService.loginUser.uiPermission.fullDepartmentPermission)
      return;
    let userDepartmentFilter = {departmentTreatmentIdList: this.getUserDepartment()};
    this.basicService.getDepartmentList(userDepartmentFilter)
      .subscribe(response => {
        if (response) {
          //this.feeDepartmentList.push(response.content);
          this.feeDepartmentList = this.feeDepartmentList.concat(response.content);
          this.listOfSelectedFeeDepartment = this.feeDepartmentList.map(d => d.uuid);
        }
      });

    let otherDepartmentType = this.sessionService.loginUser.uiPermission.commonComponent.fee.otherTreatmentDepartment;
    if (otherDepartmentType) {
      this.basicService.getDepartmentList({departmentTreatmentTypeList: otherDepartmentType})
        .subscribe(response => {
          if (response) {
            //this.feeDepartmentList.push(response.content);
            this.feeDepartmentList = this.feeDepartmentList.concat(response.content);
            this.listOfSelectedFeeDepartment = this.feeDepartmentList.map(d => d.uuid);
          }
        });
    }

  }

  private getUserDepartment() {
    let permittedDepartmentList = this.sessionService.loginUser.departmentIdList;
    if (permittedDepartmentList.find(d => d == this.patientSignIn.departmentTreatment.uuid)) {
      permittedDepartmentList = [this.patientSignIn.departmentTreatment.uuid]; //如果为病区科室，只需要病人病区科室即可
      permittedDepartmentList = permittedDepartmentList.concat(this.patientSignIn.previousWardDepartmentIdList);
    }
    return permittedDepartmentList;
  }


}
