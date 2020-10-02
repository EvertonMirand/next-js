import { useEffect, useState } from "react";

import useSWR from "swr";
import { useFetch } from "../services/useFetch";

import { Title } from "../styles/pages/Home";

interface IProduct {
  id: string;
  title: string;
}

export default function Home() {
  const { data: recommendedProducts } = useFetch<IProduct[]>("recommended");

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
