export const getPoliciesQuery = /* GraphQL */ `
  query getPolicies($language: LanguageCode) @inContext(language: $language) {
    shop {
      shippingPolicy {
        id
        title
        body
        handle
        url
      }
      refundPolicy {
        id
        title
        body
        handle
        url
      }
      termsOfService {
        id
        title
        body
        handle
        url
      }
    }
  }
`;