import Prismic from "prismic-javascript";
import useSWR, { ConfigInterface } from "swr";
import axios from "axios";
import { fetcherFn } from "swr/dist/types";
import { Document } from "prismic-javascript/types/documents";
import { client } from "@/lib/prismic";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetcher = async (
  document: string,
  otherQueries: string[] = []
): Promise<Document[]> => {
  const data = await client().query([
    Prismic.Predicates.at("document.type", document),
    ...otherQueries,
  ]);

  return data.results;
};

export const fetcherByUID = async (
  document: string,
  slug: string
): Promise<Document> => {
  const data = await client().getByUID(document, slug, {});

  return data;
};

export function useFetch(
  url: string,
  config: ConfigInterface<Document[] | any, Error, fetcherFn<Document[] | any>>,
  fn: fetcherFn<Document[]> | fetcherFn<Document> | fetcherFn<any> = fetcher
) {
  const { data, error, mutate } = useSWR(url, fn, config);

  return { data, error, mutate };
}
