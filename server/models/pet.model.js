
import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Pet name is required']
  },
  bio: {
    type: String,
    required: [true, 'Pet bio is required']
  },
  type: {
    type: String,
    enum: {
      values: ['Dog', 'Cat', 'Bird', 'Reptile', 'SmallMammal', 'Other'],
      message: 'Invalid pet type'
    },
    required: [true, 'Pet type is required']
  },
  breed: {
    type: String,
    default: ''
  },
  sex: {
    type: String,
    enum: {
      values: ['M', 'F', 'Unknown'],
      message: 'Invalid sex value'
    },
    required: [true, 'Sex is required']
  },
  age: {
    type: String,
    required: [true, 'Age is required']
  },
  size: {
    type: String,
    enum: {
      values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      message: 'Invalid size value'
    },
    required: [true, 'Size is required']
  },
  energyLevel: {
    type: String,
    enum: {
      values: ['Low', 'Moderate', 'High', 'Very High'],
      message: 'Invalid energy level'
    },
    required: [true, 'Energy level is required']
  },
  spayedNeutered: {
    type: String,
    enum: {
      values: ['Y', 'N', 'Unknown'],
      message: 'Invalid spayed/neutered value'
    },
    required: [true, 'Spayed/neutered status is required']
  },
  compatibility: {
    type: [String],
    required: [true, 'Compatibility information is required']
  },
  images: [{
    data: String,
    contentType: String
  }],
  status: {
    type: String,
    enum: {
      values: ['Active', 'Deceased', 'Missing'],
      message: 'Invalid status value'
    },
    default: 'Active'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  careReminders: [{
    type: {
      type: String,
      enum: {
        values: ['vaccination', 'medication', 'appointment', 'grooming'],
        message: 'Invalid reminder type'
      },
      required: [true, 'Reminder type is required']
    },
    description: {
      type: String,
      required: [true, 'Reminder description is required']
    },
    date: {
      type: Date,
      required: [true, 'Reminder date is required']
    },
    frequency: {
      type: String,
      enum: {
        values: ['daily', 'weekly', 'monthly', 'yearly', 'one-time'],
        message: 'Invalid frequency value'
      },
      required: [true, 'Reminder frequency is required']
    },
    completed: {
      type: Boolean,
      default: false
    }
  }],
  medicalRecords: [{
    type: {
      type: String,
      enum: {
        values: ['vaccination', 'surgery', 'checkup', 'medication'],
        message: 'Invalid medical record type'
      },
      required: [true, 'Medical record type is required']
    },
    description: {
      type: String,
      required: [true, 'Medical record description is required']
    },
    date: {
      type: Date,
      required: [true, 'Medical record date is required']
    },
    veterinarian: {
      type: String
    },
    notes: {
      type: String
    }
  }],
  adoption_status: {
    type: String,
    enum: {
      values: ['Available', 'Adopted', 'Pending', 'Reserved', ''],
      message: 'Invalid adoption status value'
    },
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

petSchema.pre('save', function() {
  this.updatedAt = Date.now();
  // next();
});

export default mongoose.model('Pet', petSchema);
