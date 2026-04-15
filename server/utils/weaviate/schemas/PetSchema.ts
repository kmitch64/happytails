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
    // {
    //   name: "images",
    //   dataType: "text[]" as const,
    //   description: "Images of the pet"
    // },
    {
      name: "careReminders",
      dataType: "object[]" as const,
      description: "Care reminders for the pet",
      nestedProperties: [
        {
          name: "type",
          dataType: "text" as const,
          description: "Reminder type (vaccination, medication, appointment, grooming)"
        },
        {
          name: "description",
          dataType: "text" as const,
          description: "Reminder description"
        },
        {
          name: "date",
          dataType: "date" as const,
          description: "Reminder date"
        },
        {
          name: "frequency",
          dataType: "text" as const,
          description: "Reminder frequency (daily, weekly, monthly, yearly, one-time)"
        },
        {
          name: "completed",
          dataType: "boolean" as const,
          description: "Whether the reminder is completed"
        }
      ]
    },
    {
      name: "medicalRecords",
      dataType: "object[]" as const,
      description: "Medical records of the pet",
      nestedProperties: [
        {
          name: "type",
          dataType: "text" as const,
          description: "Medical record type (vaccination, surgery, checkup, medication)"
        },
        {
          name: "description",
          dataType: "text" as const,
          description: "Medical record description"
        },
        {
          name: "date",
          dataType: "date" as const,
          description: "Medical record date"
        },
        {
          name: "veterinarian",
          dataType: "text" as const,
          description: "Name of the veterinarian"
        },
        {
          name: "notes",
          dataType: "text" as const,
          description: "Additional notes"
        }

      ]
    }
  ]
};
