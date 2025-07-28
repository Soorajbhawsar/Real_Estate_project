package com.primeproperties.prime_properties.Model;


public enum PropertyType {
    APARTMENT("Apartment"),
    VILLA("Villa"),
    PLOT("Plot"),
    COMMERCIAL("Commercial"),
    HOUSE("House");

    private final String displayName;

    PropertyType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}