import React from 'react';
import { motion } from 'motion/react';
import { Leaf, ShieldCheck, MapPin, Heart, ShoppingBag, Globe, Users, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Leaf,
      title: "Sustainable Fashion",
      description: "Reducing textile waste by giving quality pre-loved clothing a second life. Every purchase saves water and reduces carbon emissions.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: MapPin,
      title: "Local Community",
      description: "Connecting South Africans across Cape Town, Jo'burg, Durban, and beyond. Support local sellers and find unique items in your city.",
      color: "bg-emerald-50 text-emerald-700"
    },
    {
      icon: ShieldCheck,
      title: "Safe & Secure",
      description: "Our verified seller system and secure payment gateways like PayFast and Yoco ensure a trustworthy experience for everyone.",
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      icon: Users,
      title: "Verified Sellers",
      description: "We reward our most active and reliable community members with the Verified Seller badge, ensuring quality and trust.",
      color: "bg-emerald-50 text-emerald-700"
    }
  ];

  const stats = [
    { label: "Water Saved", value: "2.5M Liters", icon: Globe },
    { label: "Active Users", value: "50k+", icon: Users },
    { label: "Items Listed", value: "120k+", icon: ShoppingBag },
    { label: "Local Hubs", value: "9 Provinces", icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-black text-gray-900">About ReWear</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-6">
            <Sparkles size={16} />
            <span>Proudly South African</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            The Future of <span className="text-emerald-600">Fashion</span> is Circular.
          </h2>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            ReWear is South Africa's premier destination for buying and selling pre-loved fashion. 
            We're on a mission to make sustainable style accessible to every South African.
          </p>
        </motion.section>

        {/* Mission Grid */}
        <section className="grid md:grid-cols-2 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-8 rounded-3xl border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group"
            >
              <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </section>

        {/* Stats Section */}
        <section className="bg-gray-900 rounded-[3rem] p-12 text-white mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-black mb-4">Our Impact</h3>
            <p className="text-gray-400">Together, we're making a real difference in the South African fashion landscape.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-emerald-400">
                  <stat.icon size={24} />
                </div>
                <div className="text-2xl font-black mb-1">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How it Works */}
        <section className="mb-20">
          <h3 className="text-3xl font-black text-gray-900 mb-12 text-center">How ReWear Works</h3>
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="text-emerald-600 font-black text-5xl mb-4 opacity-20">01</div>
                <h4 className="text-2xl font-black mb-4">List Your Items</h4>
                <p className="text-gray-500 leading-relaxed">
                  Take a few photos, set your price, and list your pre-loved items in minutes. 
                  Our smart pricing tool helps you find the perfect price based on condition.
                </p>
              </div>
              <div className="flex-1 bg-gray-100 aspect-video rounded-3xl overflow-hidden">
                <img src="https://picsum.photos/seed/list/800/450" alt="Listing" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse gap-8 items-center">
              <div className="flex-1">
                <div className="text-emerald-600 font-black text-5xl mb-4 opacity-20">02</div>
                <h4 className="text-2xl font-black mb-4">Safe Transactions</h4>
                <p className="text-gray-500 leading-relaxed">
                  Buyers pay securely through our platform. We hold the funds until the item is 
                  delivered and confirmed, protecting both parties.
                </p>
              </div>
              <div className="flex-1 bg-gray-100 aspect-video rounded-3xl overflow-hidden">
                <img src="https://picsum.photos/seed/secure/800/450" alt="Secure" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="text-emerald-600 font-black text-5xl mb-4 opacity-20">03</div>
                <h4 className="text-2xl font-black mb-4">Local Delivery</h4>
                <p className="text-gray-500 leading-relaxed">
                  Choose from door-to-door delivery with The Courier Guy or Aramex, 
                  or use Pargo Click & Collect for ultimate convenience.
                </p>
              </div>
              <div className="flex-1 bg-gray-100 aspect-video rounded-3xl overflow-hidden">
                <img src="https://picsum.photos/seed/delivery/800/450" alt="Delivery" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-emerald-600 rounded-[3rem] p-12 text-white">
          <h3 className="text-4xl font-black mb-6">Ready to join the revolution?</h3>
          <p className="text-emerald-100 mb-8 text-lg max-w-xl mx-auto">
            Start buying and selling today and be part of the most sustainable fashion community in South Africa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/sell')}
              className="bg-white text-emerald-600 px-8 py-4 rounded-2xl font-black text-lg hover:bg-emerald-50 transition-colors"
            >
              Start Selling
            </button>
            <button 
              onClick={() => navigate('/')}
              className="bg-emerald-700 text-white px-8 py-4 rounded-2xl font-black text-lg hover:bg-emerald-800 transition-colors"
            >
              Browse Shop
            </button>
          </div>
        </section>
      </main>

      {/* Footer Note */}
      <footer className="max-w-4xl mx-auto px-6 py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-sm font-medium">
          &copy; {new Date().getFullYear()} ReWear South Africa. Built for a better future.
        </p>
      </footer>
    </div>
  );
};

export default About;
