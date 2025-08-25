# Shopify Configuration Template

## 🔒 SECURITY WARNING
**NEVER commit actual API tokens to version control!**

## 📋 Configuration Steps

### 1. Create Environment Variables
Create a `.env` file in your project root (and add it to `.gitignore`):

```bash
# Shopify Configuration
SHOPIFY_DOMAIN=your-shop.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_actual_token_here
SHOPIFY_PRODUCT_ID=your_product_id_here
```

### 2. Update Your Code
Replace hardcoded values with environment variables:

```javascript
// In script.js
const client = window.ShopifyBuy.buildClient({
    domain: process.env.SHOPIFY_DOMAIN || 'your-shop.myshopify.com',
    storefrontAccessToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || 'YOUR_TOKEN'
});
```

### 3. Add to .gitignore
Ensure your `.gitignore` includes:

```gitignore
.env
.env.local
.env.production
*.env
```

## 🚨 Immediate Actions Required

1. **Revoke the exposed tokens** in Shopify Admin immediately
2. **Generate new tokens** for your Shopify integration
3. **Use environment variables** instead of hardcoded secrets
4. **Clean up git history** to remove all traces of the secrets

## 🔑 Token Generation

1. Go to Shopify Admin > Apps > App and sales channel settings
2. Navigate to Storefront API
3. Generate a new access token
4. Store it securely in environment variables

## 📱 For Client-Side Applications

Since this is a client-side app, consider:
- Using a backend API to proxy Shopify requests
- Implementing server-side rendering
- Using Shopify's embedded apps approach
- Moving sensitive operations to a secure backend
