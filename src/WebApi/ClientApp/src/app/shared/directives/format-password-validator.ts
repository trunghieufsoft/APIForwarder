import { AbstractControl, ValidationErrors } from "@angular/forms";

export function formatPasswordValidator(
  control: AbstractControl
): ValidationErrors {
  if (!control.value) {
    return undefined;
  }

  const isValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d~!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{10,}$/.test(
    control.value
  );

  return isValid ? null : { isFormat: true };
}
