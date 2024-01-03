import { FieldValues, FormState } from 'react-hook-form';

export function willDisableSubmit<T extends FieldValues>(
  formState: FormState<T>,
) {
  return !formState.isValid || formState.isSubmitting;
}
