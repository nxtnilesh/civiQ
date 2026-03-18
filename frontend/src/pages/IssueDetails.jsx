import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { MapPin, Clock, MessageSquare, ThumbsUp, User, ArrowLeft, Send } from 'lucide-react';

export default function IssueDetails() {
  const { id } = useParams();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  const fetchIssue = async () => {
    try {
      const { data } = await api.get(`/issues/${id}`);
      setIssue(data);
    } catch (error) {
      setError('Failed to fetch issue details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssue();
  }, [id]);

  const handleUpvote = async () => {
    if (!user) return alert('Please login to upvote');
    try {
      await api.put(`/issues/${id}/upvote`);
      fetchIssue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await api.post(`/issues/${id}/comments`, { text: commentText });
      setCommentText('');
      fetchIssue();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (e) => {
    try {
      await api.put(`/issues/${id}/status`, { status: e.target.value });
      fetchIssue();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || 'Issue not found'}</h2>
        <Link to="/dashboard" className="text-primary hover:underline flex items-center justify-center gap-2 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const isUpvoted = user && issue.upvotes.includes(user._id);
  const isAdmin = user && user.role === 'authority';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Issues
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {issue.imageUrl && (
              <div className="w-full h-72 md:h-96 relative">
                <img src={`http://localhost:5000${issue.imageUrl}`} alt={issue.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary font-bold text-sm rounded-full tracking-wide uppercase">
                  {issue.category}
                </span>
                
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${issue.status === 'Pending' ? 'bg-amber-100 text-amber-800 border-amber-200' : issue.status === 'In Progress' ? 'bg-blue-100 text-blue-800 border-blue-200' : 'bg-green-100 text-green-800 border-green-200'}`}>
                  {issue.status}
                </span>
              </div>
              
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-4">{issue.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-gray-500 font-medium mb-8">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" />
                  {issue.author.username}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  {new Date(issue.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {issue.location}
                </div>
              </div>
              
              <div className="prose max-w-none text-gray-600">
                <p className="whitespace-pre-wrap leading-relaxed">{issue.description}</p>
              </div>
              
              <div className="pt-8 mt-8 border-t border-gray-100 flex items-center justify-between">
                <button 
                  onClick={handleUpvote}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-sm ${isUpvoted ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'}`}
                >
                  <ThumbsUp className={`w-5 h-5 ${isUpvoted ? 'fill-current' : ''}`} />
                  {isUpvoted ? 'Supported' : 'Support Issue'}
                  <span className="ml-2 bg-white px-2.5 py-0.5 rounded-md text-sm border shadow-sm">
                    {issue.upvotes.length}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8"
          >
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-gray-900">
              <MessageSquare className="w-6 h-6 text-primary" />
              Community Discussion ({issue.comments.length})
            </h3>
            
            {user ? (
              <form onSubmit={handleCommentSubmit} className="mb-8 relative">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts or updates..."
                  className="w-full px-4 py-4 pr-16 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-inner outline-none resize-none"
                  rows={3}
                  required
                />
                <button type="submit" className="absolute bottom-4 right-4 p-2 bg-primary text-white rounded-lg hover:bg-indigo-600 transition-colors shadow-sm">
                  <Send className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-gray-50 rounded-xl text-center border border-gray-100">
                <p className="text-gray-600">Please <Link to="/login" className="text-primary font-bold hover:underline">login</Link> to join the discussion.</p>
              </div>
            )}
            
            <div className="space-y-6">
              {issue.comments.length > 0 ? (
                issue.comments.map((comment, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-lg flex-shrink-0">
                      {comment.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-gray-900">{comment.user.username}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-600">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No comments yet. Be the first to start the discussion!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {isAdmin && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-sm border border-indigo-100 p-6 border-t-4 border-t-primary"
            >
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                Authority Area
              </h3>
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Update Status</label>
                <select 
                  value={issue.status} 
                  onChange={handleStatusChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary transition-all outline-none bg-white font-medium shadow-sm"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </motion.div>
          )}

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-gray-100 border-b border-gray-200">
              <h3 className="font-bold text-gray-700 flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" /> Location Map
              </h3>
            </div>
            <div className="h-64 bg-gray-200 relative flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=14&size=400x300&sensor=false')] bg-cover bg-center opacity-40 mix-blend-multiply placeholder-map grayscale"></div>
              <div className="z-10 flex flex-col items-center p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg m-4 text-center border border-white/50">
                <MapPin className="w-8 h-8 text-primary mb-2" />
                <span className="font-bold text-gray-900">{issue.location}</span>
                <span className="text-xs text-gray-500 mt-1">Map visualization active</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
