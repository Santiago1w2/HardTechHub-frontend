import { Cpu, CircuitBoard, MemoryStick, HardDrive, Monitor, Laptop, Keyboard, PcCase, Zap, Microchip } from 'lucide-react'
export const categories = [
  { value: 'PC Gaming', label: 'PC Gaming', icon: PcCase, asset: 'category-pc' },
  { value: 'CPU', label: 'Procesadores', icon: Cpu, asset: 'category-cpu' },
  { value: 'GPU', label: 'Tarjetas gráficas', icon: Microchip, asset: 'category-gpu' },
  { value: 'Motherboard', label: 'Placas madre', icon: CircuitBoard, asset: 'category-motherboard' },
  { value: 'RAM', label: 'Memorias RAM', icon: MemoryStick, asset: 'category-ram' },
  { value: 'Storage', label: 'Almacenamiento', icon: HardDrive, asset: 'category-storage' },
  { value: 'Laptop', label: 'Laptops', icon: Laptop, asset: 'category-laptop' },
  { value: 'Monitor', label: 'Monitores', icon: Monitor, asset: 'category-monitor' },
  { value: 'Peripherals', label: 'Periféricos', icon: Keyboard, asset: 'category-peripherals' },
  { value: 'PSU', label: 'Fuentes de poder', icon: Zap, asset: 'category-psu' },
]
export function categoryHref(value: string) { return `/productos?category=${encodeURIComponent(value)}` }
export function categoryInfo(value: string) {
  return categories.find(item => item.value.toLowerCase() === value.toLowerCase() || item.label.toLowerCase() === value.toLowerCase())
}
