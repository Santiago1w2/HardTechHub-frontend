import { Cpu, Package, Headphones } from 'lucide-react'
export function AnnouncementBar() {
  return (
    <div className="announcement">
      <div className="container announcement-inner">
        <span>
          <Cpu size={13} /> Hardware para tu siguiente nivel
        </span>
        <div>
          <span>
            <Package size={13} /> Tus pedidos, en un solo lugar
          </span>
          <span>
            <Headphones size={13} /> Hecho para entusiastas
          </span>
        </div>
      </div>
    </div>
  )
}
