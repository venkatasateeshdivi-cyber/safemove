import { useState } from 'react';
import {
  Truck,
  Package,
  Shield,
  Star,
  Phone,
  MapPin,
  Calendar,
  Home,
  ChevronRight,
  CheckCircle,
  Clock,
  Award,
  Users,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface FormData {
  name: string;
  phone: string;
  email: string;
  from_location: string;
  to_location: string;
  move_date: string;
  move_type: string;
  property_size: string;
  message: string;
}

const initialForm: FormData = {
  name: '',
  phone: '',
  email: '',
  from_location: '',
  to_location: '',
  move_date: '',
  move_type: '',
  property_size: '',
  message: '',
};

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export default function PackersMovers({ onSuccess }: { onSuccess: () => void }) {
  const [form, setForm] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: dbError } = await supabase.from('leads').insert([
        {
          name: form.name,
          phone: form.phone,
          email: form.email,
          from_location: form.from_location,
          to_location: form.to_location,
          move_date: form.move_date || null,
          move_type: form.move_type,
          property_size: form.property_size,
          message: form.message,
        },
      ]);

      if (dbError) throw dbError;

      // Fire-and-forget: notify via edge function (email + sheets)
      fetch(`${SUPABASE_URL}/functions/v1/notify-lead`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      }).catch(() => {});

      onSuccess();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SafeMove</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#services" className="hover:text-orange-500 transition-colors">Services</a>
            <a href="#why-us" className="hover:text-orange-500 transition-colors">Why Us</a>
            <a href="#testimonials" className="hover:text-orange-500 transition-colors">Reviews</a>
            <a href="#quote" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
              Get Quote
            </a>
          </nav>
          <a
            href="tel:+911800000000"
            className="md:hidden flex items-center gap-1 text-orange-500 font-semibold text-sm"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-16 relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-[92vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="text-white">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 text-orange-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Star className="w-3.5 h-3.5 fill-current" />
              Trusted by 50,000+ Families
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Stress-Free
              <span className="block text-orange-400">Relocation</span>
              Services
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
              Professional packers and movers for households, offices, and vehicles. We handle
              everything — packing, loading, transporting, and unpacking — so you can focus on
              your new beginning.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {['100% Safe Delivery', 'GPS Tracking', 'Insurance Covered'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Cities', value: '200+' },
                { label: 'Happy Clients', value: '50K+' },
                { label: 'Years Experience', value: '15+' },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-white/10 rounded-xl p-4">
                  <div className="text-2xl font-bold text-orange-400">{stat.value}</div>
                  <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div id="quote" className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Get a Free Quote</h2>
              <p className="text-gray-500 text-sm mt-1">Fill the form and we'll call you back in 30 minutes</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Moving From *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="from_location"
                      value={form.from_location}
                      onChange={handleChange}
                      required
                      placeholder="City / Area"
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Moving To *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="to_location"
                      value={form.to_location}
                      onChange={handleChange}
                      required
                      placeholder="City / Area"
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Move Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="move_date"
                      value={form.move_date}
                      onChange={handleChange}
                      type="date"
                      className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Move Type *</label>
                  <select
                    name="move_type"
                    value={form.move_type}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                  >
                    <option value="">Select type</option>
                    <option value="Household">Household</option>
                    <option value="Office/Commercial">Office / Commercial</option>
                    <option value="Vehicle Transport">Vehicle Transport</option>
                    <option value="International">International</option>
                    <option value="Storage">Storage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Property Size *</label>
                <select
                  name="property_size"
                  value={form.property_size}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
                >
                  <option value="">Select size</option>
                  <option value="1 RK / Studio">1 RK / Studio</option>
                  <option value="1 BHK">1 BHK</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="3 BHK">3 BHK</option>
                  <option value="4+ BHK / Villa">4+ BHK / Villa</option>
                  <option value="Office (Small)">Office (Small)</option>
                  <option value="Office (Large)">Office (Large)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Additional Notes</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Any special requirements or details..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-orange-200"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Get Free Quote
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-center text-xs text-gray-400">
                No spam. We'll only contact you about your move.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Our Services</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              End-to-end relocation solutions tailored for every need and budget.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Home,
                title: 'Household Moving',
                desc: 'Complete home relocation with careful packing, safe transport, and systematic unpacking at your new home.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Package,
                title: 'Office Relocation',
                desc: 'Minimal downtime office moves with specialized handling for IT equipment, furniture, and documents.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: Truck,
                title: 'Vehicle Transport',
                desc: 'Safe and insured car and bike transport across India using enclosed carriers.',
                color: 'bg-orange-50 text-orange-600',
              },
              {
                icon: Shield,
                title: 'Insurance Coverage',
                desc: 'Comprehensive transit insurance ensuring your belongings are protected against damage or loss.',
                color: 'bg-red-50 text-red-600',
              },
              {
                icon: Clock,
                title: 'Express Moving',
                desc: 'Same-day and next-day move options for urgent relocations within the city and nearby areas.',
                color: 'bg-yellow-50 text-yellow-600',
              },
              {
                icon: Award,
                title: 'Storage Solutions',
                desc: 'Secure, climate-controlled warehousing for short-term or long-term storage of your belongings.',
                color: 'bg-teal-50 text-teal-600',
              },
            ].map((s) => (
              <div
                key={s.title}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Why Thousands Choose SafeMove
              </h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                We're not just movers — we're your relocation partners. With 15 years of experience,
                a fleet of 500+ vehicles, and a team of 5,000+ trained professionals, we deliver peace
                of mind with every move.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Shield, title: 'Zero Hidden Charges', desc: 'Transparent pricing with detailed written quotations before every move.' },
                  { icon: Users, title: 'Trained Professionals', desc: 'Verified, background-checked staff trained in safe packing techniques.' },
                  { icon: Clock, title: 'On-Time Guarantee', desc: 'We honor our schedules. Delays? You get compensation — no questions asked.' },
                  { icon: CheckCircle, title: 'Damage-Free Delivery', desc: '99.8% damage-free delivery record backed by full insurance coverage.' },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7464487/pexels-photo-7464487.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional movers"
                className="rounded-2xl shadow-xl w-full object-cover h-[480px]"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">50,000+</div>
                  <div className="text-sm text-gray-500">Successful Moves</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">What Clients Say</h2>
            <div className="flex items-center justify-center gap-1 text-yellow-400 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <p className="text-gray-500">4.9/5 average rating from 12,000+ reviews</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Ravi Sharma',
                location: 'Delhi to Mumbai',
                rating: 5,
                text: 'Absolutely seamless move. The team was punctual, careful with fragile items, and unpacked everything just as we wanted. Highly recommended!',
                avatar: 'RS',
                color: 'bg-blue-100 text-blue-700',
              },
              {
                name: 'Priya Nair',
                location: 'Bangalore to Hyderabad',
                rating: 5,
                text: "Best packers and movers I've ever used. Real-time GPS tracking gave me peace of mind. Everything arrived safe and on schedule.",
                avatar: 'PN',
                color: 'bg-pink-100 text-pink-700',
              },
              {
                name: 'Arjun Mehta',
                location: 'Chennai to Pune',
                rating: 5,
                text: "Moved my entire office without a single day of downtime. Their corporate moving team is truly professional. Will use SafeMove again.",
                avatar: 'AM',
                color: 'bg-green-100 text-green-700',
              },
            ].map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${t.color}`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-orange-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Move? Get Your Free Quote Today
          </h2>
          <p className="text-orange-100 mb-8">
            Our team is available 24/7 to help you plan your perfect move.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#quote"
              className="bg-white text-orange-500 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              Get Free Quote
            </a>
            <a
              href="tel:+911800000000"
              className="border-2 border-white text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4" />
              1800-000-0000
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold">SafeMove</span>
          </div>
          <p className="text-sm">© {new Date().getFullYear()} SafeMove Packers & Movers. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
