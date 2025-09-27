import { useMemo, useEffect, useRef } from 'react'
import './App.css'

function App() {
  return (
    <div className='container'>
      <Gallery />
    </div>
  )
}

type ItemType = {
  id: number,
  isBig: boolean
}

type GalleryItemProps = {
  item: ItemType
}

function Gallery() {
  // Общее количество элементов
  const totalItems = 50

  // Генерируем элементы с меткой isBig
  const items = useMemo(() => {
    const arr: ItemType[] = Array.from({ length: totalItems }, (_, i) => ({ id: i, isBig: false }))

    // Копируем индексы, которые могут быть "большими"
    // Запрещаем большие карточки в последних 4 позициях (2 колонки × 2 строки)
    const maxIndexForBig = totalItems - 5 // чтобы осталось минимум 4 элемента после

    const bigCandidates: number[] = []
    for (let i = 0; i <= maxIndexForBig; i++) {
      // Пример: ~15% шанс стать большой, но не чаще чем каждые 6 элементов
      if (Math.random() < 0.15) {
        bigCandidates.push(i)
        // Пропускаем следующие 5, чтобы не было пересечений
        i += 5
      }
    }

    // Помечаем выбранные как большие
    for (const idx of bigCandidates) {
      arr[idx] = { ...arr[idx], isBig: true }
    }

    return arr
  }, [totalItems])

  return (
    <div className='gallery'>
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
    </div>
  )
}

function GalleryItem({ item }: GalleryItemProps) {
  const isBig = item.isBig || false
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    // Получаем размеры родителя (gallery__content)
    const size = parent.clientWidth

    // Устанавливаем физические размеры канваса (в пикселях)
    canvas.width = size
    canvas.height = size

    // Опционально: нарисовать что-нибудь (например, цветной квадрат)
    const ctx = canvas.getContext('2d')
    if (ctx) {
      // Пример: залить случайным цветом
      const hue = (item.id * 137) % 360 // детерминированный "рандом"
      ctx.fillStyle = `hsl(${hue}, 70%, 60%)`
      ctx.fillRect(0, 0, size, size)

      // Добавить номер (опционально)
      ctx.fillStyle = 'white'
      ctx.font = 'bold 24px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(String(item.id), size / 2, size / 2)
    }
  }, [item.id, isBig]) // зависимость от isBig на случай, если размеры меняются

  return (
    <div className={`gallery__item ${isBig ? 'big' : ''}`}>
      <div className="gallery__content">
        <canvas ref={canvasRef} />
        <h2 className='title'>Card Title</h2>
        <h3 className='description'>Card Description</h3>
      </div>
    </div>
  )
}

export default App