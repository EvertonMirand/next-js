import PrismicDOM from "prismic-dom";

export const readText = (text: string) => PrismicDOM.RichText.asText(text);
