import { api } from "./client";
import type { CrustDTO } from "@cintiago/shared";
import type { Crust } from "@/types/domain";

function adaptCrust(c: CrustDTO): Crust {
  return {
    id: c.id,
    name: c.name,
    prices: [
      { size: "small", price: Number(c.priceSmall ?? 0) },
      { size: "medium", price: Number(c.priceMedium ?? 0) },
      { size: "large", price: Number(c.priceLarge ?? 0) },
    ],
  };
}

export const getCrusts = () =>
  api.get<CrustDTO[]>("/crusts").then((r) => r.data.map(adaptCrust));
