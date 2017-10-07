import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export namespace Validators {

  export function afterDate(baseDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const thisDate = new Date(control.value);
      return thisDate <= baseDate ? { 'afterDate': thisDate } : null;
    }
  }

}


export * from './after-date.directive';
