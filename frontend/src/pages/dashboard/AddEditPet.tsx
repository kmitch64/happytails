
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaw, faSave, faArrowLeft, faVenusMars, faBirthdayCake,
  faRuler, faBolt, faBriefcaseMedical, faDog, faCat,
  faPlus, faTimes
} from '@fortawesome/free-solid-svg-icons';

export default function AddEditPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    name: '',
    bio: '',
    sex: 'Unknown',
    age: '',
    size: 'M',
    energyLevel: 'Moderate',
    spayedNeutered: 'Unknown',
    compatibility: [] as string[],
    breed: '',
    type: 'Dog',
    images: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(!!id);
  const [error, setError] = useState('');

  // mocked
  useEffect(() => {
    if (id) {
      const fetchPet = async () => {
        try {
          setIsLoading(true);
          // const response = await fetch(`/api/pets/${id}`);
          // const data = await response.json();
          // setPet(data);

          const mockPet = {
            name: "Buddy",
            bio: "Buddy is our beloved family dog. He's a 3-year-old Golden Retriever who loves to play fetch and go for long walks.",
            sex: "M",
            age: "3 years",
            size: "L",
            energyLevel: "High",
            spayedNeutered: "Y",
            compatibility: ["Dogs", "Children"],
            breed: "Golden Retriever",
            type: "Dog",
            images: [
              "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Buddy+1",
              "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Buddy+2"
            ]
          };
          setPet(mockPet);
        } catch (err) {
          setError('Failed to load pet data');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };

      fetchPet();
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (type === 'checkbox') {
      if (checked) {
        setPet(prev => ({ ...prev, [name]: [...prev[name as keyof typeof pet], value] }));
      } else {
        setPet(prev => ({ ...prev, [name]: (prev[name as keyof typeof pet] as string[]).filter((item: string) => item !== value) }));
      }
    } else {
      setPet(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setPet(prev => ({ ...prev, images: [...prev.images, ...imageUrls] }));
  };

  const removeImage = (index: number) => {
    setPet(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // const method = id ? 'PUT' : 'POST';
      // const url = id ? `/api/pets/${id}` : '/api/pets';
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(pet)
      // });
      // const data = await response.json();

      console.log('Pet saved:', pet);
      navigate('/dashboard/my-pets');
    } catch (err) {
      setError('Failed to save pet profile');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="page-header">
          <button onClick={() => navigate('/dashboard/my-pets')} className="back-button">
            <FontAwesomeIcon icon={faArrowLeft} /> Back to My Pets
          </button>
          <h1>{id ? 'Edit' : 'Add'} Pet Profile</h1>
        </div>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page add-edit-pet">
      <div className="page-header">
        <button onClick={() => navigate('/dashboard/my-pets')} className="back-button">
          <FontAwesomeIcon icon={faArrowLeft} /> Back to My Pets
        </button>
        <h1>{id ? 'Edit' : 'Add'} Pet Profile</h1>
      </div>

      <div className="page-content">
        <form onSubmit={handleSubmit} className="pet-form">
          <div className="form-section">
            <h2>Basic Information</h2>

            <div className="form-group">
              <label htmlFor="name">Pet Name*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={pet.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="type">Pet Type*</label>
              <select
                id="type"
                name="type"
                value={pet.type}
                onChange={handleChange}
                required
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {pet.type !== 'Other' && (
              <div className="form-group">
                <label htmlFor="breed">Breed*</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  value={pet.breed}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Sex*</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="M"
                    checked={pet.sex === 'M'}
                    onChange={handleChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="F"
                    checked={pet.sex === 'F'}
                    onChange={handleChange}
                  />
                  Female
                </label>
                <label>
                  <input
                    type="radio"
                    name="sex"
                    value="Unknown"
                    checked={pet.sex === 'Unknown'}
                    onChange={handleChange}
                  />
                  Unknown
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="age">Age*</label>
              <input
                type="text"
                id="age"
                name="age"
                value={pet.age}
                onChange={handleChange}
                required
                placeholder="e.g., 3 years, 6 months"
              />
            </div>

            <div className="form-group">
              <label htmlFor="size">Size*</label>
              <select
                id="size"
                name="size"
                value={pet.size}
                onChange={handleChange}
                required
              >
                <option value="XS">Extra Small (&lt;10 lbs)</option>
                <option value="S">Small (10-20 lbs)</option>
                <option value="M">Medium (20-50 lbs)</option>
                <option value="L">Large (50-100 lbs)</option>
                <option value="XL">Extra Large (100+ lbs)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="energyLevel">Energy Level*</label>
              <select
                id="energyLevel"
                name="energyLevel"
                value={pet.energyLevel}
                onChange={handleChange}
                required
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            <div className="form-group">
              <label>Spayed/Neutered*</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="spayedNeutered"
                    value="Y"
                    checked={pet.spayedNeutered === 'Y'}
                    onChange={handleChange}
                  />
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name="spayedNeutered"
                    value="N"
                    checked={pet.spayedNeutered === 'N'}
                    onChange={handleChange}
                  />
                  No
                </label>
                <label>
                  <input
                    type="radio"
                    name="spayedNeutered"
                    value="Unknown"
                    checked={pet.spayedNeutered === 'Unknown'}
                    onChange={handleChange}
                  />
                  Unknown
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Compatibility</label>
              <div className="checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="compatibility"
                    value="Dogs"
                    checked={pet.compatibility.includes('Dogs')}
                    onChange={handleChange}
                  />
                  Good with Dogs
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="compatibility"
                    value="Cats"
                    checked={pet.compatibility.includes('Cats')}
                    onChange={handleChange}
                  />
                  Good with Cats
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="compatibility"
                    value="Children"
                    checked={pet.compatibility.includes('Children')}
                    onChange={handleChange}
                  />
                  Good with Children
                </label>
                <label>
                  <input
                    type="checkbox"
                    name="compatibility"
                    value="Other Pets"
                    checked={pet.compatibility.includes('Other Pets')}
                    onChange={handleChange}
                  />
                  Good with Other Pets
                </label>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Pet Bio</h2>
            <div className="form-group">
              <label htmlFor="bio">Tell us about your pet*</label>
              <textarea
                id="bio"
                name="bio"
                value={pet.bio}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Describe your pet's personality, habits, likes, dislikes, etc."
              />
            </div>
          </div>

          <div className="form-section">
            <h2>Photos</h2>
            <p>Add photos of your pet (max 5 photos)</p>

            <div className="image-upload">
              <label className="upload-button">
                <FontAwesomeIcon icon={faPlus} /> Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </label>

              {pet.images.length > 0 && (
                <div className="image-preview">
                  {pet.images.map((image, index) => (
                    <div key={index} className="image-thumbnail">
                      <img src={image} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={() => navigate('/dashboard/my-pets')}>
              Cancel
            </button>
            <button type="submit" className="save-button">
              <FontAwesomeIcon icon={faSave} /> {id ? 'Update' : 'Save'} Pet Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
