import type { ProfileForm as ProfileFormValues } from "@/hooks/useProfile";

export interface ProfileFormProps {
  form: ProfileFormValues;
  dirty: boolean;
  cepLoading: boolean;
  isSaving: boolean;
  onFieldChange: <K extends keyof ProfileFormValues>(
    key: K,
    value: ProfileFormValues[K],
  ) => void;
  onZipChange: (value: string) => void;
  onSave: () => void;
}
