import {Injectable} from '@angular/core';
import {AppService} from "./app.service";
import {BasicService} from "./basic.service";

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private appService: AppService,
              private basicService: BasicService
  ) {
  }

  getOrderList(pageNum: any, filterDto: any, orderType: any, isPartialOrder = false) {
    return this.appService.httpPost(`api/inventory/${orderType}/order${isPartialOrder ? '/partial' : ''}/list/` + pageNum, filterDto);
  }

  getOrderSelectionList(pageNum: any, filterDto: any, orderType: any, pageSize: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/list/${pageNum}/${pageSize}`, filterDto);
  }

  saveOrder(order: any, orderType: any, isPartialOrder = false) {
    return this.appService.httpPost(`api/inventory/${orderType}/order${isPartialOrder ? '/partial' : ''}/save`, order);
  }

  getOrderDetail(orderId: undefined, orderType: any, isPartialOrder = false) {
    return this.appService.httpPost(`api/inventory/${orderType}/order${isPartialOrder ? '/partial' : ''}/` + orderId);
  }

  confirmOrder(orderId: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/confirm/` + orderId);
  }

  deleteOrder(orderId: any, orderType: any, isPartialOrder = false) {
    return this.appService.httpPost(`api/inventory/${orderType}/order${isPartialOrder ? '/partial' : ''}/delete/` + orderId);
  }

  updateOrderStatus(updateDto: any, orderType: any, action: any, isPartialOrder = false) {
    return this.appService.httpPost(`api/inventory/${orderType}/order${isPartialOrder ? '/partial' : ''}/${action}`, updateDto);
  }

  getPagedOriginOrderList(stockFilter, orderType, pageNumber, pageSize) {
    return this.appService.httpPost(`api/inventory/${orderType}/stock/origin_order/list/${pageNumber}/${pageSize}`, stockFilter);
  }


  getTransferList(itemTransferFilter, pageNum: any, orderType) {
    return this.appService.httpPost(`api/inventory/${orderType}/transfer/list/` + pageNum, itemTransferFilter);
  }

  saveTransfer(transfer: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/transfer/save`, transfer);
  }

  getTransferDetail(transferId: undefined, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/transfer/` + transferId);
  }

  confirmTransfer(transferId: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/transfer/confirm/` + transferId);
  }

  deleteTransfer(transferId: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/transfer/delete/` + transferId);
  }

  updateTransferStatus(updateDto: any, orderType: any, action: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/transfer/${action}`, updateDto);
  }

  updateStockQuantity(newQuantityDto: any, entityType) {
    return this.appService.httpPost(`api/inventory/stock/${entityType}/adjust`, newQuantityDto);
  }

  getPrescriptionOrderList(orderStatus: string, orderFilter: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/list/${orderStatus}`, orderFilter);
  }

  getPrescriptionOrderLineList(orderId: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/${orderId}/line/list`);
  }

  getPrescriptionOrderLineSummaryList(orderId: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/${orderId}/line/list/summary`);
  }

  // confirmPrescriptionMedicineOrder(orderId: any) {
  //   return this.appService.httpPost(`api/inventory/medicine/prescription/order/${orderId}/confirm`);
  // }

  processPrescriptionMedicineOrder(orderId: any, processOrderDto) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/${orderId}/process`, processOrderDto);
  }

  updatePrescriptionMedicineOrderStatus(orderId: any, action: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/${orderId}/${action}`);
  }

  getProcessedPrescriptionOrderLineList(currentPageIndex: any, filterDto: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/processed/list/${currentPageIndex}`, filterDto);
  }

  getProcessedPrescriptionMedicineOrderSummaryList(filter: { patientSignInIdList: any[] }) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/processed/summary/list`, filter);
  }

  requestPrescriptionMedicineOrderReturn(returnDto: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/return`, returnDto);
  }

  getPrescriptionReturnOrderList(orderStatus: string, orderFilter: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/return/list/${orderStatus}`, orderFilter);
  }

  getPrescriptionReturnOrderLineSummaryList(orderId: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/return/${orderId}/line/list/summary`);
  }

  processPrescriptionMedicineReturnOrder(orderId: any, processOrderDto: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/return/${orderId}/process`, processOrderDto);
  }

  generateMedicineTransferOrder(orderId: any) {
    return this.appService.httpPost(`api/inventory/medicine/order/generate_transfer/${orderId}`);
  }


  getOrderRequestList(pageNum: any, filterDto: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/request/list/` + pageNum, filterDto);
  }

  getOrderRequestSelectionList(pageNum: any, filterDto: any, orderType: any, pageSize: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/request/list/${pageNum}/${pageSize}`, filterDto);
  }

  getOrderRequestDetail(orderRequestId: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/request/` + orderRequestId);
  }

  saveOrderRequest(orderRequest: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/request/save`, orderRequest);
  }

  updateOrderRequestStatus(updateDto: any, orderType: any, action: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/request/${action}`, updateDto);
  }

  deleteOrderRequest(orderRequestId: any, orderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/request/delete/` + orderRequestId);
  }

  getSourceOrderLineList(orderType: any, uuid: any, sourceOrderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/${sourceOrderType}/${uuid}/line/list`);
  }

  copySourceLine(orderType: any, sourceLineKeyList: any, sourceOrderType: any) {
    return this.appService.httpPost(`api/inventory/${orderType}/order/${sourceOrderType}/line/copy`, sourceLineKeyList);
  }

  getStockOriginOrderLineList(entityType: any, stockIdList: any) {
    return this.appService.httpPost(`api/inventory/${entityType}/stock/origin_order_line/list`, stockIdList);
  }

  getPrescriptionMedicineUsageList(warehouseId: any, filterDto: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/usage/list/${warehouseId}`, filterDto);
  }

  deletePrescriptionMedicineOrderLine(orderLineId: any) {
    return this.appService.httpPost(`api/inventory/medicine/prescription/order/line/${orderLineId}/delete`);
  }
}
