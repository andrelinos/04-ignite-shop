import Image from 'next/future/image';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Link from 'next/link';

import { useKeenSlider } from 'keen-slider/react';

import { stripe } from '../lib/stripe';
import { HomeContainer, Product } from '../styles/pages/home';

import 'keen-slider/keen-slider.min.css';
import Stripe from 'stripe';
import { useState } from 'react';

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    active: boolean;
    typeProduct: string;
    price: string;
  }[];
}

export default function Home({ products }: HomeProps) {
  const [isLoading, setIsLoading] = useState(products);

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3,
      spacing: 48,
    },
  });

  return (
    <>
      <Head>
        <title>Home | Ignite Shop [{products?.length}]</title>
      </Head>

      <HomeContainer ref={sliderRef} className="keen-slider">
        {products.map(
          (product) =>
            product.active && (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                prefetch={false}
              >
                <Product className="keen-slider__slide">
                  <Image
                    src={product.imageUrl}
                    width={520}
                    height={480}
                    decoding="async"
                    data-nimg="future"
                    loading="lazy"
                    style={{ color: 'transparent' }}
                    alt=""
                  />

                  <footer>
                    <strong>{product.name}</strong>
                    <span>{product.price}</span>
                  </footer>
                </Product>
              </Link>
            ),
        )}
      </HomeContainer>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price'],
  });

  const products = response.data.map((product) => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      active: product.active,
      typeProduct: product.type,
      imageUrl: product.images[0] || '',
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price?.unit_amount / 100),
    };
  });

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2 hours,
  };
};
