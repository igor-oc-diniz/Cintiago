import type { DeliveryAddress } from "@/types/domain";

export interface FormErrors {
  phone?: string;
  cep?: string;
  rua?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
}

export interface OnboardingTemplateProps {
  userName: string;
  phone: string;
  onPhoneChange: (value: string) => void;
  addr: DeliveryAddress;
  onAddrFieldChange: (field: keyof DeliveryAddress, value: string) => void;
  errors: FormErrors;
  isSubmitting: boolean;
  isCepLoading: boolean;
  isFormValid: boolean;
  onSubmit: () => void;
}
