import { OnboardingTemplate } from "@/components/templates/OnboardingTemplate";
import { useOnboardingForm } from "./useOnboardingForm";

export default function Onboarding() {
  const form = useOnboardingForm();
  return <OnboardingTemplate {...form} />;
}
