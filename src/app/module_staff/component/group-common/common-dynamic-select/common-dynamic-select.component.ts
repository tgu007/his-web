import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input, OnChanges,
  OnInit,
  Output, QueryList, SimpleChanges, ViewChild, ViewChildren
} from '@angular/core';
import * as globals from "../../../../../globals";
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NzSelectComponent, NzTreeComponent} from "ng-zorro-antd";

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CommonDynamicSelectComponent),
  multi: true
};

@Component({
  selector: 'app-common-dynamic-select',
  templateUrl: './common-dynamic-select.component.html',
  styleUrls: ['./common-dynamic-select.component.css'],
  providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class CommonDynamicSelectComponent implements OnInit, ControlValueAccessor {

  @Input() dataList: any;
  @Input() totalDataCount: any;
  @Input() dataColumns: any;
  tablePageSize = globals.selectionPageSize;
  @Input() pageCount: any;
  selectedItem: any;
  @Output() onSearchEvent = new EventEmitter<any>();
  @Output() onSelectedItemChangedEvent = new EventEmitter<any>();
  @Output() onAddNewItemEnvent = new EventEmitter<any>();
  @Input() placeHolder = '输入名字拼音搜索';
  @Input() selectionWidth = '200px';
  disabled: any = false;
  // @Output() onPageIndexChanged = new EventEmitter<any>();
  onChangeListener = (_: any) => {
  };
  //@ViewChild('tableBody', {static: true}) tableBody: ElementRef;

  @ViewChild(NzSelectComponent, {static: false}) itemSelect: NzSelectComponent;

  //@ViewChildren('rowElement') rowElementList: QueryList<any>;
  @Input() allowKeyBoardControl = false;
  isLoading: any = false;
  searchText = ''
  selectedRowIndex;
  currentPageIndex: any = 1;
  selectedItemLabel: any;
  @Input() addNewItemLabel: any;
  @Input() showAddNew: any = false;
  @Input() addNewPlaceHolder: any;
  adding: any = false;
  @Input() allowClear: any = false;
  @Output() onClearEvent = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {

  }

  pageIndexChanged(pageNumber) {
    this.selectedRowIndex = undefined;
    let searchCodeDto = {pageNumber: pageNumber, input: this.searchText}
    this.onSearchEvent.emit(searchCodeDto);
  }

  dataSelected(dataRow: any) {
    this.selectedItem = dataRow;
    this.selectedItemLabel = 'fakeSelection';
    this.onChangeListener(dataRow); // 告诉form，你的表单值改变成了payload
    this.onSelectedItemChangedEvent.emit(dataRow);
    this.itemSelect.closeDropDown();
    this.itemSelect.focus();
  }

  searchItem(input) {
    if (input.length < 2)
      return;
    this.searchText = input;
    this.selectedRowIndex = undefined;
    this.currentPageIndex = 1;
    let searchCodeDto = {pageNumber: this.currentPageIndex, input: input}
    this.onSearchEvent.emit(searchCodeDto);
  }

  reset() {
    this.currentPageIndex = 1;
    this.searchText = '';
    this.selectedRowIndex = undefined;
    this.selectedItem = undefined;
    this.selectedItemLabel = undefined;
  }


  registerOnChange(fn: any): void {
    this.onChangeListener = fn; // 保存这个函数
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: any): void {
    if (value) {
      this.selectedItem = value;
      this.selectedItemLabel = 'fakeSelection'
      //this.txtItem = this.selectedItem.label;// form中给你设置了obj值，根据obj，去更新组件/UI

    } else {
      this.selectedItem = undefined;
      this.selectedItemLabel = undefined;
      //this.txtItem = undefined;
    }
  }


  arrowKeyClicked(index: number) {
    if (!this.dataList)
      return;
    if (this.selectedRowIndex != undefined) {
      let newIndex = this.selectedRowIndex + index;
      if (newIndex >= 0 && newIndex < this.dataList.length)
        this.selectedRowIndex = newIndex;
    } else
      this.selectedRowIndex = 0;

  }

  arrowLeftRightClicked(index: number) {
    if (!this.dataList)
      return;
    let newIndex = this.currentPageIndex + index;
    if (newIndex >= 1 && newIndex <= this.pageCount) {
      this.currentPageIndex = newIndex;
      this.pageIndexChanged(this.currentPageIndex);
    }
  }

  enterClicked() {
    if (this.selectedRowIndex != undefined)
      this.dataSelected(this.dataList[this.selectedRowIndex]);
    else {
      this.itemSelect.toggleDropDown();
    }
  }


  addNewItem(inputElement: HTMLInputElement) {
    this.onAddNewItemEnvent.emit(inputElement.value);
  }

  closeDropDown() {
    if (this.itemSelect.open)
      this.itemSelect.closeDropDown();
  }

  valueChanged() {
    if (this.selectedItemLabel == 'fakeSelection')
      this.onClearEvent.emit();
  }
}
