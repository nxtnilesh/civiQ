import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, AlertTriangle, CheckCircle, ArrowRight, Shield, Zap, Droplet, Trash2, Users, Activity, Target } from 'lucide-react';

const features = [
  {
    icon: <AlertTriangle className="w-8 h-8 text-amber-500" />,
    title: 'Report Instantly',
    description: 'See a pothole or broken streetlight? Snap a photo and notify authorities in seconds with our intuitive mobile-friendly tool.',
    color: 'bg-amber-50'
  },
  {
    icon: <MapPin className="w-8 h-8 text-primary" />,
    title: 'Precision Mapping',
    description: 'Pinpoint exactly where the problem is using our integrated interactive mapping system to ensure fast response times.',
    color: 'bg-primary/10'
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-emerald-500" />,
    title: 'Track Progress',
    description: 'Get real-time updates as your reported issues are reviewed, assigned, and successfully resolved by local authorities.',
    color: 'bg-emerald-50'
  }
];

const categories = [
  { name: 'Roads & Transit', icon: <MapPin className="w-6 h-6" />, color: 'bg-red-100 text-red-600' },
  { name: 'Water & Sanitation', icon: <Droplet className="w-6 h-6" />, color: 'bg-blue-100 text-blue-600' },
  { name: 'Electricity', icon: <Zap className="w-6 h-6" />, color: 'bg-amber-100 text-amber-600' },
  { name: 'Waste Management', icon: <Trash2 className="w-6 h-6" />, color: 'bg-emerald-100 text-emerald-600' },
  { name: 'Public Safety', icon: <Shield className="w-6 h-6" />, color: 'bg-purple-100 text-purple-600' },
  { name: 'Other Issues', icon: <Target className="w-6 h-6" />, color: 'bg-gray-100 text-gray-600' }
];

const stats = [
  { label: 'Issues Resolved', value: '15k+', icon: <CheckCircle className="w-5 h-5" /> },
  { label: 'Active Citizens', value: '50k+', icon: <Users className="w-5 h-5" /> },
  { label: 'Avg. Resolution Time', value: '48h', icon: <Activity className="w-5 h-5" /> }
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-gray-900 overflow-hidden pt-16">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center object-cover mix-blend-overlay opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-purple-600/30 mix-blend-multiply" />
        </div>

        {/* Floating Abstract Shapes */}
        <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute top-1/4 left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl z-0" />
        <motion.div animate={{ y: [0, 30, 0], rotate: [0, -10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-1/4 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl z-0" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8"
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-sm font-medium text-white tracking-wide uppercase">CiviQ Platform is Live</span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-4xl sm:text-6xl md:text-7xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight max-w-5xl"
          >
            Empowering Citizens to <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-primary to-purple-400">Improve Our City</span>
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="mt-8 max-w-2xl mx-auto text-xl md:text-2xl text-gray-300 font-light leading-relaxed"
          >
            A transparent, modern platform for reporting and managing civic issues. Together we can build safer, cleaner, and better communities.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <Link to="/report" className="group flex justify-center items-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] hover:-translate-y-1">
              Report an Issue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/dashboard" className="px-8 py-4 flex justify-center items-center bg-white text-black border border-white/20 rounded-xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md hover:-translate-y-1">
              Explore Live Map
            </Link>
          </motion.div>
        </div>

        {/* Wave Divider Bottom */}
        <div className="absolute bottom-0 w-full overflow-hidden leading-none">
          <svg className="relative block w-full h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C59.71,118,130.83,122.5,193.3,110.51,238.13,101.44,281.33,75.02,321.39,56.44Z" className="fill-gray-50"></path>
          </svg>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-primary font-bold tracking-wide uppercase text-sm mb-2">Simple Process</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-6">How CiviQ Works</h3>
            <p className="text-xl text-gray-600 font-light leading-relaxed">Making a difference in your neighborhood has never been easier. Three simple steps to a better community.</p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid lg:grid-cols-3 gap-10"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group relative bg-white rounded-3xl p-10 hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center shadow-sm mb-8 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="py-24 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Report Any Issue</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-16">Our platform intelligently categorizes issues to route them to the correct local authorities instantly.</p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100"
              >
                <div className={`w-14 h-14 ${cat.color} rounded-full flex items-center justify-center mb-4`}>
                  {cat.icon}
                </div>
                <span className="font-bold text-gray-800 text-sm text-center">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      /* Stats Section */
      <section className="py-12 bg-gray-50 relative z-10 -mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg border border-gray-100 shadow-gray-200/50"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                  {stat.icon}
                </div>
                <div className="text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-500 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="relative py-24 bg-primary overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1587474260580-589f81d596ea?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-multiply opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Ready to see a change?</h2>
          <p className="text-xl text-primary-100 mb-10 font-light">Join thousands of citizens who are actively making their neighborhoods cleaner, safer, and better for everyone.</p>
          <Link to="/register" className="inline-flex items-center justify-center px-10 py-5 bg-white text-primary rounded-xl font-bold text-xl hover:bg-gray-50 transition-colors shadow-2xl hover:scale-105 duration-300">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Simple Footer inside Home */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold text-white tracking-tight">Civic<span className="text-primary">Voice</span></span>
        </div>
        <p>© 2026 CiviQ Platform. Built for the community.</p>
      </footer>
    </div>
  );
}
