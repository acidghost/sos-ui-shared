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
  selector: '[minValue]',
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: MinValueDirective,
    multi: true
  }]
})
export class MinValueDirective implements Validator, OnChanges {

  @Input() minValue: number;

  private valFn: ValidatorFn = NgValidators.nullValidator;

  ngOnChanges(changes: SimpleChanges): void {
    const value = changes['minValue'].currentValue;
    if (changes) {
      this.valFn = Validators.minValue(parseInt(value));
    } else {
      this.valFn = NgValidators.nullValidator;
    }
  }

  validate(c: AbstractControl): ValidationErrors | any {
    return this.valFn(c);
  }

}
