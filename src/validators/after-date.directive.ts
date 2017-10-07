import {Directive, Input, OnChanges, SimpleChanges} from "@angular/core";
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators as NgValidators
} from "@angular/forms";
import {Validators} from "./index";


@Directive({
  selector: '[afterDate]',
  providers: [{ provide: NG_VALIDATORS, useExisting: AfterDateValidatorDirective, multi: true }]
})
export class AfterDateValidatorDirective implements Validator, OnChanges {

  @Input() afterDate: string;

  private valFn: ValidatorFn = NgValidators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const baseDate = changes['afterDate'].currentValue;
    if (changes) {
      this.valFn = Validators.afterDate(new Date(baseDate));
    } else {
      this.valFn = NgValidators.nullValidator;
    }
  }

  validate(c: AbstractControl): ValidationErrors | any {
    return this.valFn(c);
  }

}
