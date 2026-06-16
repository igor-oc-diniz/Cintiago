import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "@/api/clients";
import { useAuth } from "@/hooks/useAuth";
import { useStoreInfo } from "@/hooks/useStoreInfo";
import { telHref } from "@/utils/format";
import { lookupCep } from "@/utils/cep";
import { ROUTES } from "@/constants/routes";
import { QUERY_KEYS } from "@/lib/queryClient";
import type { UpdateClientPayloadDTO } from "@cintiago/shared";

export interface ProfileForm {
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
}

const EMPTY_FORM: ProfileForm = {
  phone: "",
  zipCode: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
};

export function useProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { phone: storePhone } = useStoreInfo();

  const { data: profile, isLoading } = useQuery({
    queryKey: QUERY_KEYS.myProfile,
    queryFn: getMyProfile,
  });

  const [form, setForm] = useState<ProfileForm>(EMPTY_FORM);
  const [dirty, setDirty] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        phone: profile.phone ?? "",
        zipCode: profile.zipCode ?? "",
        street: profile.street ?? "",
        number: profile.number ?? "",
        complement: profile.complement ?? "",
        neighborhood: profile.neighborhood ?? "",
        city: profile.city ?? "",
      });
    }
  }, [profile]);

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: (payload: UpdateClientPayloadDTO) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myProfile });
      setDirty(false);
    },
  });

  const setField = <K extends keyof ProfileForm>(
    key: K,
    value: ProfileForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const handleZipChange = async (value: string) => {
    setField("zipCode", value);
    const digits = value.replace(/\D/g, "");
    if (digits.length === 8) {
      setCepLoading(true);
      try {
        const addr = await lookupCep(value);
        setForm((prev) => ({
          ...prev,
          street: addr.street,
          neighborhood: addr.neighborhood,
          city: addr.city,
        }));
        setDirty(true);
      } catch {
        /* CEP inválido/não encontrado — permite preenchimento manual */
      } finally {
        setCepLoading(false);
      }
    }
  };

  const handleSave = () => {
    save({
      phone: form.phone,
      zipCode: form.zipCode,
      street: form.street,
      number: form.number,
      complement: form.complement || undefined,
      neighborhood: form.neighborhood,
      city: form.city,
    });
  };

  const handleLogout = async () => {
    await logout();
    setShowLogoutModal(false);
    navigate(ROUTES.home);
  };

  const handleGoOrders = () => navigate(ROUTES.myOrders);
  const handleContact = () => {
    if (storePhone) window.location.href = telHref(storePhone);
  };

  return {
    user,
    profile,
    isLoading,
    form,
    dirty,
    cepLoading,
    isSaving,
    showLogoutModal,
    setField,
    handleZipChange,
    handleSave,
    handleLogout,
    handleGoOrders,
    handleContact,
    setShowLogoutModal,
  };
}

export type ProfileData = ReturnType<typeof useProfile>;
