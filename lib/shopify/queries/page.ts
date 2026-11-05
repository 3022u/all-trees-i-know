import seoFragment from '../fragments/seo';

const pageFragment = /* GraphQL */ `
  fragment page on Page {
    ... on Page {
      id
      title
      handle
      body
      bodySummary
      seo {
        ...seo
      }
      createdAt
      updatedAt
    }
  }
  ${seoFragment}
`;

export const getPageQuery = /* GraphQL */ `
 query getPage($handle: String!, $language: LanguageCode) @inContext(language: $language) {
  pageByHandle(handle: $handle) {
    id
    title
    handle
    body
    bodySummary
    seo {
      ...seo
    }

    blocks: metafield(namespace: "page", key: "blocks") {
      reference {
        ... on Metaobject {
          blocks: field(key: "blocks") {
            references(first: 50) {
              nodes {
                __typename
                ... on Metaobject {
                  type
                  fields {
                    key
                    value
                  }

                

                  ... on Metaobject @include(if: true) {
                    type

                    collection: field(key: "collection") {
  reference {
    ... on Collection {
      handle
      title
      description
      image {
        url
        altText
      }
    }
  }
}
 text: field(key: "text") {
                      value
                    }
                    columns: field(key: "columns") {
                      value
                    }
                    col_start: field(key: "col_start") {
                      value
                    }
                    center: field(key: "center") {
                      value
                    }
                    text_color: field(key: "text_color") {
                      value
                    }
                    title_row: field(key: "title_row") {
                      value
                    }
                    left_right: field(key: "left_right") {
                      value
                    }
                    collectionImages: field(key: "images") {
                      references(first: 10) {
                        nodes {
                          ... on MediaImage {
                            image {
                              url
                              altText
                              width
                              height
                            }
                          }
                        }
                      }
                    }

                    imgs: field(key: "imgs") {
                      references(first: 10) {
                        nodes {
                          ... on MediaImage {
                            image {
                              url
                              altText
                              width
                              height
                            }
                          }
                        }
                      }
                    }

                    img: field(key: "img") {
                      reference {
                        ... on MediaImage {
                          image {
                            url
                            altText
                          }
                        }
                      }
                    }
                    gap: field(key: "gap") {
                      value
                    }
                    bottom_align: field(key: "bottom_align") {
                      value
                    }
                    reverse: field(key: "reverse") {
                      value
                    }

                    images: field(key: "imgs") {
                      references(first: 10) {
                        nodes {
                          ... on MediaImage {
                            image {
                              url
                              altText
                            }
                          }
                        }
                      }
                    }
                    bottom_align: field(key: "bottom_align") {
                      value
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
  ${seoFragment}
`;

export const getPagesQuery = /* GraphQL */ `
  query getPages($language: LanguageCode) @inContext(language: $language) {
    pages(first: 100) {
      edges {
        node {
          ...page
        }
      }
    }
  }
  ${pageFragment}
`;
