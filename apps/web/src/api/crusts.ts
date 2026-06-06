import { api } from "./client";
import type { Crust } from "@/types/domain";

export const getCrusts = () => api.get<Crust[]>("/crusts").then((r) => r.data);
