import { api } from "./client";
import type { StoreInfoDTO } from "@cintiago/shared";

// Dados públicos do estabelecimento (GET /store/info)
export const getStoreInfo = () =>
  api.get<StoreInfoDTO>("/store/info").then((r) => r.data);
