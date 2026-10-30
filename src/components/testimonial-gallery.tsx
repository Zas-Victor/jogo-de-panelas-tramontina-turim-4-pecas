'use client';

import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';
import type { KeyboardEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { TestimonialPhoto } from '@/lib/testimonials';

type TestimonialGalleryProps = {
  photos: TestimonialPhoto[];
  reviewNumber: string;
};

export function TestimonialGallery({
  photos,
  reviewNumber,
}: TestimonialGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogTitleId = `testimonial-lightbox-title-${reviewNumber}`;
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;

    if (activeIndex !== null && !dialog.open) {
      dialog.showModal();
      closeButtonRef.current?.focus();
    } else if (activeIndex === null && dialog.open) {
      dialog.close();
    }
  }, [activeIndex]);

  function openPhoto(index: number, trigger: HTMLButtonElement) {
    lastTriggerRef.current = trigger;
    setActiveIndex(index);
  }

  function closePhoto() {
    if (dialogRef.current?.open) {
      dialogRef.current.close();
    }
    setActiveIndex(null);
  }

  function restoreFocus() {
    setActiveIndex(null);
    window.requestAnimationFrame(() => {
      lastTriggerRef.current?.focus();
    });
  }

  function movePhoto(direction: -1 | 1) {
    setActiveIndex((current) => {
      if (current === null) return current;
      return (current + direction + photos.length) % photos.length;
    });
  }

  function handleDialogKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'Tab') {
      const buttons = Array.from(
        event.currentTarget.querySelectorAll<HTMLButtonElement>(
          'button:not([disabled])',
        ),
      );
      const firstButton = buttons[0];
      const lastButton = buttons.at(-1);

      if (event.shiftKey && document.activeElement === firstButton) {
        event.preventDefault();
        lastButton?.focus();
      } else if (!event.shiftKey && document.activeElement === lastButton) {
        event.preventDefault();
        firstButton?.focus();
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      movePhoto(-1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      movePhoto(1);
    }
  }

  return (
    <>
      <div
        className={`testimonial-gallery testimonial-gallery--${photos.length}`}
        data-photo-count={photos.length}
        data-testid={`testimonial-gallery-${reviewNumber}`}
      >
        {photos.map((photo, index) => (
          <button
            aria-label={`Ampliar foto ${index + 1} de ${photos.length} da avaliação ${reviewNumber}: ${photo.alt}`}
            className="testimonial-gallery-button"
            data-photo-id={photo.id}
            key={photo.id}
            onClick={(event) => openPhoto(index, event.currentTarget)}
            type="button"
          >
            <span className="testimonial-gallery-image-frame">
              <Image
                alt={photo.alt}
                fill
                loading="lazy"
                sizes="(max-width: 639px) 27vw, (max-width: 1023px) 18vw, 11vw"
                src={photo.src}
              />
            </span>
            {photo.isVideoThumbnail ? (
              <span className="testimonial-video-label">
                Miniatura estática
              </span>
            ) : null}
            <span aria-hidden="true" className="testimonial-gallery-index">
              {index + 1}/{photos.length}
            </span>
          </button>
        ))}
      </div>

      <dialog
        aria-labelledby={dialogTitleId}
        className="testimonial-lightbox"
        onClick={(event) => {
          if (event.target === event.currentTarget) closePhoto();
        }}
        onClose={restoreFocus}
        onKeyDown={handleDialogKeyDown}
        ref={dialogRef}
      >
        {activePhoto && activeIndex !== null ? (
          <>
            <div className="testimonial-lightbox-header">
              <h4 id={dialogTitleId}>Foto da avaliação {reviewNumber}</h4>
              <button
                aria-label="Fechar visualização da foto"
                className="testimonial-lightbox-control"
                onClick={closePhoto}
                ref={closeButtonRef}
                type="button"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>

            <figure className="testimonial-lightbox-figure">
              <Image
                alt={activePhoto.alt}
                className="testimonial-lightbox-image"
                height={activePhoto.height}
                sizes="(max-width: 768px) 92vw, 1000px"
                src={activePhoto.src}
                width={activePhoto.width}
              />
              <figcaption>
                {`Foto ${activeIndex + 1} de ${photos.length}`}
                {activePhoto.isVideoThumbnail
                  ? ' — miniatura estática; o vídeo não foi fornecido.'
                  : ''}
              </figcaption>
            </figure>

            <nav
              aria-label="Navegação entre as fotos"
              className="testimonial-lightbox-navigation"
            >
              <button
                aria-label="Foto anterior"
                className="testimonial-lightbox-control"
                onClick={() => movePhoto(-1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" size={20} />
              </button>
              <span aria-live="polite" className="testimonial-lightbox-count">
                {`Foto ${activeIndex + 1} de ${photos.length}`}
              </span>
              <button
                aria-label="Próxima foto"
                className="testimonial-lightbox-control"
                onClick={() => movePhoto(1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" size={20} />
              </button>
            </nav>
          </>
        ) : null}
      </dialog>
    </>
  );
}
