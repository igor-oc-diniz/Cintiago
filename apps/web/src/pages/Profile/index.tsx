import { useProfile } from "@/hooks/useProfile";
import { ProfileDesktop } from "@/components/templates/ProfileDesktop";

export default function Profile() {
  const data = useProfile();

  // Mobile version not yet designed — falls back to desktop layout
  return <ProfileDesktop {...data} />;
}
