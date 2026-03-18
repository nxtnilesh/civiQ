import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Camera, MapPin, AlertCircle, FileText } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function ReportIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Roads');
  const [location, setLocation] = useState('');
  const [position, setPosition] = useState(null);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(latlng);
        },
        (err) => {
          setError('Unable to retrieve your location. Please check your browser permissions.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to report a civic issue.</p>
          <button onClick={() => navigate('/login')} className="px-6 py-3 bg-primary text-white rounded-lg font-bold">Go to Login</button>
      </div>
    )
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return position === null ? null : (
      <Marker position={position}></Marker>
    );
  };

  const MapUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
      if (center) {
        map.flyTo(center, 15);
      }
    }, [center, map]);
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!position) {
      setError('Please click on the map to mark the exact location.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let imageUrl = '';
      
      if (image) {
        const formData = new FormData();
        formData.append('image', image);
        const { data: uploadData } = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadData;
      }

      await api.post('/issues', {
        title,
        description,
        category,
        location,
        lat: position.lat,
        lng: position.lng,
        imageUrl
      });

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
      >
        <div className="bg-primary p-6 md:p-10 text-white">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <AlertCircle className="w-8 h-8" />
            Report a Civic Issue
          </h1>
          <p className="mt-2 text-primary-100 opacity-90 text-lg">Help us improve the community by reporting problems you encounter.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm font-medium border border-red-100 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FileText className="w-4 h-4 text-primary" /> Title
                </label>
                <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., Large pothole on Main St" />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none bg-white" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="Roads">Roads & Transport</option>
                  <option value="Water">Water & Sanitation</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Garbage">Garbage Collection</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 text-primary" /> Text Address/Landmark
                </label>
                <input type="text" required className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Specific address or landmark" />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <MapPin className="w-4 h-4 text-primary" /> Pinpoint on Map (Required)
                  </label>
                  <button type="button" onClick={handleGeolocation} className="text-xs font-bold text-primary hover:text-indigo-600 bg-primary/10 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
                    <MapPin className="w-3 h-3" /> Use My Location
                  </button>
                </div>
                <div className="h-44 rounded-xl overflow-hidden border border-gray-200 z-0 relative">
                  <MapContainer center={[40.7128, -74.0060]} zoom={13} scrollWheelZoom={true} className="h-full w-full relative z-0">
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                    {position && <MapUpdater center={position} />}
                  </MapContainer>
                </div>
                {!position && <p className="text-xs font-bold text-red-500 mt-2">Click on the map to drop a pin.</p>}
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea required rows={3} className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the issue in detail..." />
              </div>

            </div>
          </div>
          
          <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Camera className="w-4 h-4 text-primary" /> Photo Evidence (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer bg-gray-50 relative overflow-hidden group">
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <div className="space-y-1 text-center">
                    {preview ? (
                      <div className="relative w-full h-40">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                      </div>
                    ) : (
                      <>
                        <Camera className="mx-auto h-12 w-12 text-gray-400 group-hover:text-primary transition-colors" />
                        <div className="flex text-sm text-gray-600 justify-center">
                          <span className="relative cursor-pointer rounded-md font-medium text-primary hover:text-indigo-500 focus-within:outline-none">
                            Upload a file
                          </span>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="button"
              onClick={() => navigate('/dashboard')}
              className="mr-4 px-6 py-3 border border-gray-300 rounded-xl shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 rounded-xl shadow-md text-sm font-bold text-white bg-primary hover:bg-indigo-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
