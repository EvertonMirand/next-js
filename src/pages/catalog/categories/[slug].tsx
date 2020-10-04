import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";

import { fetcher } from "@/services/useFetch";

interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  products: IProduct[];
}

export default function Product({ products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>
      <ul>
        {products.map(({ id, title }) => (
          <li key={id}>{title}</li>
        ))}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await fetcher<IProduct[]>("categories");

  const paths = categories.map(({ id }) => {
    return {
      params: {
        slug: id,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;
  const products = await fetcher<IProduct[]>(`products?category_id=${slug}`);

  return {
    props: {
      products,
    },
    revalidate: 60,
  };
};
