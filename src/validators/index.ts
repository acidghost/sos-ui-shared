import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";


export namespace Validators {

  export function afterDate(baseDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const thisDate = new Date(control.value);
      return thisDate <= baseDate ? { 'afterDate': thisDate } : null;
    }
  }

  export function minValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const thisValue = parseInt(control.value);
      return thisValue < min ? { 'minValue': thisValue } : null;
    }
  }

}


export * from './after-date.directive';
export * from './min-value.directive';
