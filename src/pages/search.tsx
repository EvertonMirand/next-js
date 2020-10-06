import { fetcher, useFetch } from "@/services/useFetch";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import Prismic from "prismic-javascript";

import { Document } from "prismic-javascript/types/documents";
import React, { FormEvent, useCallback, useState } from "react";
import { readText } from "@/utils/PrismicUtils";
import Link from "next/link";

interface SearchProps {
  searchResults: Document[];
}

export default function Search({ searchResults }: SearchProps) {
  const [search, setSearch] = useState("");

  const router = useRouter();

  const handleSearch = useCallback((e: FormEvent) => {
    e.preventDefault();

    router.push(`/search?q=${encodeURIComponent(search)}`);

    setSearch("");
  }, []);

  const onChangeSearch = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(value);
    },
    [search]
  );

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={search} onChange={onChangeSearch}></input>
        <button type="submit">Search</button>
      </form>

      <ul>
        {searchResults?.map(({ id, data: { title }, uid }) => (
          <li key={id}>
            <Link href={`/catalog/products/${uid}`}>
              <a>{readText(title)}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

const fetcherProduct = async (q: string | string[]) => {
  if (!q) {
    return [];
  }

  const searchResults = await fetcher("product", [
    Prismic.Predicates.fulltext("my.product.title", String(q)),
  ]).catch(() => [] as Document[]);

  return searchResults;
};

export const getServerSideProps: GetServerSideProps<SearchProps> = async (
  context
) => {
  const { q } = context.query;

  const searchResults = await fetcherProduct(q);

  return {
    props: {
      searchResults,
    },
  };
};
