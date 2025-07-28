package com.primeproperties.prime_properties.Controller;

import com.primeproperties.prime_properties.Model.Property;
import com.primeproperties.prime_properties.Model.PropertyType;
import com.primeproperties.prime_properties.Service.PropertyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    private final PropertyService propertyService;

    @Autowired
    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @PostMapping
    public ResponseEntity<Property> createProperty(
            @RequestPart("property") Property property,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        Property savedProperty = propertyService.saveProperty(property, imageFile);
        return ResponseEntity.ok(savedProperty);
    }

    @GetMapping
    public ResponseEntity<List<Property>> getAllProperties() {
        List<Property> properties = propertyService.getAllProperties();
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Property> getPropertyById(@PathVariable Long id) {
        Property property = propertyService.getPropertyById(id);
        if (property != null) {
            return ResponseEntity.ok(property);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/purpose/{purpose}")
    public ResponseEntity<List<Property>> getPropertiesByPurpose(@PathVariable String purpose) {
        List<Property> properties = propertyService.getPropertiesByPurpose(purpose);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Property>> searchProperties(@RequestParam String query) {
        List<Property> properties = propertyService.searchProperties(query);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/types")
    public ResponseEntity<PropertyType[]> getPropertyTypes() {
        return ResponseEntity.ok(PropertyType.values());
    }
}