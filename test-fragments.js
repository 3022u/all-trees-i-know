// Test file to verify current fragment content
import productFragment from './lib/shopify/fragments/product';
import seoFragment from './lib/shopify/fragments/seo';

console.log('Product fragment:', productFragment);
console.log('SEO fragment:', seoFragment);

// Check if @inContext is present
const hasInContext = productFragment.includes('@inContext') || seoFragment.includes('@inContext');
console.log('Contains @inContext:', hasInContext);
