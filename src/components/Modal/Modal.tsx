import { useRef, useEffect } from "react";
import './Modal.css'
function Modal({ item, onClose }: { item: { id: number; isBig?: boolean }; onClose: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resizeCanvas = () => {
            // Ищем ближайший .modal-body — это flex-контейнер с двумя колонками
            const modalBody = canvas.closest('.modal-body') as HTMLElement;
            if (!modalBody) return;

            const size = modalBody.clientHeight; // ← высота рабочей области

            canvas.width = size;
            canvas.height = size;

            const ctx = canvas.getContext('2d');
            if (ctx) {
                const hue = (item.id * 137) % 360;
                ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                ctx.fillRect(0, 0, size, size);

                ctx.fillStyle = 'white';
                ctx.font = 'bold 32px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(String(item.id), size / 2, size / 2);
            }
        };

        const timer = setTimeout(resizeCanvas, 50); // чуть дольше, чтобы точно отрендерилось
        window.addEventListener('resize', resizeCanvas);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [item.id]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) onClose()
    }

    return (
        <div className="modal-backdrop" onClick={handleBackdropClick}>
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>×</button>
                <div className="modal-body">
                    <div className="modal-canvas-wrapper">
                        <canvas ref={canvasRef} />
                    </div>
                    <div className="modal-info">
                        <h2>Карточка #{item.id}</h2>
                        <p>Здесь может быть подробное описание изображения, метаданные, теги и т.д.</p>
                        <div className="modal-controls">
                            <button>Скачать</button>
                            <button>Поделиться</button>
                            <button>Удалить</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default Modal;