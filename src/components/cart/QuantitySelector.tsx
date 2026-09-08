import { Minus, Plus } from 'lucide-react'
export function QuantitySelector({
  value,
  onChange,
  label = 'Cantidad',
  disabled = false,
}: {
  value: number
  onChange: (value: number) => void
  label?: string
  disabled?: boolean
}) {
  return (
    <div className="quantity-selector" role="group" aria-label={label}>
      <button
        aria-label={`Reducir ${label}`}
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <output aria-live="polite">{value}</output>
      <button
        aria-label={`Aumentar ${label}`}
        disabled={disabled || value >= 999}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  )
}
