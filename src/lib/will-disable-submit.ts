import { FieldValues, FormState } from 'react-hook-form';

export function willDisableSubmit<T extends FieldValues>(
  formState: FormState<T>,
) {
  return (
    !formState.isDirty ||
    !formState.isValid ||
    formState.isSubmitting ||
    formState.isValidating
  );
}
