// Global variables
let properties = []; // Will be populated from backend
const brokers = [
    {
        id: 1,
        name: "Rahul Sharma",
        specialty: "Luxury Properties",
        location: "Mumbai",
        experience: 12,
        propertiesSold: 245,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        phone: "+91 98765 43210",
        email: "rahul@primeproperties.com"
    },
    {
        id: 2,
        name: "Priya Patel",
        specialty: "Commercial Real Estate",
        location: "Delhi",
        experience: 8,
        propertiesSold: 178,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        phone: "+91 87654 32109",
        email: "priya@primeproperties.com"
    },
    {
        id: 3,
        name: "Amit Kumar",
        specialty: "Residential Properties",
        location: "Bangalore",
        experience: 6,
        propertiesSold: 132,
        image: "https://randomuser.me/api/portraits/men/75.jpg",
        phone: "+91 76543 21098",
        email: "amit@primeproperties.com"
    },
    {
        id: 4,
        name: "Neha Gupta",
        specialty: "Investment Properties",
        location: "Hyderabad",
        experience: 10,
        propertiesSold: 210,
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        phone: "+91 65432 10987",
        email: "neha@primeproperties.com"
    }
];

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();

    // Load properties from backend if on properties page
    if (document.getElementById('propertiesContainer')) {
        loadProperties();
    }

    // Display brokers if on brokers page
    if (document.getElementById('brokersContainer')) {
        displayBrokers();
    }

    // Setup form submissions
    setupFormHandlers();
});

// ======================
// PROPERTY FUNCTIONS
// ======================

// Load properties from backend
async function loadProperties() {
    try {
        const response = await fetch('http://localhost:8080/api/properties');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        properties = await response.json();
        displayProperties(properties);
    } catch (error) {
        console.error('Error loading properties:', error);
        const container = document.getElementById('propertiesContainer');
        if (container) {
            container.innerHTML = `
                <div class="error-message">
                    <h3>Error loading properties</h3>
                    <p>${error.message}</p>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
}

// Display properties
function displayProperties(propertyList = []) {
    const container = document.getElementById('propertiesContainer');
    if (!container) return;

    if (propertyList.length === 0) {
        container.innerHTML = `
            <div class="no-properties">
                <h3>No properties available</h3>
                <p>Check back later or list your own property.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = propertyList.map(property => `
        <div class="property-card">
            <div class="property-img">
                <img src="${property.imageUrl || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'}" alt="${property.title}">
                <span class="property-tag">For ${property.purpose === 'rent' ? 'Rent' : 'Sale'}</span>
            </div>
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">₹${property.price.toLocaleString('en-IN')}</p>
                <div class="details">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms || 'N/A'} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms || 'N/A'} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area || 'N/A'} sq.ft.</span>
                </div>
                <a href="property.html?id=${property.id}" class="btn">View Details</a>
            </div>
        </div>
    `).join('');
}

// Filter properties
function filterProperties() {
    const location = document.getElementById('location')?.value.toLowerCase();
    const type = document.getElementById('type')?.value;
    const purpose = document.getElementById('purpose')?.value;
    const price = document.getElementById('price')?.value;
    const bedrooms = document.getElementById('bedrooms')?.value;
    const sort = document.getElementById('sort')?.value;

    let filteredProperties = [...properties];

    if (location) {
        filteredProperties = filteredProperties.filter(property =>
            property.location.toLowerCase().includes(location)
        );
    }

    if (type) {
        filteredProperties = filteredProperties.filter(property =>
            property.type === type
        );
    }

    if (purpose) {
        filteredProperties = filteredProperties.filter(property =>
            property.purpose === purpose
        );
    }

    if (bedrooms) {
        if (bedrooms === '4+') {
            filteredProperties = filteredProperties.filter(property =>
                property.bedrooms >= 4
            );
        } else {
            filteredProperties = filteredProperties.filter(property =>
                property.bedrooms === parseInt(bedrooms)
            );
        }
    }

    if (price) {
        filteredProperties = filteredProperties.filter(property => {
            const propertyPrice = property.price; // Already a number from backend
            return propertyPrice <= parseInt(price);
        });
    }

    // Sorting
    if (sort) {
        switch(sort) {
            case 'price_asc':
                filteredProperties.sort((a, b) => a.price - b.price);
                break;
            case 'price_desc':
                filteredProperties.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
        }
    }

    displayProperties(filteredProperties);
}

// Handle property listing form submission
async function handlePropertyListing() {
    const form = document.getElementById('propertyListingForm');
    if (!form) return;

    const formData = {
        title: `${form.querySelector('#propertyType').value} in ${form.querySelector('#propertyLocation').value}`,
        location: form.querySelector('#propertyLocation').value,
        price: parseFloat(form.querySelector('#price').value),
        bedrooms: parseInt(form.querySelector('#bedrooms').value) || 0,
        bathrooms: parseInt(form.querySelector('#bathrooms').value) || 0,
        area: parseFloat(form.querySelector('#area').value),
        type: form.querySelector('#propertyType').value,
        purpose: 'sell',
        description: form.querySelector('#description').value,
        imageUrl: 'default-property.jpg',
        ownerName: form.querySelector('#ownerName').value,
        ownerEmail: form.querySelector('#ownerEmail').value,
        ownerPhone: form.querySelector('#ownerPhone').value
    };

    try {
        const response = await fetch('http://localhost:8080/api/properties', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit property');
        }

        const savedProperty = await response.json();
        alert('Property listed successfully!');

        // Redirect to properties page
        window.location.href = 'properties.html';

    } catch (error) {
        console.error('Error submitting property:', error);
        alert(`Error: ${error.message}`);
    }
}

// ======================
// BROKER FUNCTIONS
// ======================

// Display brokers
function displayBrokers(brokerList = brokers) {
    const container = document.getElementById('brokersContainer');
    if (!container) return;

    if (brokerList.length === 0) {
        container.innerHTML = `
            <div class="no-brokers">
                <h3>No brokers available</h3>
                <p>Please check back later.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = brokerList.map(broker => `
        <div class="broker-card">
            <div class="broker-img">
                <img src="${broker.image}" alt="${broker.name}">
            </div>
            <div class="broker-info">
                <h3>${broker.name}</h3>
                <span class="broker-specialty">${broker.specialty}</span>
                <p class="broker-location"><i class="fas fa-map-marker-alt"></i> ${broker.location}</p>
                <div class="broker-experience">
                    <span class="experience-badge">${broker.experience}+ Years Experience</span>
                </div>
                <div class="broker-contact">
                    <a href="tel:${broker.phone}"><i class="fas fa-phone"></i></a>
                    <a href="mailto:${broker.email}"><i class="fas fa-envelope"></i></a>
                    <a href="contact.html"><i class="fas fa-comment"></i></a>
                </div>
            </div>
        </div>
    `).join('');
}

// Filter brokers
function filterBrokers() {
    const location = document.getElementById('location')?.value.toLowerCase();
    const specialization = document.getElementById('specialization')?.value;
    const experience = document.getElementById('experience')?.value;

    let filteredBrokers = [...brokers];

    if (location) {
        filteredBrokers = filteredBrokers.filter(broker =>
            broker.location.toLowerCase().includes(location)
        );
    }

    if (specialization) {
        filteredBrokers = filteredBrokers.filter(broker =>
            broker.specialty.toLowerCase().includes(specialization)
        );
    }

    if (experience) {
        filteredBrokers = filteredBrokers.filter(broker =>
            broker.experience >= parseInt(experience)
        );
    }

    displayBrokers(filteredBrokers);
}

// ======================
// FORM HANDLERS
// ======================

// Setup all form handlers
function setupFormHandlers() {
    // Property Listing Form
    const propertyForm = document.getElementById('propertyListingForm');
    if (propertyForm) {
        propertyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await handlePropertyListing();
        });
    }

    // Property Search Form
    const propertySearchForm = document.getElementById('propertySearchForm');
    if (propertySearchForm) {
        propertySearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterProperties();
        });
    }

    // Broker Search Form
    const brokerSearchForm = document.getElementById('brokerSearchForm');
    if (brokerSearchForm) {
        brokerSearchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            filterBrokers();
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleContactForm();
        });
    }

    // Valuation Form
    const valuationForm = document.getElementById('valuationForm');
    if (valuationForm) {
        valuationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleValuationForm();
        });
    }

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleNewsletter();
        });
    }
}

// Handle contact form
function handleContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Check for property inquiry
    const propertyInquiry = localStorage.getItem('propertyInquiry');
    if (propertyInquiry) {
        localStorage.removeItem('propertyInquiry');
    }

    // Here you would send to backend
    console.log('Contact form submitted:', {
        name,
        email,
        subject: propertyInquiry ? `Inquiry about ${propertyInquiry}` : subject,
        message: propertyInquiry ? `I'm interested in ${propertyInquiry}. ${message}` : message
    });

    alert('Thank you for your message! We will get back to you soon.');
    document.getElementById('contactForm').reset();
}

// Handle valuation form
function handleValuationForm() {
    const address = document.querySelector('#valuationForm input[type="text"]').value;
    const name = document.querySelectorAll('#valuationForm input[type="text"]')[1].value;
    const email = document.querySelector('#valuationForm input[type="email"]').value;
    const phone = document.querySelector('#valuationForm input[type="tel"]').value;

    // Here you would send to backend
    console.log('Valuation request:', { address, name, email, phone });

    alert('Thank you for your valuation request! Our expert will contact you within 24 hours.');
    document.getElementById('valuationForm').reset();
}

// Handle newsletter form
function handleNewsletter() {
    const email = document.querySelector('#newsletterForm input[type="email"]').value;

    // Here you would send to backend
    console.log('Newsletter subscription:', email);

    alert('Thank you for subscribing to our newsletter!');
    document.getElementById('newsletterForm').reset();
}

// ======================
// UI FUNCTIONS
// ======================

// Setup all event listeners
function setupEventListeners() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Filter Toggle
    const filterToggle = document.getElementById('filterToggle');
    if (filterToggle) {
        filterToggle.addEventListener('click', () => {
            document.getElementById('filterPanel').classList.toggle('active');
        });
    }
}