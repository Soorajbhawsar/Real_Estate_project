package com.primeproperties.prime_properties.Model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.UUID;

@Entity
@Data
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer bedrooms;

    @Column(nullable = false)
    private Integer bathrooms;

    @Column(nullable = false)
    private Double area;

    @Column(nullable = false)
    private String type; // apartment, villa, plot, commercial

    @Column(nullable = false)
    private String purpose; // buy, rent

    @Column(nullable = false)
    private String imageUrl;
}