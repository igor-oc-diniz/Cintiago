import { api } from './client'
import type { Payment } from '@/types/domain'

export const getPayments = () =>
  api.get<Payment[]>('/payments').then((r) => r.data)
