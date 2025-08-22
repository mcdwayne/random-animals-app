class RandomAnimalsApp {
    constructor() {
        this.viewCount = 0;
        this.favorites = JSON.parse(localStorage.getItem('animalFavorites') || '[]');
        this.currentAnimal = null;
        this.cart = JSON.parse(localStorage.getItem('animalCart') || '[]');
        this.printsSold = parseInt(localStorage.getItem('printsSold') || '0');
        
        this.initializeElements();
        this.bindEvents();
        this.updateStats();
        this.renderFavorites();
        this.initializeShopify();
    }

    initializeElements() {
        this.elements = {
            fetchRandom: document.getElementById('fetchRandom'),
            fetchDog: document.getElementById('fetchDog'),
            fetchCat: document.getElementById('fetchCat'),
            fetchFox: document.getElementById('fetchFox'),
            loading: document.getElementById('loading'),
            animalCard: document.getElementById('animalCard'),
            animalImg: document.getElementById('animalImg'),
            animalName: document.getElementById('animalName'),
            animalDescription: document.getElementById('animalDescription'),
            animalType: document.getElementById('animalType'),
            animalSource: document.getElementById('animalSource'),
            errorMessage: document.getElementById('errorMessage'),
            viewCount: document.getElementById('viewCount'),
            favoriteCount: document.getElementById('favoriteCount'),
            printsSold: document.getElementById('printsSold'),
            favoritesList: document.getElementById('favoritesList'),
            buyPrintBtn: document.getElementById('buyPrintBtn'),
            shopifyBuyButton: document.getElementById('shopify-buy-button'),
            cartModal: document.getElementById('cartModal'),
            cartItems: document.getElementById('cartItems'),
            cartTotal: document.getElementById('cartTotal'),
            closeCart: document.getElementById('closeCart'),
            checkoutBtn: document.getElementById('checkoutBtn')
        };
    }

    bindEvents() {
        this.elements.fetchRandom.addEventListener('click', () => this.fetchRandomAnimal());
        this.elements.fetchDog.addEventListener('click', () => this.fetchSpecificAnimal('dog'));
        this.elements.fetchCat.addEventListener('click', () => this.fetchSpecificAnimal('cat'));
        this.elements.fetchFox.addEventListener('click', () => this.fetchSpecificAnimal('fox'));
        
        // Add favorite functionality to animal name
        this.elements.animalName.addEventListener('click', () => this.toggleFavorite());
        
        // Shopify integration events
        this.elements.buyPrintBtn.addEventListener('click', () => this.addToCart());
        this.elements.closeCart.addEventListener('click', () => this.closeCartModal());
        this.elements.checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        
        // Close modal when clicking outside
        this.elements.cartModal.addEventListener('click', (e) => {
            if (e.target === this.elements.cartModal) {
                this.closeCartModal();
            }
        });
    }

    initializeShopify() {
        // Initialize Shopify Buy Button
        if (window.ShopifyBuy) {
            this.createShopifyButton();
        } else {
            // Fallback if Shopify SDK doesn't load
            console.log('Shopify SDK not loaded, using fallback cart system');
        }
    }

    createShopifyButton() {
        try {
            const client = window.ShopifyBuy.buildClient({
                domain: 'your-shop.myshopify.com', // Replace with your actual Shopify domain
                storefrontAccessToken: 'your-storefront-access-token' // Replace with your actual token
            });

            window.ShopifyBuy.UI.onReady(client).then((ui) => {
                ui.createComponent('product', {
                    id: 'your-product-id', // Replace with your actual product ID
                    node: this.elements.shopifyBuyButton,
                    moneyFormat: '%24%7B%7Bamount%7D%7D',
                    options: {
                        product: {
                            styles: {
                                button: {
                                    'background-color': '#96bf47',
                                    'border-radius': '25px',
                                    'font-size': '16px',
                                    'font-weight': '600',
                                    'padding': '12px 24px'
                                }
                            }
                        }
                    }
                });
            });
        } catch (error) {
            console.log('Shopify integration failed, using fallback system:', error);
        }
    }

    addToCart() {
        if (!this.currentAnimal) return;

        const selectedSize = document.querySelector('input[name="printSize"]:checked').value;
        const price = this.getPriceForSize(selectedSize);
        
        const cartItem = {
            id: Date.now(),
            animal: this.currentAnimal,
            size: selectedSize,
            price: price,
            addedAt: new Date().toISOString()
        };

        this.cart.push(cartItem);
        localStorage.setItem('animalCart', JSON.stringify(this.cart));
        
        this.showCartModal();
        this.updateStats();
        
        // Show success message
        this.showNotification('Print added to cart!', 'success');
    }

    getPriceForSize(size) {
        const prices = {
            '8x10': 24.99,
            '11x14': 34.99,
            '16x20': 49.99
        };
        return prices[size] || 24.99;
    }

    showCartModal() {
        this.elements.cartModal.classList.remove('hidden');
        this.renderCart();
    }

    closeCartModal() {
        this.elements.cartModal.classList.add('hidden');
    }

    renderCart() {
        if (this.cart.length === 0) {
            this.elements.cartItems.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
            this.elements.cartTotal.textContent = '0.00';
            return;
        }

        this.elements.cartItems.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <img src="${item.animal.image}" alt="${item.animal.name}">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.animal.name}</div>
                    <div class="cart-item-details">${item.size} Print • ${item.animal.type}</div>
                </div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
        `).join('');

        const total = this.cart.reduce((sum, item) => sum + item.price, 0);
        this.elements.cartTotal.textContent = total.toFixed(2);
    }

    proceedToCheckout() {
        if (this.cart.length === 0) return;

        // Simulate successful purchase
        this.printsSold += this.cart.length;
        localStorage.setItem('printsSold', this.printsSold.toString());
        
        // Clear cart
        this.cart = [];
        localStorage.setItem('animalCart', JSON.stringify(this.cart));
        
        this.closeCartModal();
        this.updateStats();
        this.showNotification('Order placed successfully!', 'success');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#96bf47' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    async fetchRandomAnimal() {
        const apis = [
            () => this.fetchDogAPI(),
            () => this.fetchCatAPI(),
            () => this.fetchFoxAPI(),
            () => this.fetchRandomDogAPI(),
            () => this.fetchRandomCatAPI()
        ];
        
        const randomAPI = apis[Math.floor(Math.random() * apis.length)];
        await randomAPI();
    }

    async fetchSpecificAnimal(type) {
        switch(type) {
            case 'dog':
                await this.fetchDogAPI();
                break;
            case 'cat':
                await this.fetchCatAPI();
                break;
            case 'fox':
                await this.fetchFoxAPI();
                break;
        }
    }

    async fetchDogAPI() {
        try {
            this.showLoading();
            const response = await fetch('https://dog.ceo/api/breeds/image/random');
            const data = await response.json();
            
            if (data.status === 'success') {
                const breed = this.extractBreedFromUrl(data.message);
                this.displayAnimal({
                    image: data.message,
                    name: breed,
                    description: `A beautiful ${breed} dog`,
                    type: 'Dog',
                    source: 'Dog CEO API'
                });
            } else {
                throw new Error('Failed to fetch dog');
            }
        } catch (error) {
            this.showError('Failed to fetch dog image');
        }
    }

    async fetchCatAPI() {
        try {
            this.showLoading();
            const response = await fetch('https://api.thecatapi.com/v1/images/search');
            const data = await response.json();
            
            if (data && data[0]) {
                const cat = data[0];
                this.displayAnimal({
                    image: cat.url,
                    name: cat.breeds?.[0]?.name || 'Random Cat',
                    description: cat.breeds?.[0]?.description || 'A lovely cat',
                    type: 'Cat',
                    source: 'The Cat API'
                });
            } else {
                throw new Error('Failed to fetch cat');
            }
        } catch (error) {
            this.showError('Failed to fetch cat image');
        }
        // Fallback to random dog if cat API fails
        if (!this.currentAnimal) {
            await this.fetchDogAPI();
        }
    }

    async fetchFoxAPI() {
        try {
            this.showLoading();
            const response = await fetch('https://randomfox.ca/floof/');
            const data = await response.json();
            
            if (data.image) {
                this.displayAnimal({
                    image: data.image,
                    name: 'Random Fox',
                    description: 'A cute fox in the wild',
                    type: 'Fox',
                    source: 'Random Fox API'
                });
            } else {
                throw new Error('Failed to fetch fox');
            }
        } catch (error) {
            this.showError('Failed to fetch fox image');
        }
        // Fallback to random dog if fox API fails
        if (!this.currentAnimal) {
            await this.fetchDogAPI();
        }
    }

    async fetchRandomDogAPI() {
        try {
            this.showLoading();
            const response = await fetch('https://api.thedogapi.com/v1/images/search');
            const data = await response.json();
            
            if (data && data[0]) {
                const dog = data[0];
                this.displayAnimal({
                    image: dog.url,
                    name: dog.breeds?.[0]?.name || 'Random Dog',
                    description: dog.breeds?.[0]?.description || 'A wonderful dog',
                    type: 'Dog',
                    source: 'The Dog API'
                });
            } else {
                throw new Error('Failed to fetch dog');
            }
        } catch (error) {
            this.showError('Failed to fetch dog image');
        }
        // Fallback to basic dog API if this fails
        if (!this.currentAnimal) {
            await this.fetchDogAPI();
        }
    }

    async fetchRandomCatAPI() {
        try {
            this.showLoading();
            const response = await fetch('https://api.thecatapi.com/v1/images/search?limit=1');
            const data = await response.json();
            
            if (data && data[0]) {
                const cat = data[0];
                this.displayAnimal({
                    image: cat.url,
                    name: cat.breeds?.[0]?.name || 'Random Cat',
                    description: cat.breeds?.[0]?.description || 'A lovely cat',
                    type: 'Cat',
                    source: 'The Cat API'
                });
            } else {
                throw new Error('Failed to fetch cat');
            }
        } catch (error) {
            this.showError('Failed to fetch cat image');
        }
        // Fallback to basic cat API if this fails
        if (!this.currentAnimal) {
            await this.fetchCatAPI();
        }
    }

    extractBreedFromUrl(url) {
        const parts = url.split('/');
        const breedPart = parts[parts.length - 2];
        return breedPart.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    displayAnimal(animal) {
        this.currentAnimal = animal;
        this.viewCount++;
        
        this.elements.animalImg.src = animal.image;
        this.elements.animalImg.alt = animal.name;
        this.elements.animalName.textContent = animal.name;
        this.elements.animalDescription.textContent = animal.description;
        this.elements.animalType.textContent = animal.type;
        this.elements.animalSource.textContent = animal.source;
        
        this.hideLoading();
        this.elements.animalCard.classList.remove('hidden');
        this.elements.errorMessage.classList.add('hidden');
        
        this.updateStats();
    }

    showLoading() {
        this.elements.loading.classList.remove('hidden');
        this.elements.animalCard.classList.add('hidden');
        this.elements.errorMessage.classList.add('hidden');
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }

    showError(message) {
        this.elements.loading.classList.add('hidden');
        this.elements.animalCard.classList.add('hidden');
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.errorMessage.querySelector('p').textContent = message;
    }

    toggleFavorite() {
        if (!this.currentAnimal) return;
        
        const existingIndex = this.favorites.findIndex(fav => 
            fav.image === this.currentAnimal.image
        );
        
        if (existingIndex !== -1) {
            this.favorites.splice(existingIndex, 1);
        } else {
            this.favorites.push({
                ...this.currentAnimal,
                addedAt: new Date().toISOString()
            });
        }
        
        localStorage.setItem('animalFavorites', JSON.stringify(this.favorites));
        this.updateStats();
        this.renderFavorites();
    }

    updateStats() {
        this.elements.viewCount.textContent = this.viewCount;
        this.elements.favoriteCount.textContent = this.favorites.length;
        this.elements.printsSold.textContent = this.printsSold;
    }

    renderFavorites() {
        if (this.favorites.length === 0) {
            this.elements.favoritesList.innerHTML = '<p class="no-favorites">No favorites yet. Start discovering animals!</p>';
            return;
        }
        
        this.elements.favoritesList.innerHTML = this.favorites
            .slice(-6) // Show last 6 favorites
            .reverse() // Most recent first
            .map(fav => `
                <div class="favorite-item">
                    <img src="${fav.image}" alt="${fav.name}" loading="lazy">
                    <div class="favorite-info">
                        <h4>${fav.name}</h4>
                        <p>${fav.type} • ${fav.source}</p>
                    </div>
                </div>
            `).join('');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RandomAnimalsApp();
});

// Add some fun animal facts for variety
const animalFacts = [
    "Dogs have been domesticated for over 15,000 years!",
    "Cats spend 70% of their lives sleeping.",
    "Foxes are excellent swimmers and climbers.",
    "Some dogs can smell cancer in humans.",
    "Cats have over 20 muscles that control their ears.",
    "Foxes use the Earth's magnetic field to hunt.",
    "Dogs can understand up to 250 words and gestures.",
    "Cats can rotate their ears 180 degrees.",
    "Foxes are members of the dog family.",
    "Dogs dream just like humans do!"
];

// Add random fact to description if available
function addRandomFact(description) {
    const randomFact = animalFacts[Math.floor(Math.random() * animalFacts.length)];
    return `${description} Fun fact: ${randomFact}`;
}
