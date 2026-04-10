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
      name: "age",
      dataType: "int" as const,
      description: "The age of the pet"
    },
    {
      name: "type",
      dataType: "text" as const,
      description: "The type of the pet"
    }
  ]
};

