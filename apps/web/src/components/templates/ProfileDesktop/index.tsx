import { useNavigate } from "react-router-dom";
import { WebNav } from "@/components/molecules/WebNav";
import { ProfileShortcut } from "@/components/molecules/ProfileShortcut";
import { ProfileForm } from "@/components/organisms/ProfileForm";
import { Avatar } from "@/components/atoms/Avatar";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import {
  ReceiptIcon,
  MessageCircleIcon,
  LogOutIcon,
  LockIcon,
  LeafIcon,
} from "@/components/atoms/Icons";
import { ROUTES } from "@/constants/routes";
import type { ProfileDesktopProps } from "./types";

function LogoutModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="cg-scrim"
      onClick={onCancel}
      style={{ display: "grid", placeItems: "center" }}
    >
      <div
        className="cg-card cg-grain"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 420,
          width: "100%",
          padding: 28,
          position: "relative",
        }}
      >
        <LeafIcon
          size={16}
          color="var(--basil-300, #A8C5A0)"
          style={{ position: "absolute", top: 18, right: 18, opacity: 0.75 }}
        />
        <div
          style={{
            fontFamily: "var(--font-display, serif)",
            fontWeight: 600,
            fontSize: 24,
            color: "var(--fg1, #1A1410)",
            marginBottom: 8,
            paddingRight: 28,
          }}
        >
          Tem certeza que deseja sair?
        </div>
        <p
          style={{
            fontFamily: "var(--font-body, sans-serif)",
            fontSize: 14,
            color: "var(--fg3, #7A6A5A)",
            margin: "0 0 20px",
            lineHeight: 1.5,
          }}
        >
          Você pode entrar novamente quando quiser com sua conta Google.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="secondary" fullWidth onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" fullWidth onClick={onConfirm}>
            <LogOutIcon size={16} />
            Sair
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ProfileDesktop({
  user,
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
}: ProfileDesktopProps) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg, #F5EFE6)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg, #F5EFE6)" }}>
      <WebNav
        active="profile"
        userName={user?.name ?? ""}
        userEmail={user?.email ?? ""}
        userInitials={(user?.name ?? "U").slice(0, 2).toUpperCase()}
        onHome={() => navigate(ROUTES.home)}
        onOrders={handleGoOrders}
        onProfile={() => {}}
      />

      <div
        style={{ maxWidth: 1120, margin: "0 auto", padding: "40px 36px 80px" }}
      >
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              fontFamily: "var(--font-body, sans-serif)",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--fg4, #B0A090)",
            }}
          >
            Sua conta
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display, serif)",
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "-0.01em",
              color: "var(--fg1, #1A1410)",
              margin: "4px 0 0",
            }}
          >
            Meu perfil
          </h1>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 28,
            alignItems: "start",
          }}
        >
          {/* LEFT */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Account info (read-only) */}
            <div className="cg-card cg-grain" style={{ padding: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                <Avatar name={user?.name ?? "U"} size="lg" />
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-display, serif)",
                      fontWeight: 700,
                      fontSize: 23,
                      color: "var(--fg1, #1A1410)",
                      lineHeight: 1.15,
                    }}
                  >
                    {user?.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body, sans-serif)",
                      fontSize: 14,
                      color: "var(--fg3, #7A6A5A)",
                      marginTop: 3,
                    }}
                  >
                    {user?.email}
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "var(--surface-inset, #F0EAE0)",
                    fontFamily: "var(--font-body, sans-serif)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--fg3, #7A6A5A)",
                    flexShrink: 0,
                  }}
                >
                  <LockIcon size={13} color="var(--fg4, #B0A090)" />
                  Conta Google
                </div>
              </div>
            </div>

            {/* Editable form */}
            <ProfileForm
              form={form}
              dirty={dirty}
              cepLoading={cepLoading}
              isSaving={isSaving}
              onFieldChange={setField}
              onZipChange={handleZipChange}
              onSave={handleSave}
            />
          </div>

          {/* RIGHT — shortcuts + logout */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              position: "sticky",
              top: 100,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-body, sans-serif)",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg4, #B0A090)",
                marginBottom: 2,
              }}
            >
              Atalhos
            </div>

            <ProfileShortcut
              icon={
                <ReceiptIcon size={19} color="var(--accent-warm, #C0522A)" />
              }
              label="Meus pedidos"
              onClick={handleGoOrders}
            />
            <ProfileShortcut
              icon={
                <MessageCircleIcon
                  size={19}
                  color="var(--accent-warm, #C0522A)"
                />
              }
              label="Fale conosco"
              onClick={handleContact}
            />

            <button
              onClick={() => setShowLogoutModal(true)}
              style={{
                marginTop: 8,
                width: "100%",
                height: 52,
                borderRadius: "var(--radius-lg, 12px)",
                cursor: "pointer",
                border: "1px solid var(--border, #E8E0D0)",
                background: "var(--surface, #FFFFFF)",
                fontFamily: "var(--font-body, sans-serif)",
                fontWeight: 600,
                fontSize: 15,
                color: "var(--primary, #C0522A)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <LogOutIcon size={18} color="var(--primary, #C0522A)" />
              Sair
            </button>
          </div>
        </div>
      </div>

      {showLogoutModal && (
        <LogoutModal
          onCancel={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}
