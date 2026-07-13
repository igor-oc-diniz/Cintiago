import { api } from "./client";
import type {
  StoreDTO,
  StoreInfoDTO,
  UpdateStorePayloadDTO,
} from "@cintiago/shared";

// Public storefront data — enough for the header (name + isOpen status).
// The full operator record (GET /store) belongs to the settings screen later.
export const getStoreInfo = () =>
  api.get<StoreInfoDTO>("/store/info").then((r) => r.data);

export const updateStore = (payload: UpdateStorePayloadDTO) =>
  api.patch<StoreDTO>("/store", payload).then((r) => r.data);
