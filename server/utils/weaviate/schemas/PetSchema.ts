export default {
    name: "Pet",
    description: "A pet",
    properties: [
        {
            name: "name",
            dataType: "text" as const,
            description: "The name of the pet"
        },
        {
            name: "bio",
            dataType: "text" as const,
            description: "Biography of the pet"
        },
        {
            name: "type",
            dataType: "text" as const,
            description: "The type of the pet"
        },
        {
            name: "breed",
            dataType: "text" as const,
            description: "The breed of the pet"
        },
        {
            name: "sex",
            dataType: "text" as const,
            description: "The sex of the pet"
        },
        {
            name: "age",
            dataType: "int" as const,
            description: "The age of the pet"
        },
        {
            name: "size",
            dataType: "text" as const,
            description: "The size of the pet"
        },
        {
            name: "energyLevel",
            dataType: "text" as const,
            description: "The energy level of the pet"
        },
        {
            name: "spayedNeutered",
            dataType: "text" as const,
            description: "Whether the pet is spayed or neutered"
        },
        {
            name: "compatibility",
            dataType: "text[]" as const,
            description: "Compatibility information"
        },
        {
            name: "owner",
            dataType: "text" as const,
            description: "The owner ID"
        },
        {
            name: "images",
            dataType: "text[]" as const,
            description: "Images of the pet"
        }
    ]
};
