import PrismicDOM from "prismic-dom";

export const readText = (text: any[]) => PrismicDOM.RichText.asText(text);

export const readHTML = (text: any[]) => PrismicDOM.RichText.asHtml(text);
