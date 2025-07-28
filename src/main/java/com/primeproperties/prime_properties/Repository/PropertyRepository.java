package com.primeproperties.prime_properties.Repository;


import com.primeproperties.prime_properties.Model.Property;
import com.primeproperties.prime_properties.Model.PropertyType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByPurpose(String purpose);
    List<Property> findByPropertyType(PropertyType propertyType);
    List<Property> findByLocationContaining(String location);
}