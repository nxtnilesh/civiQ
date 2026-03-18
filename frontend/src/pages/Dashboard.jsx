import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { MapPin, Clock, MessageSquare, ThumbsUp } from 'lucide-react';

export default function Dashboard() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const { data } = await api.get('/issues');
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const filteredIssues = filter === 'All' ? issues : issues.filter(issue => issue.category === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Civic Issues Explorer</h1>
          <p className="mt-2 text-gray-600">Discover and track problems reported in your community.</p>
        </div>
        
        <div className="flex flex-wrap gap-2 bg-white rounded-xl shadow-sm border border-gray-200 p-1.5">
          {['All', 'Roads', 'Water', 'Electricity', 'Garbage', 'Others'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${filter === cat ? 'bg-primary text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
      ) : filteredIssues.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-xl font-bold text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-500">There are no {filter !== 'All' ? filter.toLowerCase() : ''} issues reported yet.</p>
          <Link to="/report" className="mt-6 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-primary hover:bg-indigo-600 shadow-md hover:shadow-lg transition-all">Report an issue now</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredIssues.map((issue, index) => (
            <motion.div
              key={issue._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all border border-gray-100 overflow-hidden flex flex-col group"
            >
              <Link to={`/issue/${issue._id}`} className="block h-48 w-full overflow-hidden relative">
                {issue.imageUrl ? (
                  <img src={`http://localhost:5000${issue.imageUrl}`} alt={issue.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="h-full w-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                    <span className="text-gray-400 font-medium">No Image Provided</span>
                  </div>
                )}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </div>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">{issue.category}</span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(issue.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  <Link to={`/issue/${issue._id}`}>{issue.title}</Link>
                </h3>
                <p className="text-gray-600 text-sm flex items-center gap-1 mb-4">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{issue.location}</span>
                </p>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-grow">{issue.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                      <ThumbsUp className="w-4 h-4" /> {issue.upvotes?.length || 0}
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm font-medium">
                      <MessageSquare className="w-4 h-4" /> {issue.comments?.length || 0}
                    </div>
                  </div>
                  
                  <Link to={`/issue/${issue._id}`} className="text-sm font-bold text-primary hover:text-indigo-600 transition-colors">
                    View Details →
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
