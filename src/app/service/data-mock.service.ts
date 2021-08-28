import { Injectable } from '@angular/core';
import {AppService} from "./app.service";

@Injectable({
  providedIn: 'root'
})
export class DataMockService {

  constructor(private appService: AppService) {
  }

  mockMedicineOrder() {
    return this.appService.httpPost(`api/mock/order/medicine`);
  }

  mockItemOrder() {
    return this.appService.httpPost(`api/mock/order/item`);
  }
}
