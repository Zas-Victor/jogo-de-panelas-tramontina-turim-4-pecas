import type { StaticImageData } from 'next/image';
import reviewOnePhotoOne from '../../interface/depoimento_01_qualidade_e_tamanho/fotos/D_NQ_NP_2X_622415-MLA90362367474_082025-O.webp';
import reviewOnePhotoTwo from '../../interface/depoimento_01_qualidade_e_tamanho/fotos/D_NQ_NP_2X_829507-MLA90748294189_082025-O.webp';
import reviewOnePhotoThree from '../../interface/depoimento_01_qualidade_e_tamanho/fotos/D_NQ_NP_2X_993949-MLA90748925229_082025-O.webp';
import reviewTwoPhotoOne from '../../interface/depoimento_02_presente_para_filha/fotos/D_NQ_NP_2X_728753-MLA80177641045_102024-O.webp';
import reviewTwoPhotoTwo from '../../interface/depoimento_02_presente_para_filha/fotos/D_NQ_NP_2X_809475-MLA79923655324_102024-O.webp';
import reviewThreePhotoOne from '../../interface/depoimento_03_material_e_pecas_compactas/fotos/D_NQ_NP_2X_784842-MLA112645323935_062026-O.webp';
import reviewThreePhotoTwo from '../../interface/depoimento_03_material_e_pecas_compactas/fotos/D_NQ_NP_2X_923505-MLA112644468643_062026-O.webp';
import reviewThreeVideoThumbnail from '../../interface/depoimento_03_material_e_pecas_compactas/fotos/D_NQ_NP_853621-MLA111580804702_062026-B.jpg';

export type TestimonialPhoto = {
  id: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  isVideoThumbnail?: boolean;
};

export type Testimonial = {
  id: string;
  number: string;
  text: string;
  rating: 5;
  photos: TestimonialPhoto[];
};

function testimonialPhoto(
  id: string,
  image: StaticImageData,
  alt: string,
  isVideoThumbnail = false,
): TestimonialPhoto {
  return {
    id,
    src: image.src,
    width: image.width,
    height: image.height,
    alt,
    ...(isVideoThumbnail ? { isVideoThumbnail: true } : {}),
  };
}

export const testimonials: Testimonial[] = [
  {
    id: 'depoimento-01',
    number: '01',
    rating: 5,
    text: 'Produto de qualidade, tramontina não tem erro, panelas pequenas pra duas ou três pessoas no máximo.',
    photos: [
      testimonialPhoto(
        'depoimento-01-foto-01',
        reviewOnePhotoOne,
        'Mão sobre o interior da frigideira para mostrar seu tamanho.',
      ),
      testimonialPhoto(
        'depoimento-01-foto-02',
        reviewOnePhotoTwo,
        'Frigideira, panela, caçarola e fervedor fotografados juntos.',
      ),
      testimonialPhoto(
        'depoimento-01-foto-03',
        reviewOnePhotoThree,
        'Fervedor segurado à mão sobre as outras peças do conjunto.',
      ),
    ],
  },
  {
    id: 'depoimento-02',
    number: '02',
    rating: 5,
    text: 'Comprei de presente pra minha filha e ela amou.',
    photos: [
      testimonialPhoto(
        'depoimento-02-foto-01',
        reviewTwoPhotoOne,
        'Embalagem do conjunto Tramontina Turim fotografada junto à avaliação.',
      ),
      testimonialPhoto(
        'depoimento-02-foto-02',
        reviewTwoPhotoTwo,
        'Conjunto de panelas fotografado sobre um fogão.',
      ),
    ],
  },
  {
    id: 'depoimento-03',
    number: '03',
    rating: 5,
    text: 'Material material de alta qualidade. Super indico. São meio pequenas mais são boas as panelas. Top.',
    photos: [
      testimonialPhoto(
        'depoimento-03-foto-01',
        reviewThreePhotoOne,
        'Peças do conjunto Turim dispostas sobre uma superfície estampada.',
      ),
      testimonialPhoto(
        'depoimento-03-foto-02',
        reviewThreePhotoTwo,
        'Panela com tampa de vidro segurada sobre as outras peças.',
      ),
      testimonialPhoto(
        'depoimento-03-miniatura-video',
        reviewThreeVideoThumbnail,
        'Miniatura estática de vídeo que acompanhava a avaliação; o vídeo não foi fornecido.',
        true,
      ),
    ],
  },
];
