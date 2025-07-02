package com.primeproperties.prime_properties.Repository;

import com.primeproperties.prime_properties.Model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PropertyRepository extends JpaRepository<Property, UUID>, JpaSpecificationExecutor<Property> {
    List<Property> findByLocationContainingIgnoreCase(String location);
    List<Property> findByType(String type);
    List<Property> findByPriceBetween(Double minPrice, Double maxPrice);

    List<Property> findByLocationContainingIgnoreCaseAndTypeAndPriceBetween(String location, String type, Double minPrice, Double maxPrice);

    List<Property> findByLocationContainingIgnoreCaseAndType(String location, String type);
}