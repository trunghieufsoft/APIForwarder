import { AbstractControl, ValidationErrors } from "@angular/forms";

export function customEmailValidator(
  control: AbstractControl
): ValidationErrors {
  if (!control.value) {
    return undefined;
  }

  const emailPattern = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  const tempData = control.value.split(",").map(value => {
    return value.replace(/\s/g, "");
  });
  const isValid = tempData.some(element => {
    return !emailPattern.test(element.toLowerCase());
  });

  if (isValid) {
    control.setErrors({ email: true });

    return {
      email: true
    };
  }
}
