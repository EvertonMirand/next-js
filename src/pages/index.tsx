import SEO from "@/components/SEO";

import Link from "next/link";
import { GetServerSideProps } from "next";
import { useCallback } from "react";

import PrismicDOM from "prismic-dom";

import { Document } from "prismic-javascript/types/documents";

import { fetcher, useFetch } from "../services/useFetch";

import { Title } from "../styles/pages/Home";

interface HomeProps {
  recommendedProducts: Document[];
}

export default function Home(props: HomeProps) {
  const { data: recommendedProducts } = useFetch("product", {
    initialData: props.recommendedProducts,
  });

  if (!recommendedProducts) {
    return <p>Carregando...</p>;
  }

  const handleSum = useCallback(async () => {
    const maths = await (await import("../lib/maths")).default;
    alert(maths.sum(3, 5));
  }, []);

  return (
    <div>
      <SEO
        title="DevCommerce, your best e-commerce!"
        shouldExcludeTitleSuffix
      />
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(({ id, data: { title }, uid }) => (
            <li key={id}>
              <Link href={`/catalog/products/${uid}`}>
                <a>{PrismicDOM.RichText.asText(title)}</a>
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={handleSum}>Sum!</button>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const recommendedProducts = await fetcher("product");

  return {
    props: {
      recommendedProducts: recommendedProducts || [],
    },
  };
};
