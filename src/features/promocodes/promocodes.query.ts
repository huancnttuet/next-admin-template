import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  bulkDeletePromocodes,
  createPromocode,
  deletePromocode,
  getPagedPromocodes,
  getPromocodeById,
  updatePromocode,
} from './promocodes.api'
import type { GetPromocodesParams } from './promocodes.type'

export const PROMOCODE_QUERY_KEY = 'promocodes'

export const usePagedPromocodes = (params: GetPromocodesParams) =>
  useQuery({
    queryKey: [PROMOCODE_QUERY_KEY, params],
    queryFn: () => getPagedPromocodes(params),
  })

export const usePromocodeById = (id: string) =>
  useQuery({
    queryKey: [PROMOCODE_QUERY_KEY, id],
    queryFn: () => getPromocodeById(id),
    enabled: Boolean(id),
  })

export const useCreatePromocode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOCODE_QUERY_KEY] })
    },
  })
}

export const useUpdatePromocode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePromocode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOCODE_QUERY_KEY] })
    },
  })
}

export const useDeletePromocode = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deletePromocode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOCODE_QUERY_KEY] })
    },
  })
}

export const useBulkDeletePromocodes = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (ids: string[]) => bulkDeletePromocodes(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROMOCODE_QUERY_KEY] })
    },
  })
}
