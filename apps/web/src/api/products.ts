import { api } from "./client";
import type { ProductDTO } from "@cintiago/shared";

export const getProducts = () =>
  api.get<ProductDTO[]>("/products").then((r) => r.data);
