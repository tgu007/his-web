import {FormControl, FormGroup} from "@angular/forms";
import {validationMessages} from "./form-validation-messages";

export class FormValidator {

  public static validateForm(formGroup: any, formErrors: Object, validateDirtyControls: boolean = true, formGroupName: any): void {
    for (const field in formGroup.controls) {
      let element = formGroup.get(field);
      if (element instanceof FormGroup) {
        FormValidator.validateForm(element, formErrors, validateDirtyControls, formGroupName);
      } else if (element instanceof FormControl) {
        formErrors[field] = '';
        const control = formGroup.get(field);
        if ((!validateDirtyControls || control.dirty) && control.errors) {
          formErrors[field] = validationMessages[formGroupName][field][Object.keys(control.errors)[0]];
        }
      }
    }
  }

  public static validateFormInput(formGroup: any) {
    Object.keys(formGroup.controls).forEach(control => {
      formGroup.controls[control].markAsDirty();
      formGroup.controls[control].updateValueAndValidity();
    });
  }
}

