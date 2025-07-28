package com.primeproperties.prime_properties.Service;



import com.primeproperties.prime_properties.Model.Property;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public interface PropertyService {
    Property saveProperty(Property property, MultipartFile imageFile);
    List<Property> getAllProperties();
    Property getPropertyById(Long id);
    List<Property> getPropertiesByPurpose(String purpose);
    List<Property> searchProperties(String query);
}