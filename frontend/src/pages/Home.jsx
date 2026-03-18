import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
    title: 'Report Issues Instantly',
    description: 'See a pothole or broken streetlight? Snap a photo and notify authorities in seconds.'
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: 'Location Tracking',
    description: 'Pinpoint exactly where the problem is using our integrated mapping system.'
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-secondary" />,
    title: 'Track Progress',
    description: 'Get real-time updates as your reported issues are reviewed and resolved.'
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative flex-grow flex items-center justify-center bg-dark overflow-hidden py-24">
        <div className="absolute inset-0 z-0 opacity-20">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-dark/80" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight"
          >
            Empowering Citizens to <br className="hidden sm:block" />
            <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Improve Our City</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl mx-auto text-xl text-gray-300"
          >
            A transparent platform for reporting and managing civic issues. Together we can build safer, cleaner, and better communities.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/report" className="group flex justify-center items-center gap-2 px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-indigo-600 transition-all shadow-lg hover:shadow-primary/30">
              Report an Issue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/dashboard" className="px-8 py-4 flex justify-center items-center bg-white/10 text-white border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-sm">
              View Issues
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Three simple steps to make a difference in your neighborhood.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
