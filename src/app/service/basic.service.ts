import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BasicService {

  public defaultToolbarMenu = [
    'fullscreen', 'source', '|', 'undo', 'redo', '|',
    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
    'directionalityltr', 'directionalityrtl', 'indent', '|',
    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
    'horizontal', 'date', 'time', 'spechars', '|',
    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
    'print', 'preview', 'searchreplace', 'help',
    '|', 'sp1', 'sp2', 'sp3', 'sp4', 'sp5', '|',
    'sp6', 'sp7', 'sp8', 'sp9', 'sp10', 'sp11', 'sp12', 'sp13', 'sp14', 'sp15', 'sp16', 'sp17', '|',
    'sp18', 'sp19', 'sp20', 'sp21', 'sp22', 'sp23', 'sp24', 'sp25', 'sp26', 'sp27', 'sp28', 'sp29', 'sp30', 'sp31', 'sp32', 'sp33', '|',
    'sp34', 'sp35', 'sp36', 'sp37', '|',
    'sp38', 'sp39', 'sp40', 'sp41', 'sp42', 'sp43', '|',
  ];

  public ueditor_config = {

    toolbars: [
      this.defaultToolbarMenu
    ],
    UEDITOR_HOME_URL: '/assets/ueditor/',
    autoClearinitialContent: true,  // 自动清除初始内容
    wordCount: false, // 文false字计数
    focus: false, // 初始化后获得焦点
    initialFrameHeight: 700, // 设置高度
    initialFrameWidth: 1000, // 设置宽度
    autoHeightEnabled: false, // 自动高度
    enableAutoSave: false,
  };


  constructor(private appService: AppService) {
  }

  getPagedEntityList(searchFilter: any, entityType, pageNumber) {
    return this.appService.httpPost(`api/basic/${entityType}/list/${pageNumber}`, searchFilter);
  }

  getSelectionPagedEntityList(searchFilter: any, entityType, pageNumber, pageSize) {
    return this.appService.httpPost(`api/basic/${entityType}/list/${pageNumber}/${pageSize}`, searchFilter);
  }

  getManufacturerList(searchCodeDto: { searchCode: string }, manufactureType: any) {
    return this.appService.httpPost(`api/basic/manufacturer/${manufactureType}/list`, searchCodeDto);
  }

  getMedicineDetailInitializeSelectionList() {
    return this.appService.httpGet('api/basic/medicine/detail/pram');
  }

  saveMedicine(medicine: any) {
    return this.appService.httpPost('api/basic/medicine/save', medicine);
  }

  getMedicineList(medicineFilterDto: any) {
    return this.appService.httpPost('api/basic/medicine/list', medicineFilterDto);
  }

  getPagedMedicineList(searchCode: any, pageNum: any) {
    return this.appService.httpPost('api/basic/medicine/list/' + pageNum, searchCode);
  }

  getItemList(itemFilterDto: any) {
    return this.appService.httpPost('api/basic/item/list', itemFilterDto);
  }

  getPagedItemList(searchCode: any, pageNum: any) {
    return this.appService.httpPost('api/basic/item/list/' + pageNum, searchCode);
  }

  getItemDetailInitializeSelectionList() {
    return this.appService.httpGet('api/basic/item/detail/pram');
  }

  saveItem(item: any) {
    return this.appService.httpPost('api/basic/item/save', item);
  }

  getTreatment(treatmentId: any) {
    return this.appService.httpPost(`api/basic/treatment/${treatmentId}`);
  }

  getWarehouseList(warehouseFilter: any) {
    return this.appService.httpPost('api/basic/warehouse/list', warehouseFilter);
  }

  getDepartmentList(departmentFilter: any) {
    return this.appService.httpPost('api/basic/department/list', departmentFilter);
  }


  getSupplierList(supplierFilter) {
    return this.appService.httpPost('api/basic/supplier/list', supplierFilter);
  }

  submitEntityPrice(newPriceDto: any, entityType: any) {
    return this.appService.httpPost(`api/basic/${entityType}/price/update/request`, newPriceDto);
  }

  confirmEntityPrice(entityId: any, entityType: any) {
    return this.appService.httpPost(`api/basic/${entityType}/price/update/confirm/${entityId}`);
  }

  //
  // getWardList() {
  //   return this.appService.httpGet( 'api/basic/ward/list');
  // }


  // getEntityList(entityFilterDto: any) {
  //   return this.appService.httpPost('api/basic/entity/list', entityFilterDto);
  // }


  getPagedEntityStockList(inventoryEntityFilter: any, entityType: string, pageNum: any) {
    return this.appService.httpPost(`api/basic/${entityType}/all/stock/list/` + pageNum, inventoryEntityFilter);
  }

  getSelectionPagedEntityStockList(inventoryEntityFilter: any, entityType: string, pageNum: any, pageSize: any) {
    return this.appService.httpPost(`api/basic/${entityType}/all/stock/list/${pageNum}/${pageSize}`, inventoryEntityFilter);
  }

  // getPagedMedicineStockList(inventoryEntityFilter: any, pageNum: any, page) {
  //   return this.getPagedEntityStockList(inventoryEntityFilter, 'medicine', pageNum);
  // }

  getDiseaseList(searchFilter: any, pageNumber: any) {
    return this.appService.httpPost('api/basic/disease/list/' + pageNumber, searchFilter);
  }

  getSelectionDiseaseList(searchFilter: any, pageNumber: any, pageSize: any) {
    return this.appService.httpPost(`api/basic/disease/list/${pageNumber}/${pageSize}`, searchFilter);
  }

  checkItemAllowEdit(itemId: any) {
    return this.appService.httpPost('api/basic/item/allow_edit/' + itemId);
  }

  checkMedicineAllowEdit(medicineId: any) {
    return this.appService.httpPost('api/basic/medicine/allow_edit/' + medicineId);
  }

  getPagedTreatmentList(searchFilter: any, pageNumber: any) {
    return this.appService.httpPost('api/basic/treatment/list/' + pageNumber, searchFilter);
  }

  getSelectionPagedTreatmentList(searchFilter: any, pageNumber: any, pageSize: any) {
    return this.appService.httpPost(`api/basic/treatment/list/${pageNumber}/${pageSize}`, searchFilter);
  }


  getSignOutReasonList() {
    return this.appService.httpGet('api/basic/sign_out_reason/list');
  }

  getMedicalRecordType(filter: any) {
    return this.appService.httpPost('api/basic/medical_record/type/list', filter);
  }

  getMedicalRecordTemplateList(filter: any) {
    return this.appService.httpPost(`api/basic/medical_record/template/list`, filter);
  }

  getMedicalRecordTemplate(templateId: any) {
    return this.appService.httpPost(`api/basic/medical_record/template/${templateId}`);
  }

  getWarehouseTypeList() {
    return this.appService.httpGet('api/basic/warehouse_type/list');
  }

  saveTemplate(data: any) {
    return this.appService.httpPost(`api/basic/medical_record/template/save`, data);
  }

  setMedicalRecordTypeStatus(enabled: any, typeId: any) {
    return this.appService.httpPost(`api/basic/medical_record/type/${typeId}/${enabled ? 'enable' : 'disable'}`);
  }

  setMedicalRecordTemplateStatus(template: any) {
    return this.appService.httpPost(`api/basic/medical_record/template/${template.uuid}/${template.enabled ? 'enable' : 'disable'}`);
  }

  getTemplateTagTree(loginUser: any) {
    return this.appService.httpPost(`api/basic/medical_record/template/tag/list`, loginUser);
  }

  saveTag(tag: any) {
    return this.appService.httpPost(`api/basic/medical_record/template/tag/save`, tag);
  }

  getNewTemplateCommonHeader() {
    return this.appService.httpPost(`api/basic/medical_record/template/new/common_header`);
  }

  getWardList(wardFilter: any) {
    return this.appService.httpPost(`api/basic/ward/list`, wardFilter);
  }

  getMedicineTypeList() {
    return this.appService.httpGet('api/basic/medicine_type/list');
  }

  quickAddManufacture(manufacture: any, manufactureType: any) {
    return this.appService.httpPost(`api/basic/manufacturer/${manufactureType}/quick_add`, manufacture);
  }

  quickAddSupplier(supplierName: any) {
    return this.appService.httpPost(`api/basic/supplier/quick_add`, supplierName);
  }

  quickAddUom(uomQuickAdd: any) {
    return this.appService.httpPost(`api/basic/uom/quick_add`, uomQuickAdd);
  }

  rebuildAllSearchCode() {
    return this.appService.httpPost(`api/basic/system/search_code/rebuild`);
  }

  quickAddLevelTwoWarehouse(warehouseQuickAdd: any) {
    return this.appService.httpPost(`api/basic/warehouse/level_two/quick_add`, warehouseQuickAdd);
  }

  quickAddBrand(brand: any) {
    return this.appService.httpPost(`api/basic/brand/quick_add`, brand);
  }

  quickAddFromHospital(fromHospital: any) {
    return this.appService.httpPost(`api/basic/from_hospital/quick_add`, fromHospital);
  }

  getBrandList(brandFilter: any) {
    return this.appService.httpPost('api/basic/brand/list', brandFilter);
  }

  getAllEntityStockList(inventoryEntityFilter: any, entityType: any) {
    return this.appService.httpPost(`api/basic/${entityType}/all/stock/list/`, inventoryEntityFilter);
  }

  getTreatmentDetailInitializeSelectionList() {
    return this.appService.httpGet('api/basic/treatment/detail/pram');
  }

  saveTreatment(treatment: any) {
    return this.appService.httpPost('api/basic/treatment/save', treatment);
  }

  updateFeeSetting(entityTyp: string, reqDto: any) {
    return this.appService.httpPost(`api/basic/${entityTyp}/fee_setting`, reqDto);
  }

  updateBedTreatment(bedTreatmentSetup: any) {
    return this.appService.httpPost(`api/basic/ward/room/bed/treatment`, bedTreatmentSetup);
  }

  removeMessage(messageToDelete) {
    return this.appService.httpPost(`api/basic/message/delete`, messageToDelete);
  }


  jdyDemo() {
    return this.appService.httpPost(`public/jdy/demo`, undefined);
  }

  getInsuranceTypeList() {
    return this.appService.httpGet(`api/basic/insurance_type/list`);
  }
}

