import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import Prismic from "prismic-javascript";
import Link from "next/link";
import { fetcher, fetcherByUID, useFetch } from "@/services/useFetch";
import { Document } from "prismic-javascript/types/documents";
import { readText } from "@/utils/PrismicUtils";

interface CategoryProps {
  products: Document[];
  category: Document;
  slug: string;
}

export default function Product(props: CategoryProps) {
  const {
    data: { products, category },
  } = useFetch(
    props.slug,
    {
      initialData: { ...props },
    },
    productsFetcher
  );

  const router = useRouter();

  if (router.isFallback || !products?.length) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{readText(category?.data?.title)}</h1>
      <ul>
        {products.map(({ id, data: { title }, uid }) => (
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

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await fetcher("categories");

  const paths = categories.map(({ uid }) => {
    return {
      params: {
        slug: uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

const productsFetcher = async (slug: string | string[]) => {
  const category = await fetcherByUID("category", String(slug));

  const products =
    (await fetcher("product", [
      Prismic.Predicates.at("my.product.category", category.id),
    ])) || [];

  return {
    products,
    category,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;
  const { products, category } = await productsFetcher(slug);

  return {
    props: {
      products,
      category,
      slug: String(slug),
    },
    revalidate: 60,
  };
};
