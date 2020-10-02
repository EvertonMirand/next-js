import useSWR, { ConfigInterface } from "swr";
import axios from "axios";
import { fetcherFn } from "swr/dist/types";

export const api = axios.create({
  baseURL: "http://localhost:3333/",
});

export const fetcher = async <T = any>(url: string): Promise<T> => {
  const response = await api.get(url);

  return response.data;
};

export function useFetch<Data = any, Error = any>(
  url: string,
  config: ConfigInterface<Data, Error, fetcherFn<Data>>
) {
  const { data, error, mutate } = useSWR<Data, Error>(url, fetcher, config);

  return { data, error, mutate };
}
