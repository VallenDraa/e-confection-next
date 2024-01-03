import { FieldValues, FormState, UseFormSetValue } from 'react-hook-form';

export function overrideNumberInput<T extends FieldValues>(
  e: InputEvent,
  key: string,
  setValue: UseFormSetValue<T>,
) {
  setValue(key as any, (e.target as HTMLInputElement).valueAsNumber as any);
}

export function willDisableSubmit<T extends FieldValues>(
  formState: FormState<T>,
) {
  return formState.isDirty || !formState.isValid || formState.isSubmitting;
}
