
import AdoptionApplication from '../models/adoption_application.model.js';
import Pet from '../models/pet.model.js';
// import User from '../models/user.model.js';


export default {
  getAllApplications: async (req, res) => {
    try {
      const query = req.user.isAdmin ? {} : { applicant: req.user._id };
      const applications = await AdoptionApplication.find(query)
        .populate('pet', 'name type breed')
        .populate('applicant', 'username email')
        .sort({ createdAt: -1 });

      return res.status(200).json(applications);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getUserApplications: async (req, res) => {
    try {
      const applications = await AdoptionApplication.find({ applicant: req.user._id })
        .populate('pet', 'name type breed')
        .sort({ createdAt: -1 });

      return res.status(200).json(applications);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  getApplicationById: async (req, res) => {
    try {
      const application = await AdoptionApplication.findById(req.params.id)
        .populate('pet', 'name type breed')
        .populate('applicant', 'username email');

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      };

      if (application.applicant.toString() !== req.user._id && !req.user.isAdmin) {
        return res.status(403).json({ message: 'Not authorized to view this application' });
      };

      return res.status(200).json(application);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  createApplication: async (req, res) => {
    try {
      const { petId } = req.body;

      const pet = await Pet.findById(petId);
      if (!pet) {
        return res.status(404).json({ message: 'Pet not found' });
      };

      const existingApplication = await AdoptionApplication.findOne({
        pet: petId,
        applicant: req.user._id
      });

      if (existingApplication) {
        return res.status(400).json({ message: 'You already have an application for this pet' });
      };

      const application = new AdoptionApplication({
        pet: petId,
        applicant: req.user._id,
        answers: req.body.answers
      });

      const savedApplication = await application.save();

      return res.status(201).json(savedApplication);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateApplicationStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!req.user.isAdmin && req.user.role !== 'ShelterStaff') {
        return res.status(403).json({ message: 'Not authorized to update application status' });
      };

      const application = await AdoptionApplication.findByIdAndUpdate(
        req.params.id,
        { status, reviewedAt: new Date(), reviewedBy: req.user._id },
        { new: true }
      );

      if (!application) {
        return res.status(404).json({ message: 'Application not found' });
      };

      return res.status(200).json(application);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  updateApplication: async (req, res) => {
    try {
      const application = await AdoptionApplication.findOneAndUpdate(
        { _id: req.params.id, applicant: req.user._id },
        req.body,
        { new: true }
      );

      if (!application) {
        return res.status(404).json({ message: 'Application not found or you are not the applicant' });
      };

      return res.status(200).json(application);
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  },

  deleteApplication: async (req, res) => {
    try {
      const application = await AdoptionApplication.findOneAndDelete({
        _id: req.params.id,
        $or: [
          { applicant: req.user._id },
          { reviewedBy: req.user._id }
        ]
      });

      if (!application) {
        return res.status(404).json({ message: 'Application not found or you are not authorized to delete it' });
      };

      return res.status(200).json({ message: 'Application deleted successfully' });
    } 
    catch (error) {
      return res.status(500).json({ message: error.message });
    };
  }

};

