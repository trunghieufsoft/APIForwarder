import { ValidatorFn, FormGroup } from "@angular/forms";

export function customEqualsValidator(
  controlName: string,
  equalControlName: string
): ValidatorFn {
  return (formGroup: FormGroup): { [key: string]: boolean } | null => {
    const control = formGroup.controls[controlName];
    const equalControl = formGroup.controls[equalControlName];

    if (equalControl.errors && !equalControl.errors.sameWithCurrentPass) {
      // return if another validator has already found an error on the equalControl
      return;
    }

    // set error on equalControl if validation fails
    if (control.value === equalControl.value) {
      equalControl.setErrors({ sameWithCurrentPass: true });
    } else {
      equalControl.setErrors(null);
    }
  };
}
