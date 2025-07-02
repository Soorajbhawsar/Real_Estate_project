import api from './api.js';

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Get URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {
            location: urlParams.get('location'),
            type: urlParams.get('type'),
            minPrice: urlParams.get('minPrice'),
            maxPrice: urlParams.get('maxPrice')
        };

        // Fetch properties from backend
        const properties = await api.getProperties(filters);
        renderProperties(properties);
    } catch (error) {
        console.error('Error fetching properties:', error);
        alert('Failed to load properties. Please try again later.');
    }
});

function renderProperties(properties) {
    const container = document.getElementById('propertiesContainer');
    container.innerHTML = '';

    if (properties.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <h3>No properties found matching your criteria</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        return;
    }

    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-img">
                <span class="property-tag">${property.purpose === 'buy' ? 'For Sale' : 'For Rent'}</span>
                <img src="${property.imageUrl}" alt="${property.title}">
            </div>
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">${property.price} ${property.purpose === 'rent' ? '/ month' : ''}</p>
                <div class="details">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area} sq.ft.</span>
                </div>
                <button class="btn inquire-btn" data-id="${property.id}">Inquire Now</button>
            </div>
        `;
        container.appendChild(propertyCard);
    });

    // Add event listeners to inquire buttons
    document.querySelectorAll('.inquire-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const propertyId = btn.getAttribute('data-id');
            window.location.href = `contact.html?propertyId=${propertyId}`;
        });
    });
}