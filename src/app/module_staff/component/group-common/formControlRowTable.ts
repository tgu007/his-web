import {NzMessageService} from "ng-zorro-antd";
import {FormValidator} from "../../../../validation/FormValidator";

export abstract class formControlRowTable {
  lineArray: any;
  editCache: any = [];

  setLineArray(lineArray: any) {
    this.lineArray = lineArray;
  }


  protected constructor(protected message: NzMessageService) {

  }

  addLineControl(doRowValidation: boolean = true) {
    //是否有再编辑中的数据行
    let newLineControl;
    if (!doRowValidation || this.allLineCommitted()) {
      newLineControl = this.newLineControl();
      this.lineArray.controls = [...this.lineArray.controls, newLineControl];
      this.editCache.push({inEdit: doRowValidation, rowSelectionList: {}});
    }
    return newLineControl;
  }

  protected abstract newLineControl();

  editLineControl(rowIndex: number) {
    if (this.allLineCommitted())
      this.editCache[rowIndex].inEdit = true;
  }

  removeLineControl(rowIndex: number) {
    this.editCache.splice(rowIndex, 1);
    this.lineArray.removeAt(rowIndex);
  }

  commitLineControl(rowIndex: number) {
    const rowControl = this.lineArray.controls [rowIndex];
    if (rowControl.valid) {
      this.editCache[rowIndex].inEdit = false;
      return true;
    } else {
      FormValidator.validateFormInput(rowControl);
      this.message.create("error", `验证错误`);
      return false;
    }
  }

  allLineCommitted() {
    let anyRowInEdit = this.editCache.find(e => e.inEdit == true);
    if (anyRowInEdit) {
      let inEditRowIndex = this.editCache.lastIndexOf(anyRowInEdit);
      return this.commitLineControl(inEditRowIndex);
    }
    return true;
  }

  resetUi() {
    this.lineArray.clear();
    this.editCache = [];
  }

}
