import api from './api.js';

document.getElementById('propertyListingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const propertyData = {
        title: formData.get('title'),
        location: formData.get('location'),
        price: parseFloat(formData.get('price')),
        bedrooms: parseInt(formData.get('bedrooms')),
        bathrooms: parseInt(formData.get('bathrooms')),
        area: parseFloat(formData.get('area')),
        type: formData.get('type'),
        purpose: formData.get('purpose'),
        imageUrl: formData.get('imageUrl') || 'default-image.jpg',
        ownerName: formData.get('ownerName'),
        ownerEmail: formData.get('ownerEmail'),
        ownerPhone: formData.get('ownerPhone')
    };

    try {
        const response = await api.createProperty(propertyData);
        alert('Property listed successfully!');
        window.location.href = `property.html?id=${response.id}`;
    } catch (error) {
        console.error('Error listing property:', error);
        alert('Failed to list property. Please try again.');
    }
});