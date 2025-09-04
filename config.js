// Shopify Configuration
// IMPORTANT: This file should NOT be committed to version control in production
// Copy this file to config.local.js and add it to .gitignore for production use

window.ShopifyConfig = {
    // Your Shopify store domain
    domain: 'your-shop.myshopify.com',
    
    // Your Shopify Storefront API access token
    // Get this from: Shopify Admin > Apps > App and sales channel settings > Develop apps
    storefrontAccessToken: 'YOUR_TOKEN_HERE',
    
    // Your Shopify product ID
    // Get this from your Shopify product page URL or product details
    productId: 'your-product-id-here'
};

// Security Note: 
// - Never commit actual tokens to version control
// - Use different tokens for development and production
// - Consider using a backend API to proxy Shopify requests for better security
// - Rotate your tokens regularly
