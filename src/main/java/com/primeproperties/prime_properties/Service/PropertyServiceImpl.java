package com.primeproperties.prime_properties.Service;


import com.primeproperties.prime_properties.Model.Property;
import com.primeproperties.prime_properties.Repository.PropertyRepository;
import com.primeproperties.prime_properties.Storage.StorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropertyServiceImpl implements PropertyService {

    private final PropertyRepository propertyRepository;
    private final StorageService storageService;

    @Autowired
    public PropertyServiceImpl(PropertyRepository propertyRepository, StorageService storageService) {
        this.propertyRepository = propertyRepository;
        this.storageService = storageService;
    }

    @Override
    public Property saveProperty(Property property, MultipartFile imageFile) {
        if (imageFile != null && !imageFile.isEmpty()) {
            String imagePath = storageService.store(imageFile);
            property.setImagePath(imagePath);
        }

        property.setCreatedAt(LocalDateTime.now());
        return propertyRepository.save(property);
    }

    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @Override
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    @Override
    public List<Property> getPropertiesByPurpose(String purpose) {
        return propertyRepository.findByPurpose(purpose);
    }

    @Override
    public List<Property> searchProperties(String query) {
        return propertyRepository.findByLocationContaining(query);
    }
}