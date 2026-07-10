import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen items-center justify-center bg-background text-on-background">
      <p className="text-body-lg">
        Pedidos (em construção){user ? ` — logado como ${user.name}` : ""}
      </p>
    </div>
  );
}
