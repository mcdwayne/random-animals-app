# 🚀 Environment Setup Guide

## Shopify Integration Configuration

To use the Shopify integration in this app, you need to set up environment variables for your Shopify credentials.

### 1. Create Local Configuration File

Create a local configuration file with your actual Shopify credentials:

```bash
cp config.local.example.js config.local.js
```

### 2. Configure Your Shopify Credentials

Edit the `config.local.js` file and replace the placeholder values with your actual Shopify credentials:

```javascript
window.ShopifyConfig = {
    domain: 'your-actual-shop.myshopify.com',
    storefrontAccessToken: 'shpat_your_actual_token_here',
    productId: 'your_actual_product_id_here'
};
```

### 3. Get Your Shopify Credentials

#### Shopify Domain
- This is your Shopify store's domain (e.g., `mystore.myshopify.com`)

#### Storefront Access Token
1. Go to your Shopify Admin
2. Navigate to Apps > App and sales channel settings
3. Click "Develop apps"
4. Create a new app or select an existing one
5. Go to "Configuration" > "Storefront API"
6. Generate a new access token
7. Copy the token (starts with `shpat_`)

#### Product ID
1. In your Shopify Admin, go to Products
2. Select the product you want to sell
3. Copy the product ID from the URL or product details

### 4. Security Notes

- **Never commit your `.env` file to version control**
- The `.gitignore` file is configured to exclude environment files
- Keep your tokens secure and rotate them regularly
- Use different tokens for development and production

### 5. Testing

After setting up your environment variables:
1. Restart your development server
2. Check the browser console for any Shopify-related errors
3. Test the buy button functionality

### 6. Troubleshooting

If you see "Shopify SDK not loaded" errors:
- Check that your environment variables are correctly set
- Verify your Shopify domain is correct
- Ensure your access token has the necessary permissions
- Check that the Shopify Buy Button SDK is loading properly

## Support

For more detailed Shopify integration setup, see `shopify-config.md`.
