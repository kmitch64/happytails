export default {
    name: "Pet",
    description: "A pet",
    properties: [
        {
            name: "name",
            dataType: "text",
            description: "The name of the pet"
        },
        {
            name: "bio",
            dataType: "text",
            description: "Biography of the pet"
        },
        {
            name: "type",
            dataType: "text",
            description: "The type of the pet"
        },
        {
            name: "breed",
            dataType: "text",
            description: "The breed of the pet"
        },
        {
            name: "sex",
            dataType: "text",
            description: "The sex of the pet"
        },
        {
            name: "age",
            dataType: "text",
            description: "The age of the pet"
        },
        {
            name: "size",
            dataType: "text",
            description: "The size of the pet"
        },
        {
            name: "energyLevel",
            dataType: "text",
            description: "The energy level of the pet"
        },
        {
            name: "spayedNeutered",
            dataType: "text",
            description: "Whether the pet is spayed or neutered"
        },
        {
            name: "compatibility",
            dataType: "text[]",
            description: "Compatibility information"
        },
        {
            name: "owner",
            dataType: "text",
            description: "The owner ID"
        },
        {
            name: "images",
            dataType: "text[]",
            description: "Images of the pet"
        }
    ]
};
