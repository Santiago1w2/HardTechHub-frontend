import type {
  CreateProductRequest,
  ProductDetail,
  UpdateProductRequest,
} from '../types/type'

export interface ProductFormValues {
  category_id: string
  brand_id: string
  sku: string
  name: string
  description: string
  price: string
  specs: string
  image_url: string
  is_active: boolean
}

export function productFormValues(product?: ProductDetail): ProductFormValues {
  return {
    category_id: '',
    brand_id: '',
    sku: product?.sku ?? '',
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? '',
    specs: JSON.stringify(product?.specs ?? {}, null, 2),
    image_url: product?.image_url ?? '',
    is_active: product?.is_active ?? true,
  }
}

function editableFields(values: ProductFormValues) {
  let specs: unknown
  try {
    specs = JSON.parse(values.specs)
  } catch {
    throw new Error('Las especificaciones deben ser un objeto JSON válido.')
  }
  if (typeof specs !== 'object' || specs === null || Array.isArray(specs)) {
    throw new Error(
      'Las especificaciones deben ser un objeto de propiedades y valores.',
    )
  }
  const price = Number(values.price)
  if (!values.name.trim() || Array.from(values.name.trim()).length > 180) {
    throw new Error('El nombre es obligatorio y admite hasta 180 caracteres.')
  }
  if (
    !values.price.trim() ||
    !Number.isFinite(price) ||
    price < 0 ||
    price > 99999999.99 ||
    Math.abs(price * 100 - Math.round(price * 100)) > 0.000001
  ) {
    throw new Error(
      'Ingresa un precio válido, con hasta 8 enteros y 2 decimales.',
    )
  }
  return {
    name: values.name.trim(),
    description: values.description,
    price,
    specs: specs as Record<string, unknown>,
    image_url: values.image_url.trim(),
    is_active: values.is_active,
  }
}

export function buildCreateProduct(
  values: ProductFormValues,
): CreateProductRequest {
  const fields = editableFields(values)
  const categoryId = Number(values.category_id)
  const brandId = Number(values.brand_id)
  if (
    ![categoryId, brandId].every((id) => Number.isSafeInteger(id) && id > 0)
  ) {
    throw new Error('Ingresa los identificadores reales de categoría y marca.')
  }
  if (!values.sku.trim() || Array.from(values.sku.trim()).length > 80) {
    throw new Error('El SKU es obligatorio y admite hasta 80 caracteres.')
  }
  return {
    category_id: categoryId,
    brand_id: brandId,
    sku: values.sku.trim(),
    name: fields.name,
    price: fields.price,
    specs: fields.specs,
    ...(fields.description ? { description: fields.description } : {}),
    ...(fields.image_url ? { image_url: fields.image_url } : {}),
  }
}

export function buildProductUpdate(
  values: ProductFormValues,
  product: ProductDetail,
): UpdateProductRequest {
  const fields = editableFields(values)
  const changes: UpdateProductRequest = {}
  if (fields.name !== product.name) changes.name = fields.name
  if (fields.description !== (product.description ?? ''))
    changes.description = fields.description
  if (fields.price !== Number(product.price)) changes.price = fields.price
  if (JSON.stringify(fields.specs) !== JSON.stringify(product.specs))
    changes.specs = fields.specs
  if (fields.image_url !== (product.image_url ?? ''))
    changes.image_url = fields.image_url
  if (fields.is_active !== product.is_active)
    changes.is_active = fields.is_active
  return changes
}
