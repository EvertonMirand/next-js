import Prismic from "prismic-javascript";
import useSWR, { ConfigInterface } from "swr";
import axios from "axios";
import { fetcherFn } from "swr/dist/types";
import { Document } from "prismic-javascript/types/documents";
import { client } from "@/lib/prismic";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetcher = async (document: string): Promise<Document[]> => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", document),
  ]);

  return recommendedProducts.results;
};

export function useFetch(
  url: string,
  config: ConfigInterface<Document[], Error, fetcherFn<Document[]>>
) {
  const { data, error, mutate } = useSWR(url, fetcher, config);

  return { data, error, mutate };
}
