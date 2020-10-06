import React, { useCallback, useState } from "react";

import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { fetcherByUID, useFetch } from "@/services/useFetch";
import { GetStaticPaths, GetStaticProps } from "next";
import { Document } from "prismic-javascript/types/documents";
import { readHTML, readText } from "@/utils/PrismicUtils";

interface ProductProps {
  product: Document;
}

const AddToCartModal = dynamic(() => import("@/components/AddToCartModal"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

export default function Product({ product }: ProductProps) {
  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  const router = useRouter();

  if (!product?.data || router.isFallback) {
    return <p>Carregando...</p>;
  }

  const handleAddToCart = useCallback(() => {
    setIsAddToCartModalVisible(!isAddToCartModalVisible);
  }, [isAddToCartModalVisible]);

  return (
    <div>
      <h1>{readText(product?.data?.title)}</h1>
      <div
        dangerouslySetInnerHTML={{
          __html: readHTML(product.data.description),
        }}
      />

      <img src={product.data.thumbnail.url} width="400" alt="" />

      <p>Price: ${product.data.price}</p>

      <button onClick={handleAddToCart}>Add to cart</button>
      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

const productsFetcher = (slug: string | string[]) =>
  fetcherByUID("product", String(slug));

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await productsFetcher(slug);

  return {
    props: {
      product,
    },
    revalidate: 5,
  };
};
