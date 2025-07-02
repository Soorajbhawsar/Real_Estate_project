// Property Data
//const properties = [
//    {
//        id: 1,
//        title: "Luxury Apartment in Bandra",
//        location: "Bandra West, Mumbai",
//        price: "₹2,50,00,000",
//        bedrooms: 3,
//        bathrooms: 2,
//        area: "1800 sq.ft.",
//        type: "apartment",
//        purpose: "buy",
//        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//        date: "2023-05-15"
//    },
//    {
//        id: 2,
//        title: "Modern Villa in Whitefield",
//        location: "Whitefield, Bangalore",
//        price: "₹4,75,00,000",
//        bedrooms: 4,
//        bathrooms: 3,
//        area: "3200 sq.ft.",
//        type: "villa",
//        purpose: "buy",
//        image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//        date: "2023-06-20"
//    },
//    {
//        id: 3,
//        title: "Residential Plot in Gurgaon",
//        location: "Sector 56, Gurgaon",
//        price: "₹95,00,000",
//        bedrooms: 0,
//        bathrooms: 0,
//        area: "2400 sq.ft.",
//        type: "plot",
//        purpose: "buy",
//        image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//        date: "2023-04-10"
//    },
//    {
//        id: 4,
//        title: "Premium Office Space",
//        location: "BKC, Mumbai",
//        price: "₹8,20,00,000",
//        bedrooms: 0,
//        bathrooms: 4,
//        area: "5000 sq.ft.",
//        type: "commercial",
//        purpose: "rent",
//        image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//        date: "2023-07-05"
//    },
//    {
//        id: 5,
//        title: "2BHK Apartment in Hyderabad",
//        location: "Gachibowli, Hyderabad",
//        price: "₹1,20,00,000",
//        bedrooms: 2,
//        bathrooms: 2,
//        area: "1200 sq.ft.",
//        type: "apartment",
//        purpose: "buy",
//        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//        date: "2023-03-22"
//    },
//    {
//        id: 6,
//        title: "Farmhouse on Outskirts",
//        location: "Lonavala, Maharashtra",
//        price: "₹3,50,00,000",
//        bedrooms: 5,
//        bathrooms: 4,
//        area: "2 acres",
//        type: "villa",
//        purpose: "rent",
//        image: "https://images.unsplash.com/photo-1600566752355-35792bedcfea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
//        date: "2023-07-18"
//    }
//];

// Brokers Data
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

    // Only run these if the elements exist on the page
    if (document.getElementById('propertiesContainer')) {
        displayProperties();
    }

    if (document.getElementById('brokersContainer')) {
        displayBrokers();
    }

    if (document.getElementById('propertySearchForm')) {
        document.getElementById('propertySearchForm').addEventListener('submit', function(e) {
            e.preventDefault();
            filterProperties();
        });
    }

    if (document.getElementById('brokerSearchForm')) {
        document.getElementById('brokerSearchForm').addEventListener('submit', function(e) {
            e.preventDefault();
            filterBrokers();
        });
    }

    if (document.getElementById('filterToggle')) {
        document.getElementById('filterToggle').addEventListener('click', function() {
            document.getElementById('filterPanel').classList.toggle('active');
        });
    }
});

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

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm();
        });
    }

    // Property Listing Form Submission
    const propertyListingForm = document.getElementById('propertyListingForm');
    if (propertyListingForm) {
        propertyListingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handlePropertyListing();
        });
    }

    // Valuation Form Submission
    const valuationForm = document.getElementById('valuationForm');
    if (valuationForm) {
        valuationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleValuationForm();
        });
    }

    // Newsletter Form Submission
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletter();
        });
    }
}

// Display Properties
function displayProperties(propertyList = properties) {
    const propertiesContainer = document.getElementById('propertiesContainer');
    if (!propertiesContainer) return;

    propertiesContainer.innerHTML = '';

    if (propertyList.length === 0) {
        propertiesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <h3>No properties match your search criteria.</h3>
                <p>Try adjusting your filters or <a href="contact.html">contact us</a> for personalized assistance.</p>
            </div>
        `;
        return;
    }

    propertyList.forEach(property => {
        const propertyCard = document.createElement('div');
        propertyCard.className = 'property-card';
        propertyCard.innerHTML = `
            <div class="property-img">
                <span class="property-tag">${property.purpose === 'buy' ? 'For Sale' : 'For Rent'}</span>
                <img src="${property.image}" alt="${property.title}">
            </div>
            <div class="property-info">
                <h3>${property.title}</h3>
                <p class="location"><i class="fas fa-map-marker-alt"></i> ${property.location}</p>
                <p class="price">${property.price} ${property.purpose === 'rent' ? '/ month' : ''}</p>
                <div class="details">
                    <span><i class="fas fa-bed"></i> ${property.bedrooms} Beds</span>
                    <span><i class="fas fa-bath"></i> ${property.bathrooms} Baths</span>
                    <span><i class="fas fa-ruler-combined"></i> ${property.area}</span>
                </div>
                <a href="contact.html" class="btn" onclick="localStorage.setItem('propertyInquiry', '${property.title}')">Inquire Now</a>
            </div>
        `;
        propertiesContainer.appendChild(propertyCard);
    });
}

// Filter Properties
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
            const propertyPrice = parseInt(property.price.replace(/[^0-9]/g, ''));
            return propertyPrice <= parseInt(price);
        });
    }

    // Sorting
    if (sort) {
        switch(sort) {
            case 'price_asc':
                filteredProperties.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                    return priceA - priceB;
                });
                break;
            case 'price_desc':
                filteredProperties.sort((a, b) => {
                    const priceA = parseInt(a.price.replace(/[^0-9]/g, ''));
                    const priceB = parseInt(b.price.replace(/[^0-9]/g, ''));
                    return priceB - priceA;
                });
                break;
            case 'newest':
                filteredProperties.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
    }

    displayProperties(filteredProperties);
}

// Display Brokers
function displayBrokers(brokerList = brokers) {
    const brokersContainer = document.getElementById('brokersContainer');
    if (!brokersContainer) return;

    brokersContainer.innerHTML = '';

    if (brokerList.length === 0) {
        brokersContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <h3>No brokers match your search criteria.</h3>
            </div>
        `;
        return;
    }

    brokerList.forEach(broker => {
        const brokerCard = document.createElement('div');
        brokerCard.className = 'broker-card';
        brokerCard.innerHTML = `
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
        `;
        brokersContainer.appendChild(brokerCard);
    });
}

// Filter Brokers
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

// Handle Contact Form
function handleContactForm() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Check if there's a property inquiry in localStorage
    const propertyInquiry = localStorage.getItem('propertyInquiry');
    if (propertyInquiry) {
        localStorage.removeItem('propertyInquiry');
    }

    // Here you would typically send this data to a server
    console.log('Form submitted:', {
        name,
        email,
        subject: propertyInquiry ? `Inquiry about ${propertyInquiry}` : subject,
        message: propertyInquiry ? `I'm interested in ${propertyInquiry}. ${message}` : message
    });

    alert('Thank you for your message! We will get back to you soon.');
    document.getElementById('contactForm').reset();
}

// Handle Property Listing Form
function handlePropertyListing() {
    const propertyType = document.getElementById('propertyType').value;
    const propertyLocation = document.getElementById('propertyLocation').value;
    const bedrooms = document.getElementById('bedrooms').value;
    const bathrooms = document.getElementById('bathrooms').value;
    const area = document.getElementById('area').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const ownerName = document.getElementById('ownerName').value;
    const ownerEmail = document.getElementById('ownerEmail').value;
    const ownerPhone = document.getElementById('ownerPhone').value;

    // Here you would typically send this data to a server
    console.log('Property listing submitted:', {
        propertyType,
        propertyLocation,
        bedrooms,
        bathrooms,
        area,
        price,
        description,
        ownerName,
        ownerEmail,
        ownerPhone
    });

    alert('Thank you for listing your property! Our team will contact you shortly to discuss further details.');
    document.getElementById('propertyListingForm').reset();
}

// Handle Valuation Form
function handleValuationForm() {
    const address = document.getElementById('valuationForm').querySelector('input[type="text"]').value;
    const name = document.getElementById('valuationForm').querySelectorAll('input[type="text"]')[1].value;
    const email = document.getElementById('valuationForm').querySelector('input[type="email"]').value;
    const phone = document.getElementById('valuationForm').querySelector('input[type="tel"]').value;

    // Here you would typically send this data to a server
    console.log('Valuation request:', {
        address,
        name,
        email,
        phone
    });

    alert('Thank you for your valuation request! Our expert will contact you within 24 hours.');
    document.getElementById('valuationForm').reset();
}

// Handle Newsletter
function handleNewsletter() {
    const email = document.getElementById('newsletterForm').querySelector('input[type="email"]').value;

    // Here you would typically send this data to a server
    console.log('Newsletter subscription:', email);

    alert('Thank you for subscribing to our newsletter!');
    document.getElementById('newsletterForm').reset();
}
