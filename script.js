class RandomAnimalsApp {
    constructor() {
        this.viewCount = 0;
        this.favorites = JSON.parse(localStorage.getItem('animalFavorites') || '[]');
        this.currentAnimal = null;
        
        this.initializeElements();
        this.bindEvents();
        this.updateStats();
        this.renderFavorites();
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
            favoritesList: document.getElementById('favoritesList')
        };
    }

    bindEvents() {
        this.elements.fetchRandom.addEventListener('click', () => this.fetchRandomAnimal());
        this.elements.fetchDog.addEventListener('click', () => this.fetchSpecificAnimal('dog'));
        this.elements.fetchCat.addEventListener('click', () => this.fetchSpecificAnimal('cat'));
        this.elements.fetchFox.addEventListener('click', () => this.fetchSpecificAnimal('fox'));
        
        // Add favorite functionality to animal name
        this.elements.animalName.addEventListener('click', () => this.toggleFavorite());
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
