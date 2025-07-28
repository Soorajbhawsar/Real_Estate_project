// DOM Elements
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
const propertySearchForm = document.getElementById('propertySearchForm');
const propertyListingForm = document.getElementById('propertyListingForm');
const propertiesContainer = document.getElementById('propertiesContainer');
const valuationForm = document.getElementById('valuationForm');
const newsletterForm = document.getElementById('newsletterForm');

// Mobile Menu Toggle
mobileMenuBtn.addEventListener('click', () => {
    mainNav.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
document.querySelectorAll('#mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        mainNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
    });
});

// Load properties from backend
async function loadProperties(filters = {}) {
    try {
        let url = '/api/properties';
        const queryParams = new URLSearchParams();

        if (filters.query) queryParams.append('query', filters.query);
        if (filters.purpose) queryParams.append('purpose', filters.purpose);

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await fetch(url);
        const properties = await response.json();

        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
        showNotification('Failed to load properties. Please try again.', 'error');
    }
}

// Display properties in the UI
function displayProperties(properties) {
    if (!propertiesContainer) return;

    propertiesContainer.innerHTML = '';

    if (properties.length === 0) {
        propertiesContainer.innerHTML = '<p class="no-results">No properties found matching your criteria.</p>';
        return;
    }

    properties.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';

        const imageUrl = property.imagePath ? `/uploads/${property.imagePath}` : 'placeholder-image.jpg';

        propertyCard.innerHTML = `
            <img src="${imageUrl}" alt="${property.propertyType}" class="property-image">
            <div class="property-details">
                <h3>${property.propertyType} in ${property.location}</h3>
                <p class="property-location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <div class="property-features">
                    ${property.bedrooms ? `<span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>` : ''}
                    ${property.bathrooms ? `<span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>` : ''}
                    ${property.areaSqFt ? `<span><i class="fas fa-ruler-combined"></i> ${property.areaSqFt} sq.ft.</span>` : ''}
                </div>
                <p class="property-description">${property.description || 'No description available.'}</p>
                <div class="property-price">₹ ${formatPrice(property.price)}</div>
                <button class="btn contact-btn" data-owner="${property.ownerName}" data-phone="${property.ownerPhone}">
                    <i class="fas fa-phone-alt"></i> Contact Owner
                </button>
            </div>
        `;

        propertiesContainer.appendChild(propertyCard);
    });

    // Add event listeners to contact buttons
    document.querySelectorAll('.contact-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const ownerName = btn.getAttribute('data-owner');
            const ownerPhone = btn.getAttribute('data-phone');
            alert(`Contact ${ownerName} at ${ownerPhone}`);
        });
    });
}

// Format price with commas
function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Handle property search form submission
if (propertySearchForm) {
    propertySearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(propertySearchForm);
        const filters = {
            query: formData.get('location') || formData.get('query'),
            purpose: formData.get('purpose'),
            type: formData.get('type'),
            bedrooms: formData.get('bedrooms'),
            bathrooms: formData.get('bathrooms'),
            price: formData.get('price'),
            area: formData.get('area')
        };

        await loadProperties(filters);
    });
}

// Handle property listing form submission
if (propertyListingForm) {
    propertyListingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(propertyListingForm);
        const imageFile = formData.get('image');

        const property = {
            propertyType: formData.get('propertyType').toUpperCase(),
            purpose: formData.get('purpose'),
            location: formData.get('location'),
            bedrooms: parseInt(formData.get('bedrooms')) || 0,
            bathrooms: parseInt(formData.get('bathrooms')) || 0,
            areaSqFt: parseFloat(formData.get('areaSqFt')),
            price: parseFloat(formData.get('price')),
            description: formData.get('description'),
            ownerName: formData.get('ownerName'),
            ownerEmail: formData.get('ownerEmail'),
            ownerPhone: formData.get('ownerPhone')
        };

        try {
            const response = await fetch('/api/properties', {
                method: 'POST',
                headers: {
                    // Let the browser set Content-Type with boundary for FormData
                },
                body: createFormData(property, imageFile)
            });

            if (response.ok) {
                const savedProperty = await response.json();
                showNotification('Property listed successfully!', 'success');
                propertyListingForm.reset();

                // Redirect to properties page after successful submission
                setTimeout(() => {
                    window.location.href = 'properties.html';
                }, 1500);
            } else {
                throw new Error('Failed to save property');
            }
        } catch (error) {
            console.error('Error saving property:', error);
            showNotification('Failed to list property. Please try again.', 'error');
        }
    });
}

// Helper function to create FormData for property submission
function createFormData(property, imageFile) {
    const formData = new FormData();
    formData.append('property', new Blob([JSON.stringify(property)], {
        type: 'application/json'
    }));

    if (imageFile && imageFile.name) {
        formData.append('imageFile', imageFile);
    }

    return formData;
}

// Handle valuation form submission
if (valuationForm) {
    valuationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Valuation request received. We will contact you shortly.', 'success');
        valuationForm.reset();
    });
}

// Handle newsletter form submission
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        newsletterForm.reset();
    });
}

// Show notification to user
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// Load properties when page loads (for properties.html)
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('properties.html')) {
        // Check for URL query parameters
        const urlParams = new URLSearchParams(window.location.search);
        const filters = {};

        if (urlParams.has('type')) filters.query = urlParams.get('type');
        if (urlParams.has('purpose')) filters.purpose = urlParams.get('purpose');

        loadProperties(filters);
    } else if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        // Load featured properties on homepage
        loadProperties({ purpose: 'sell' });
    }
});