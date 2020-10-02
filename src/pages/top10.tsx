import { GetStaticProps } from "next";
import { fetcher, useFetch } from "../services/useFetch";

interface IProduct {
  id: string;
  title: string;
}

interface Top10Props {
  products: IProduct[];
}

export default function Top10(props: Top10Props) {
  const { data: products } = useFetch<IProduct[]>("products", {
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
  const products = await fetcher<IProduct[]>("products");

  return {
    props: {
      products,
    },
    revalidate: 5,
  };
};
