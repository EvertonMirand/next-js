import { GetStaticProps } from "next";
import { Document } from "prismic-javascript/types/documents";
import { fetcher, useFetch } from "../services/useFetch";

interface Top10Props {
  products: Document[];
}

export default function Top10(props: Top10Props) {
  const { data: products } = useFetch("products", {
    initialData: props.products,
  });

  if (!products) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <section>
        <h1>Products</h1>
        <ul>
          {products.map(({ id, title }) => (
            <li key={id}>{title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps<Top10Props> = async (context) => {
  const products = await fetcher("products");

  return {
    props: {
      products,
    },
    revalidate: 5,
  };
};
