export const sanityImageQuery = `
  asset -> {
    _id,
    url,
    metadata {
      lqip
    }
  },
  crop,
  hotspot,
  altText
`;
