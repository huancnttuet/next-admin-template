'use client';

import { AutoFormFieldProps } from '@autoform/react';
import {
  type ColumnDef,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useFormContext } from 'react-hook-form';
import {
  InfiniteComboboxField,
  type InfiniteComboboxQueryParams,
} from '@/components/autoform/components/InfiniteComboboxField';
import { DataTable } from '@/components/data-table/data-table';
import { Button } from '@/components/ui/button';
import { getPagedProducts } from '@/features/products/products.api';
import type { Product } from '@/features/products/products.type';

interface OrderItemFormValue {
  productId?: string;
  productName?: string;
  quantity?: number;
  price?: number;
  image?: string;
  typeName?: string;
  _id?: string;
}

interface OrderItemsCustomData {
  addButtonText?: string;
}

interface ProductOption {
  id: string;
  name: string;
  price: number;
  image: string;
  subProducts: ProductSubOption[];
}

interface ProductSubOption {
  name: string;
  price: number;
  image: string;
}

function createEmptyOrderItem(): OrderItemFormValue {
  return {
    productId: '',
    productName: '',
    quantity: 1,
    price: 0,
    image: '',
    typeName: '',
    _id: '',
  };
}

export const OrderItemsField: React.FC<AutoFormFieldProps> = ({
  field,
  error,
  id,
  inputProps,
}) => {
  const t = useTranslations('orders');
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const isDisabled = Boolean(inputProps?.disabled);

  // We cache product details when selected from the combobox so we can look up their sub-products later
  const [productCache, setProductCache] = React.useState<
    Record<string, ProductOption>
  >({});

  const customData =
    (field.fieldConfig?.customData as OrderItemsCustomData) ?? {};

  const watchedValue = watch(id) as OrderItemFormValue[] | undefined;
  const current = React.useMemo(
    () => (Array.isArray(watchedValue) ? watchedValue : []),
    [watchedValue],
  );

  const totalPrice = React.useMemo(() => {
    return current.reduce((sum, item) => {
      const q = typeof item.quantity === 'number' ? item.quantity : 1;
      const p = typeof item.price === 'number' ? item.price : 0;
      return sum + q * p;
    }, 0);
  }, [current]);

  const hasProductLoadError = false;

  const getFieldError = (
    index: number,
    key: keyof OrderItemFormValue,
  ): string | undefined => {
    const fieldErrors = (errors as Record<string, unknown>)[id] as
      | Array<Record<string, { message?: string }>>
      | undefined;
    return fieldErrors?.[index]?.[key]?.message;
  };

  const addOrderItem = () => {
    setValue(id, [...current, createEmptyOrderItem()], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const removeOrderItem = (index: number) => {
    setValue(
      id,
      current.filter((_, itemIndex) => itemIndex !== index),
      {
        shouldValidate: true,
        shouldDirty: true,
      },
    );
  };

  const updateOrderItem = (
    index: number,
    patch: Partial<OrderItemFormValue>,
  ) => {
    const next = current.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            ...patch,
          }
        : item,
    );

    setValue(id, next, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const updateField = (
    index: number,
    key: keyof OrderItemFormValue,
    nextValue: string,
  ) => {
    if (key === 'price' || key === 'quantity') {
      const parsed = Number(nextValue);
      updateOrderItem(index, {
        [key]: Number.isFinite(parsed) ? parsed : 0,
      });
      return;
    }

    updateOrderItem(index, {
      [key]: nextValue,
    });
  };

  const handleSelectProduct = (
    index: number,
    productOption: ProductOption | null,
  ) => {
    if (!productOption) {
      updateOrderItem(index, {
        productId: '',
        productName: '',
        typeName: '',
        image: '',
        price: 0,
      });
      return;
    }

    const defaultSubProduct = productOption.subProducts[0];
    const hasSubProducts = productOption.subProducts.length > 0;

    updateOrderItem(index, {
      productId: productOption.id,
      productName: productOption.name,
      typeName: hasSubProducts
        ? (defaultSubProduct?.name ?? productOption.name)
        : productOption.name,
      image: hasSubProducts
        ? (defaultSubProduct?.image ?? productOption.image)
        : productOption.image,
      price: hasSubProducts
        ? (defaultSubProduct?.price ?? productOption.price)
        : productOption.price,
    });
  };

  const handleSelectSubProduct = (index: number, subProductName: string) => {
    const item = current[index];
    if (!item?.productId) return;

    const selectedProduct = productCache[item.productId];

    if (!selectedProduct) return;

    const selectedSubProduct = selectedProduct.subProducts.find(
      (subProduct) => subProduct.name === subProductName,
    );

    if (!selectedSubProduct) return;

    updateOrderItem(index, {
      typeName: selectedSubProduct.name,
      price: selectedSubProduct.price,
      image: selectedSubProduct.image,
    });
  };

  const buildProductComboboxCustomData = (index: number) => ({
    queryKey: ['order-items-products'],
    selectionMode: 'single' as const,
    disabled: isDisabled,
    queryFn: (params: InfiniteComboboxQueryParams) =>
      getPagedProducts({
        Page: params.Page,
        PageSize: params.PageSize,
        Keyword: params.Keyword,
        IsActive: true,
      }),
    dataMapper: (product: Product) => ({
      value: String(product.id ?? ''),
      label: String(product.name ?? ''),
    }),
    placeholder: t('orderItemsProductSelectPlaceholder'),
    searchPlaceholder: t('orderItemsProductSelectPlaceholder'),
    loadingText: t('orderItemsProductsLoading'),
    emptyText: hasProductLoadError
      ? t('orderItemsProductsLoadError')
      : t('orderItemsImageEmpty'),
    onItemSelect: (product: Product | Product[] | null) => {
      if (!product || Array.isArray(product)) {
        handleSelectProduct(index, null);
        return;
      }

      const pOption: ProductOption = {
        id: String(product.id ?? ''),
        name: String(product.name ?? ''),
        price: Number(product.price ?? 0),
        image: String(product.image ?? ''),
        subProducts: Array.isArray(product.subProducts)
          ? product.subProducts.map((subProduct) => ({
              name: String(subProduct?.name ?? ''),
              price: Number(subProduct?.price ?? 0),
              image: String(subProduct?.image ?? ''),
            }))
          : [],
      };

      setProductCache((prev) => ({
        ...prev,
        [pOption.id]: pOption,
      }));

      handleSelectProduct(index, pOption);
    },
  });

  const columns: ColumnDef<OrderItemFormValue>[] = [
    {
      id: 'product',
      header: () => t('orderItemsTableColProduct'),
      cell: ({ row }) => {
        const index = row.index;

        return (
          <div className='space-y-1'>
            <InfiniteComboboxField
              id={`${id}.${index}.productId`}
              label=''
              path={[id, String(index), 'productId']}
              value={row.original.productId ?? ''}
              inputProps={{ disabled: isDisabled }}
              error={getFieldError(index, 'productName')}
              field={
                {
                  fieldConfig: {
                    fieldType: 'infinite-combobox',
                    customData: buildProductComboboxCustomData(index),
                  },
                } as never
              }
            />
            {getFieldError(index, 'productName') && (
              <p className='text-xs text-destructive'>
                {getFieldError(index, 'productName')}
              </p>
            )}
          </div>
        );
      },
      size: 230,
    },
    {
      id: 'subProduct',
      header: () => t('orderItemsTableColSubProduct'),
      cell: ({ row }) => {
        const index = row.index;
        const item = row.original;

        let selectedProduct = item.productId
          ? productCache[item.productId]
          : undefined;
        const subProducts = selectedProduct?.subProducts ?? [];
        const hasSubProducts = subProducts.length > 0;

        return (
          <select
            className='h-9 w-full rounded-md border bg-background px-2 text-sm'
            value={item.typeName ?? ''}
            onChange={(event) =>
              handleSelectSubProduct(index, event.target.value)
            }
            disabled={isDisabled || !hasSubProducts}
            aria-label={t('orderItemsTableColSubProduct')}
          >
            {!hasSubProducts && !item.typeName && (
              <option value=''>{t('orderItemsSubProductNotAvailable')}</option>
            )}
            {!hasSubProducts && item.typeName && (
              <option value={item.typeName}>{item.typeName}</option>
            )}
            {hasSubProducts && (
              <option value=''>
                {t('orderItemsSubProductSelectPlaceholder')}
              </option>
            )}
            {subProducts.map((subProduct: ProductSubOption) => (
              <option
                key={`${item.productId}-${subProduct.name}`}
                value={subProduct.name}
              >
                {subProduct.name}
              </option>
            ))}
          </select>
        );
      },
      size: 220,
    },
    {
      id: 'name',
      header: () => t('orderItemsTableColName'),
      cell: ({ row }) => (
        <span className='line-clamp-2 text-sm'>
          {row.original.productName || '—'}
        </span>
      ),
      size: 220,
    },
    {
      id: 'preview',
      header: () => t('orderItemsTableColPreview'),
      cell: ({ row }) => {
        const image = row.original.image;
        return typeof image === 'string' && image.trim().length > 0 ? (
          <Image
            src={image}
            alt={t('orderItemsImagePreviewAlt')}
            width={112}
            height={72}
            className='h-16 w-28 rounded border object-contain'
          />
        ) : (
          <span className='text-xs text-muted-foreground'>
            {t('orderItemsImageEmpty')}
          </span>
        );
      },
      size: 130,
    },
    {
      id: 'quantity',
      header: () => t('orderItemsTableColQuantity'),
      cell: ({ row }) => {
        const index = row.index;
        const item = row.original;

        return (
          <div className='space-y-1'>
            <input
              className='h-9 w-full rounded-md border bg-background px-2
                text-sm'
              type='number'
              min={1}
              step={1}
              value={
                typeof item.quantity === 'number' &&
                Number.isFinite(item.quantity)
                  ? item.quantity
                  : 1
              }
              onChange={(event) =>
                updateField(index, 'quantity', event.target.value)
              }
              placeholder={t('orderItemsFieldQuantityPlaceholder')}
              disabled={isDisabled}
              aria-label={t('orderItemsTableColQuantity')}
            />
            {getFieldError(index, 'quantity') && (
              <p className='text-xs text-destructive'>
                {getFieldError(index, 'quantity')}
              </p>
            )}
          </div>
        );
      },
      size: 120,
    },
    {
      id: 'price',
      header: () => t('orderItemsTableColPrice'),
      cell: ({ row }) => {
        const price = Number(row.original.price ?? 0);
        return <span>{price.toLocaleString('vi-VN')}</span>;
      },
      size: 120,
    },
    {
      id: 'actions',
      header: () => t('orderItemsTableColActions'),
      cell: ({ row }) => (
        <Button
          type='button'
          variant='ghost'
          size='icon'
          onClick={() => removeOrderItem(row.index)}
          disabled={isDisabled}
        >
          <Trash2 className='h-4 w-4' />
        </Button>
      ),
      size: 70,
    },
  ];

  const table = useReactTable({
    data: current,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (_row, index) => String(index),
  });

  return (
    <div className='space-y-3'>
      {error && (
        <p className='text-xs text-destructive'>
          {typeof error === 'string' ? error : String(error)}
        </p>
      )}

      {current.length === 0 ? (
        <div
          className='rounded-md border border-dashed p-3 text-sm
            text-muted-foreground'
        >
          {t('orderItemsEmpty')}
        </div>
      ) : (
        <div className='border'>
          <DataTable
            table={table}
            hidePagination
            className='border-0 border-b'
            tableContainerClassName='max-h-none min-w-[980px] rounded-none border-0'
          />
          <div
            className='flex items-center justify-end px-4 py-3 text-sm
              font-medium'
          >
            <span className='mr-8'>Tổng cộng:</span>
            <span className='text-primary'>
              {totalPrice.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>
      )}

      <Button
        type='button'
        variant='outline'
        onClick={addOrderItem}
        disabled={isDisabled}
        className='w-fit'
      >
        <Plus className='mr-2 h-4 w-4' />
        {customData.addButtonText ?? t('orderItemsAddButton')}
      </Button>
    </div>
  );
};
