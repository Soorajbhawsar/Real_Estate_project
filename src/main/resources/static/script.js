// PrimeProperties Main JavaScript File
// Contains all functionality for the real estate website

// Global variables
let properties = []; // Will store properties fetched from backend
const brokers = [];  // Will store brokers data (can be populated from backend)

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
});

function initializeApplication() {
    setupEventListeners();
    loadInitialData();
    setupForms();
}

// ======================
// CORE FUNCTIONS
// ======================

function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    // Filter toggles
    const filterToggles = document.querySelectorAll('.filter-toggle');
    filterToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const target = document.getElementById(toggle.dataset.target);
            if (target) target.classList.toggle('active');
        });
    });
}

function loadInitialData() {
    // Load properties if on properties page
    if (document.getElementById('propertiesContainer')) {
        fetchProperties();
    }

    // Load brokers if on brokers page
    if (document.getElementById('brokersContainer')) {
        fetchBrokers();
    }
}

function setupForms() {
    // Property listing form
    const propertyForm = document.getElementById('propertyListingForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', handlePropertySubmission);
    }

    // Contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmission);
    }
}

// ======================
// PROPERTY FUNCTIONS
// ======================

async function fetchProperties() {
    try {
        const response = await fetch('/api/properties');
        if (!response.ok) throw new Error('Failed to fetch properties');

        properties = await response.json();
        renderProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
        showError('propertiesContainer', 'Failed to load properties. Please try again later.');
    }
}

function renderProperties(propertiesToRender) {
    const container = document.getElementById('propertiesContainer');
    if (!container) return;

    if (!propertiesToRender || propertiesToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-home"></i>
                <h3>No Properties Found</h3>
                <p>There are currently no properties matching your criteria.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = propertiesToRender.map(property => `
        <div class="property-card">
            <div class="property-image">
                <img src="/api/properties/images/${property.imageUrl || 'default.jpg'}"
                     alt="${property.title}"
                     onerror="this.src='/images/default-property.jpg'">
                <span class="property-badge">${property.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
            </div>
            <div class="property-details">
                <h3>${property.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">₹${property.price.toLocaleString('en-IN')}</p>
                <div class="features">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms || '-'} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms || '-'} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area || '-'} sq.ft.</span>
                </div>
                <a href="/property-details.html?id=${property.id}" class="btn">View Details</a>
            </div>
        </div>
    `).join('');
}

function filterProperties() {
    const locationFilter = document.getElementById('locationFilter')?.value.toLowerCase();
    const typeFilter = document.getElementById('typeFilter')?.value;
    const priceFilter = document.getElementById('priceFilter')?.value;

    let filtered = [...properties];

    if (locationFilter) {
        filtered = filtered.filter(p =>
            p.location.toLowerCase().includes(locationFilter)
        );
    }

    if (typeFilter) {
        filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (priceFilter) {
        const maxPrice = parseInt(priceFilter);
        filtered = filtered.filter(p => p.price <= maxPrice);
    }

    renderProperties(filtered);
}

// ======================
// BROKER FUNCTIONS
// ======================

async function fetchBrokers() {
    try {
        const response = await fetch('/api/brokers');
        if (!response.ok) throw new Error('Failed to fetch brokers');

        brokers = await response.json();
        renderBrokers(brokers);
    } catch (error) {
        console.error('Error loading brokers:', error);
        showError('brokersContainer', 'Failed to load brokers. Please try again later.');
    }
}

function renderBrokers(brokersToRender) {
    const container = document.getElementById('brokersContainer');
    if (!container) return;

    if (!brokersToRender || brokersToRender.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-tie"></i>
                <h3>No Brokers Available</h3>
                <p>There are currently no brokers in your area.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = brokersToRender.map(broker => `
        <div class="broker-card">
            <div class="broker-image">
                <img src="${broker.imageUrl || '/images/default-broker.jpg'}"
                     alt="${broker.name}">
            </div>
            <div class="broker-details">
                <h3>${broker.name}</h3>
                <p class="specialization">${broker.specialization}</p>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${broker.location}</p>
                <div class="broker-meta">
                    <span class="experience">${broker.experience} Years Exp</span>
                    <span class="properties-sold">${broker.propertiesSold} Properties</span>
                </div>
                <div class="broker-contact">
                    <a href="tel:${broker.phone}"><i class="fas fa-phone"></i></a>
                    <a href="mailto:${broker.email}"><i class="fas fa-envelope"></i></a>
                    <a href="/contact.html?broker=${broker.id}"><i class="fas fa-comment"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// ======================
// FORM HANDLERS
// ======================

async function handlePropertySubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        // Validate form
        if (!validateForm(form)) return;

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

        // Upload image if exists
        const imageFile = formData.get('propertyImage');
        let imageUrl = 'default.jpg';

        if (imageFile && imageFile.size > 0) {
            imageUrl = await uploadImage(imageFile);
        }

        // Prepare property data
        const propertyData = {
            title: `${formData.get('propertyType')} in ${formData.get('propertyLocation')}`,
            location: formData.get('propertyLocation'),
            price: parseFloat(formData.get('price')),
            bedrooms: parseInt(formData.get('bedrooms')) || 0,
            bathrooms: parseInt(formData.get('bathrooms')) || 0,
            area: parseFloat(formData.get('area')),
            type: formData.get('propertyType'),
            purpose: 'sell', // Default to sell
            description: formData.get('description'),
            imageUrl: imageUrl,
            ownerName: formData.get('ownerName'),
            ownerEmail: formData.get('ownerEmail'),
            ownerPhone: formData.get('ownerPhone')
        };

        // Submit to backend
        const response = await fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(propertyData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit property');
        }

        // Success
        alert('Property submitted successfully!');
        form.reset();
        window.location.href = '/properties.html';

    } catch (error) {
        console.error('Submission error:', error);
        alert(`Error: ${error.message}`);
    } finally {
        // Reset button state
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    }
}

async function uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/properties/upload', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Image upload failed');
    }

    return await response.text();
}

function handleContactSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    if (!validateForm(form)) return;

    // Prepare contact data
    const contactData = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        propertyInquiry: localStorage.getItem('propertyInquiry') || null
    };

    // Submit to backend (simulated)
    setTimeout(() => {
        console.log('Contact form submitted:', contactData);
        alert('Thank you for your message! We will contact you soon.');
        form.reset();
        localStorage.removeItem('propertyInquiry');
    }, 1000);
}

function handleNewsletterSubmission(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.querySelector('input[type="email"]').value;

    if (!email || !validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }

    // Submit to backend (simulated)
    setTimeout(() => {
        console.log('Newsletter subscription:', email);
        alert('Thank you for subscribing to our newsletter!');
        form.reset();
    }, 1000);
}

// ======================
// UTILITY FUNCTIONS
// ======================

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
            // Add error message if not already present
            if (!field.nextElementSibling?.classList.contains('error-message')) {
                const errorMsg = document.createElement('small');
                errorMsg.className = 'error-message';
                errorMsg.textContent = 'This field is required';
                field.insertAdjacentElement('afterend', errorMsg);
            }
        } else {
            field.classList.remove('error');
            // Remove error message if exists
            if (field.nextElementSibling?.classList.contains('error-message')) {
                field.nextElementSibling.remove();
            }
        }
    });

    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>Error</h3>
                <p>${message}</p>
            </div>
        `;
    }
}

function toggleMobileMenu() {
    const nav = document.getElementById('mainNav');
    const btn = document.getElementById('mobileMenuBtn');

    if (nav && btn) {
        nav.classList.toggle('active');
        btn.innerHTML = nav.classList.contains('active')
            ? '<i class="fas fa-times"></i>'
            : '<i class="fas fa-bars"></i>';
    }
}

// ======================
// INITIALIZATION
// ======================

// If on property details page, load the specific property
if (window.location.pathname.includes('property-details.html')) {
    const propertyId = new URLSearchParams(window.location.search).get('id');
    if (propertyId) {
        loadPropertyDetails(propertyId);
    }
}

async function loadPropertyDetails(id) {
    try {
        const response = await fetch(`/api/properties/${id}`);
        if (!response.ok) throw new Error('Property not found');

        const property = await response.json();
        renderPropertyDetails(property);
    } catch (error) {
        console.error('Error loading property:', error);
        showError('propertyDetailsContainer', 'Failed to load property details.');
    }
}

function renderPropertyDetails(property) {
    const container = document.getElementById('propertyDetailsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="property-gallery">
            <div class="main-image">
                <img src="/api/properties/images/${property.imageUrl || 'default.jpg'}"
                     alt="${property.title}">
            </div>
        </div>
        <div class="property-info">
            <h1>${property.title}</h1>
            <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
            <p class="price">₹${property.price.toLocaleString('en-IN')}</p>

            <div class="property-meta">
                <div class="meta-item">
                    <i class="fas fa-bed"></i>
                    <span>${property.bedrooms || '-'} Bedrooms</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-bath"></i>
                    <span>${property.bathrooms || '-'} Bathrooms</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-ruler-combined"></i>
                    <span>${property.area || '-'} sq.ft.</span>
                </div>
                <div class="meta-item">
                    <i class="fas fa-home"></i>
                    <span>${property.type}</span>
                </div>
            </div>

            <div class="property-description">
                <h3>Description</h3>
                <p>${property.description || 'No description provided.'}</p>
            </div>

            <button class="btn contact-btn" onclick="location.href='/contact.html?property=${property.id}'">
                Contact Owner
            </button>
        </div>
    `;
}