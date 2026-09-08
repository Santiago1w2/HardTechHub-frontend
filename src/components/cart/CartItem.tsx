import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { CartItem as CartItemType } from '../../types/type'
import { useCart } from '../../hooks'
import { formatPrice } from '../../utils/formatPrice'
import { ProductImage } from '../product/ProductImage'
import { QuantitySelector } from './QuantitySelector'
export function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeItem } = useCart()
  return (
    <article className="cart-item">
      <Link to={`/productos/${item.product.id}`}>
        <ProductImage
          src={item.product.image_url}
          name={item.product.name}
          category={item.product.category}
        />
      </Link>
      <div className="cart-item-info">
        <span className="eyebrow">{item.product.brand}</span>
        <h3>
          <Link to={`/productos/${item.product.id}`}>{item.product.name}</Link>
        </h3>
        <span className="muted">
          {formatPrice(item.product.price)} / unidad
        </span>
      </div>
      <QuantitySelector
        label={`cantidad de ${item.product.name}`}
        value={item.quantity}
        onChange={(quantity) => updateQuantity(item.product.id, quantity)}
      />
      <strong className="cart-line-total">
        {formatPrice(
          (Math.round(Number(item.product.price) * 100) * item.quantity) / 100,
        )}
      </strong>
      <button
        className="icon-button remove-item"
        aria-label={`Eliminar ${item.product.name}`}
        onClick={() => removeItem(item.product.id)}
      >
        <Trash2 size={18} />
      </button>
    </article>
  )
}
