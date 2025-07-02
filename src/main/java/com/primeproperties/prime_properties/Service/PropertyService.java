package com.primeproperties.prime_properties.Service;


import com.primeproperties.prime_properties.Model.Property;
import com.primeproperties.prime_properties.CustomException.PropertyNotFoundException;
import com.primeproperties.prime_properties.Repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    public Property getPropertyById(UUID id) {
        return propertyRepository.findById(id)
                .orElseThrow(() -> new PropertyNotFoundException("Property not found with id: " + id));
    }

    public Property createProperty(Property property) {
        return propertyRepository.save(property);
    }

    public Property updateProperty(UUID id, Property propertyDetails) {
        Property property = getPropertyById(id);
        property.setTitle(propertyDetails.getTitle());
        property.setLocation(propertyDetails.getLocation());
        property.setPrice(propertyDetails.getPrice());
        property.setBedrooms(propertyDetails.getBedrooms());
        property.setBathrooms(propertyDetails.getBathrooms());
        property.setArea(propertyDetails.getArea());
        property.setType(propertyDetails.getType());
        property.setPurpose(propertyDetails.getPurpose());
        property.setImageUrl(propertyDetails.getImageUrl());
        return propertyRepository.save(property);
    }

    public void deleteProperty(UUID id) {
        Property property = getPropertyById(id);
        propertyRepository.delete(property);
    }

    public List<Property> searchProperties(String location, String type, Double minPrice, Double maxPrice) {
        if (location != null && type != null && minPrice != null && maxPrice != null) {
            return propertyRepository.findByLocationContainingIgnoreCaseAndTypeAndPriceBetween(location, type, minPrice, maxPrice);
        } else if (location != null && type != null) {
            return propertyRepository.findByLocationContainingIgnoreCaseAndType(location, type);
        } else if (location != null) {
            return propertyRepository.findByLocationContainingIgnoreCase(location);
        } else if (type != null) {
            return propertyRepository.findByType(type);
        } else if (minPrice != null && maxPrice != null) {
            return propertyRepository.findByPriceBetween(minPrice, maxPrice);
        } else {
            return propertyRepository.findAll();
        }
    }
}