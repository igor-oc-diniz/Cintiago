import { useBreakpoint } from "@/hooks/useBreakpoint";
import { useProfile } from "@/hooks/useProfile";
import { ProfileDesktop } from "@/components/templates/ProfileDesktop";

export default function Profile() {
  const data = useProfile();
  const { isMobile } = useBreakpoint();

  // Mobile version not yet designed — falls back to desktop layout
  return <ProfileDesktop {...data} />;
}
