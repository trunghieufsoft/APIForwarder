import { FormGroup, ValidatorFn } from "@angular/forms";
export function dateRangeValidator(from: string, to: string): ValidatorFn {
  return (formGroup: FormGroup): any => {
    const fromControl = formGroup.controls[from];
    const toControl = formGroup.controls[to];
    var from1 = resetHour(fromControl.value);
    var to1 = resetHour(toControl.value);
    if (from1 && to1 && from1 > to1) {
      toControl.markAsDirty();
      toControl.setErrors({ validDateDuration: true });
    } else if (
      toControl.errors &&
      (Object.keys(toControl.errors).length > 1 ||
        Object.keys(toControl.errors)[0] !== "validDateDuration")
    ) {
      delete toControl.errors.validDateDuration;
    } else {
      toControl.setErrors(null);
    }
  };
}

export function dateContractRangeValidator(from: string, to: string): ValidatorFn {
  return (formGroup: FormGroup): any => {
    const fromControl = formGroup.controls[from];
    const toControl = formGroup.controls[to];
    var from1 = resetHour(fromControl.value);
    var to1 = resetHour(toControl.value);
    if (from1 && to1 && from1 > to1) {
      toControl.markAsDirty();
      toControl.setErrors({ validContractDate: true });
    } else if (
      toControl.errors &&
      (Object.keys(toControl.errors).length > 1 ||
        Object.keys(toControl.errors)[0] !== "validContractDate")
    ) {
      delete toControl.errors.validContractDate;
    } else {
      toControl.setErrors(null);
    }
  };
}

export function dateEqualValidator(from: string, to: string): ValidatorFn {
  return (formGroup: FormGroup): any => {
    const fromControl = formGroup.controls[from];
    const toControl = formGroup.controls[to];
    var from1 = resetHour(fromControl.value);
    var to1 = resetHour(toControl.value);
    if (from1 && to1 && from1 > to1) {
      toControl.markAsDirty();
      toControl.setErrors({ validDateDurationSchedule: true });
    } else if (
      toControl.errors &&
      (Object.keys(toControl.errors).length > 1 ||
        Object.keys(toControl.errors)[0] !== "validDateDurationSchedule")
    ) {
      delete toControl.errors.validDateDurationSchedule;
    } else {
      toControl.setErrors(null);
    }
  };
}

function resetHour(d: Date): Date {
  if (d && d instanceof Date) {
    d.setHours(0);
    d.setMinutes(0);

    return d;
  }

  return null;
}

export function weekRangeValidator(from: string, to: string): ValidatorFn {
  return (formGroup: FormGroup): any => {
    const fromControl = formGroup.controls[from];
    const toControl = formGroup.controls[to];

    if (parseInt(fromControl.value) > parseInt(toControl.value)) {
      toControl.markAsDirty();
      toControl.setErrors({ validWeekDuration: true });
      // } else if (toControl.errors && (Object.keys(toControl.errors).length > 0)) {
      //   delete toControl.errors.validWeekDuration;
    } else {
      toControl.setErrors(null);
    }
  };
}

export function readyCommitRangeValidator(
  from: string,
  to: string
): ValidatorFn {
  return (formGroup: FormGroup): any => {
    const fromControl = formGroup.controls[from];
    const toControl = formGroup.controls[to];

    if (
      fromControl.value &&
      fromControl.value instanceof Date &&
      toControl.value &&
      toControl.value instanceof Date &&
      fromControl.value > toControl.value
    ) {
      toControl.markAsDirty();
      toControl.setErrors({ validDateCommitTime: true });
    } else if (
      toControl.errors &&
      (Object.keys(toControl.errors).length > 0 ||
        Object.keys(toControl.errors)[0] !== "validDateCommitTime")
    ) {
      delete toControl.errors.validDateCommitTime;
    } else {
      toControl.setErrors(null);
    }
  };
}

export function dateValidator(arr: any): ValidatorFn {
  return (formGroup: FormGroup): any => {
    if (arr && arr.length > 0) {
      for (let i = 0; i < arr.length; i++) {
        const control = formGroup.controls[arr[i]];
        const isValid = !control.value || control.value instanceof Date;
        if (!isValid) {
          control.markAsDirty();
          control.setErrors({ invalidDate: true });
        } else if (control.errors && Object.keys(control.errors).length > 0) {
          delete control.errors.invalidDate;
        } else {
          control.setErrors(null);
        }
      }
    }
  };
}
