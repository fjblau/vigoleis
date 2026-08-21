import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

export const dictionaryQuery = defineQuery(`*[_type == "dictionary"][0]`);

export const privacyPolicyQuery = defineQuery(
  `*[_type == "privacyPolicy"][0]{ title, body }`,
);

export const termsQuery = defineQuery(`*[_type == "terms"][0]{ title, body }`);

export const legalNoticeQuery = defineQuery(
  `*[_type == "legalNotice"][0]{ title, body }`,
);

export const linksEphemeraQuery = defineQuery(`*[_type == "linksEphemera"][0]{
  title,
  description,
  categories[]{
    categoryTitle,
    categoryDescription,
    links[]{
      title,
      url,
      description,
      image{
        asset,
        alt,
        hotspot,
        crop
      }
    }
  }
}`);

export const galleryQuery = defineQuery(`*[_type == "gallery"][0]{
  title,
  description,
  categories[]{
    categoryTitle,
    photos[]{
      image{
        asset,
        alt,
        hotspot,
        crop
      },
      caption,
      album
    }
  }
}`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage {
    asset,
    alt,
    hotspot,
    crop
  },
  "date": coalesce(date, _updatedAt),
  "author": author->{"name": coalesce(name, "Anonymous"), picture},
`;

export const heroQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) [0] {
    content,
    ${postFields}
  }
`);

export const moreStoriesQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content,
    ${postFields}
  }
`);

const productCardFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled product"),
  "slug": slug.current,
  price,
  "image": images[0] { asset, alt, hotspot, crop },
  "category": category->{ title, "slug": slug.current },
  inventory,
  published
`;

export const productsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current) && coalesce(published, true)] | order(title asc) {
    ${productCardFields}
  }
`);

export const productBySlugQuery = defineQuery(`
  *[_type == "product" && slug.current == $slug && coalesce(published, true)] [0] {
    ${productCardFields},
    description[],
    "images": images[] { asset, alt, hotspot, crop }
  }
`);

export const customerByEmailQuery = defineQuery(
  `*[_type == "customer" && lower(email) == $email][0]{ _id, name, email }`,
);

export const productPricesByIdsQuery = defineQuery(`
  *[_type == "product" && _id in $ids && coalesce(published, true)]{
    _id,
    title,
    price,
    inventory,
    published
  }
`);

const orderLineItemFields = /* groq */ `
  "product": product->{ _id, title, slug },
  title,
  price,
  quantity
`;

const orderFields = /* groq */ `
  _id,
  orderNumber,
  items[]{ ${orderLineItemFields} },
  total,
  status,
  "customer": customer->{ _id, name, email, address },
  createdAt,
  stripePaymentIntentId
`;

export const ordersQuery = defineQuery(`
  *[_type == "order"] | order(createdAt desc) [0...$limit] {
    ${orderFields}
  }
`);

export const orderByIdQuery = defineQuery(`
  *[_type == "order" && _id == $id][0] {
    ${orderFields}
  }
`);
