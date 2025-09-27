import { useMemo, useEffect, useRef, useState } from 'react'
import Modal from '../Modal/Modal'

type ItemType = {
  id: number,
  isBig: boolean
}


type GalleryItemProps = {
  item: ItemType
  onClick: (item: ItemType) => void
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


  const [selectedItem, setSelectedItem] = useState<ItemType | null>(null);
  const handleGalleryItemClick = (item: ItemType) => {
    setSelectedItem(item);
  }
  const closeModal = () => {
    setSelectedItem(null);
  }

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    if (selectedItem) {
      window.addEventListener('keydown', handleEsc)
      return () => window.removeEventListener('keydown', handleEsc)
    }
  }, [selectedItem]);

  return (
    <>
      <div className='gallery'>
        {items.map((item) => (
          <GalleryItem key={item.id} item={item} onClick={() => handleGalleryItemClick(item)} />
        ))}
      </div>
      {
        selectedItem && (
          <Modal item={selectedItem} onClose={closeModal} />
        )
      }
    </>
  )
}

function GalleryItem({ item, onClick }: GalleryItemProps) {
  const isBig = item.isBig || false
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const canvasWrapper = canvas.parentElement;
      if (!canvasWrapper) return;

      // Максимальная высота канваса = 90% от высоты окна
      const maxHeight = window.innerHeight * 0.9;
      const maxWidth = canvasWrapper.clientWidth;

      // Канвас — квадрат, но не больше, чем позволяет wrapper и экран
      const size = Math.min(maxHeight, maxWidth, 800); // 800 — максимум, чтобы не было гигантским

      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const hue = (item.id * 137) % 360;
        ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
        ctx.fillRect(0, 0, size, size);

        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.max(24, size / 10)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(item.id), size / 2, size / 2);
      }
    };

    // Запускаем с небольшой задержкой
    const timer = setTimeout(resizeCanvas, 50);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [item.id, isBig]);

  return (
    <div className={`gallery__item ${isBig ? 'big' : ''}`} onClick={() => onClick(item)}>
      <div className="gallery__content">
        <canvas ref={canvasRef} />
        <h2 className='title'>Card Title</h2>
        <h3 className='description'>Card Description</h3>
      </div>
    </div>
  )
}

export default Gallery