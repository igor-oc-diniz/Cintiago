import { api } from "./client";
import type { CrustDTO } from "@cintiago/shared";
import type { Crust } from "@/types/domain";

// TODO: verify with backend — backend returns size-specific crust prices
// (priceSmall/priceMedium/priceLarge). Using priceMedium as the representative
// additionalPrice until the domain type is updated to support size-based pricing.
function adaptCrust(c: CrustDTO): Crust {
  return {
    id: c.id,
    name: c.name,
    additionalPrice: Number(c.priceMedium ?? 0),
  };
}

export const getCrusts = () =>
  api.get<CrustDTO[]>("/crusts").then((r) => r.data.map(adaptCrust));
