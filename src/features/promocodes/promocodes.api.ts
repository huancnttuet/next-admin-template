import axios from 'axios'
import type { PagedList } from '@/types/api'
import type {
  CreatePromocodePayload,
  GetPromocodesParams,
  Promocode,
  UpdatePromocodePayload,
} from './promocodes.type'

export const getPagedPromocodes = async (
  params: GetPromocodesParams,
): Promise<PagedList<Promocode>> => {
  const res = await axios.get<PagedList<Promocode>>('/api/promocodes/paged-list', {
    params,
  })
  return res.data
}

export const getPromocodeById = async (id: string): Promise<Promocode> => {
  const res = await axios.get<Promocode>(`/api/promocodes/${id}`)
  return res.data
}

export const createPromocode = async (
  payload: CreatePromocodePayload,
): Promise<Promocode> => {
  const res = await axios.post<Promocode>('/api/promocodes', payload)
  return res.data
}

export const updatePromocode = async ({
  id,
  payload,
}: {
  id: string
  payload: UpdatePromocodePayload
}): Promise<Promocode> => {
  const res = await axios.put<Promocode>(`/api/promocodes/${id}`, payload)
  return res.data
}

export const deletePromocode = async (id: string): Promise<void> => {
  await axios.delete(`/api/promocodes/${id}`)
}

export const bulkDeletePromocodes = async (ids: string[]): Promise<void> => {
  await axios.post('/api/promocodes/bulk-delete', { ids })
}
