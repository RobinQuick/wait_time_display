import { Product } from '../types';

export const products: Product[] = [
  {
    id: 'muffin-choco-banane',
    name: 'Muffin choco banane',
    image: '/static/products/muffinchocobanane.png',
    offer: 'un muffin choco banane'
  },
  {
    id: 'cookie-trio-choco',
    name: 'Cookie trio choco',
    image: '/static/products/cookietriochoco.png',
    offer: 'un cookie trio choco'
  },
  {
    id: 'expresso',
    name: 'Expresso',
    image: '/static/products/expresso.png',
    offer: 'un expresso'
  },
  {
    id: 'trio-beignets',
    name: 'Trio de beignets',
    image: '/static/products/trio.png',
    offer: 'un trio de beignets'
  },
  {
    id: 'bigout-choco',
    name: 'Bigout choco',
    image: '/static/products/bigout_choco.png',
    offer: 'un Bigout choco'
  },
  {
    id: 'churros',
    name: 'Churros',
    image: '/static/products/churros.jpg',
    offer: 'des churros'
  },
  {
    id: 'fondant-choco',
    name: 'Fondant choco',
    image: '/static/products/fondant.jpg',
    offer: 'un fondant choco'
  }
];

export function getProductByOffer(offer: string): Product | undefined {
  const normalizedOffer = offer.toLowerCase();
  return products.find(product => 
    normalizedOffer.includes(product.name.toLowerCase()) ||
    product.offer.toLowerCase().includes(normalizedOffer)
  );
}