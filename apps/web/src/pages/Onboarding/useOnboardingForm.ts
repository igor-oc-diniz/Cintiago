import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/authSlice";
import { createClient } from "@/api/clients";
import { getMe } from "@/api/auth";
import { useAuth } from "@/hooks/useAuth";
import type { DeliveryAddress } from "@/types/domain";
import type { FormErrors } from "@/components/templates/OnboardingTemplate/types";

const ADDR_EMPTY: DeliveryAddress = {
  cep: "",
  rua: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
};

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

function formatCep(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

function validate(phone: string, addr: DeliveryAddress): FormErrors {
  const errors: FormErrors = {};
  const digits = phone.replace(/\D/g, "");
  if (!digits) errors.phone = "Telefone obrigatório";
  else if (digits.length < 10) errors.phone = "Telefone inválido";
  if (!addr.cep.trim()) errors.cep = "CEP obrigatório";
  if (!addr.rua.trim()) errors.rua = "Rua obrigatória";
  if (!addr.number.trim()) errors.number = "Número obrigatório";
  if (!addr.neighborhood.trim()) errors.neighborhood = "Bairro obrigatório";
  if (!addr.city.trim()) errors.city = "Cidade obrigatória";
  return errors;
}

function isFormFilled(phone: string, addr: DeliveryAddress): boolean {
  const phoneDigits = phone.replace(/\D/g, "");
  return (
    phoneDigits.length >= 10 &&
    addr.cep.replace(/\D/g, "").length === 8 &&
    addr.rua.trim() !== "" &&
    addr.number.trim() !== "" &&
    addr.neighborhood.trim() !== "" &&
    addr.city.trim() !== ""
  );
}

export interface OnboardingFormData {
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

export function useOnboardingForm(): OnboardingFormData {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useAuth();

  const [phone, setPhone] = useState("");
  const [addr, setAddr] = useState<DeliveryAddress>(ADDR_EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCepLoading, setIsCepLoading] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: createClient,
    onSuccess: async () => {
      const updatedUser = await getMe();
      dispatch(setCredentials({ token: token ?? "cookie", user: updatedUser }));
      const from =
        (location.state as { from?: { pathname: string } })?.from?.pathname ??
        "/cart";
      navigate(from, { replace: true });
    },
  });

  const onPhoneChange = (value: string) => {
    setPhone(formatPhone(value));
    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
  };

  const onAddrFieldChange = (field: keyof DeliveryAddress, value: string) => {
    if (field === "cep") {
      const formatted = formatCep(value);
      setAddr((prev) => ({ ...prev, cep: formatted }));
      if (errors.cep) setErrors((prev) => ({ ...prev, cep: undefined }));

      const digits = formatted.replace(/\D/g, "");
      if (digits.length === 8) {
        setIsCepLoading(true);
        fetch(`https://viacep.com.br/ws/${digits}/json/`)
          .then((res) => res.json())
          .then(
            (data: {
              logradouro?: string;
              bairro?: string;
              localidade?: string;
              erro?: boolean;
            }) => {
              if (!data.erro) {
                setAddr((prev) => ({
                  ...prev,
                  rua: data.logradouro ?? prev.rua,
                  neighborhood: data.bairro ?? prev.neighborhood,
                  city: data.localidade ?? prev.city,
                }));
              }
            },
          )
          .catch(() => {
            /* allow manual entry */
          })
          .finally(() => setIsCepLoading(false));
      }
      return;
    }

    setAddr((prev) => ({ ...prev, [field]: value }));
    const errorKey = field as keyof FormErrors;
    if (errors[errorKey])
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
  };

  const onSubmit = () => {
    const validation = validate(phone, addr);
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    mutate({
      userId: user!.id,
      phone: phone.replace(/\D/g, ""),
      street: addr.rua,
      number: addr.number,
      complement: addr.complement || undefined,
      neighborhood: addr.neighborhood,
      city: addr.city,
      zipCode: addr.cep.replace(/\D/g, ""),
    });
  };

  return {
    userName: user?.name?.split(" ")[0] ?? "você",
    phone,
    onPhoneChange,
    addr,
    onAddrFieldChange,
    errors,
    isSubmitting: isPending,
    isCepLoading,
    isFormValid: isFormFilled(phone, addr),
    onSubmit,
  };
}
