import cacarola from '../../interface/cacarola.webp';
import cozinha from '../../interface/cozinha-ambientada.webp';
import fervedor from '../../interface/fervedor.webp';
import frigideira from '../../interface/frigideira.webp';
import jogo from '../../interface/jogo-4-pecas.webp';
import kit from '../../interface/kit-embalagem.webp';
import logo from '../../interface/logo.webp';
import panela from '../../interface/panela.webp';

export const brandLogo = logo;
export const heroProductImage = jogo;
export const packagingImage = kit;
export const kitchenImage = cozinha;

export const productPieces = [
  {
    name: 'Frigideira',
    dimensions: '18 cm · 0,7 L',
    use: 'Para omeletes, legumes e porções rápidas',
    image: frigideira,
    alt: 'Frigideira Tramontina Turim preta com interior antiaderente claro.',
  },
  {
    name: 'Panela com tampa',
    dimensions: '16 cm · 1,4 L',
    use: 'Para acompanhamentos e porções menores',
    image: panela,
    alt: 'Panela Tramontina Turim preta de 16 cm com tampa de vidro.',
  },
  {
    name: 'Caçarola com tampa',
    dimensions: '18 cm · 2 L',
    use: 'Para receitas cozidas do dia a dia',
    image: cacarola,
    alt: 'Caçarola Tramontina Turim preta de 18 cm com tampa de vidro.',
  },
  {
    name: 'Fervedor',
    dimensions: '12 cm · 1,1 L',
    use: 'Para aquecer água, leite e outras bebidas',
    image: fervedor,
    alt: 'Fervedor Tramontina Turim preto de 12 cm.',
  },
] as const;
