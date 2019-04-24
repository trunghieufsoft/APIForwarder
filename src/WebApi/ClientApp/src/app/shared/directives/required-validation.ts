import { AbstractControl, ValidationErrors } from "@angular/forms";

export function requiredDateValidator(
  control: AbstractControl
): ValidationErrors {
  if (control.pristine) {
    return;
  }

  if (!control.value) {
    control.markAsDirty();
    control.setErrors({ required: true });

    return {
      required: true
    };
  }
}
