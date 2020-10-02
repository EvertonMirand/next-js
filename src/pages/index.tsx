import { GetServerSideProps } from "next";
import useSWR from "swr";

import { fetcher, useFetch } from "../services/useFetch";

import { Title } from "../styles/pages/Home";

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home(props: HomeProps) {
  const { data: recommendedProducts } = useFetch<IProduct[]>("recommended", {
    initialData: props.recommendedProducts,
  });

  if (!recommendedProducts) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map(({ id, title }) => (
            <li key={id}>{title}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const data = await fetcher<IProduct[]>("recommended");

  return {
    props: {
      recommendedProducts: data || [],
    },
  };
};
