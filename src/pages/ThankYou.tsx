import { CheckCircle, Phone, Home, Star, Truck, Clock } from 'lucide-react';

export default function ThankYou({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">SafeMove</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 text-center mb-8 border border-gray-100">
            {/* Animated checkmark */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-[scale-in_0.4s_ease-out]">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Star className="w-4 h-4 text-white fill-current" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
              Thank You!
            </h1>
            <p className="text-xl text-gray-600 mb-2 font-medium">
              Your request has been submitted successfully.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              Our relocation expert will call you within{' '}
              <span className="text-orange-500 font-semibold">30 minutes</span> to discuss
              your move details and provide a personalized quote.
            </p>

            {/* What happens next */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4 text-center">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Phone,
                    color: 'bg-blue-100 text-blue-600',
                    step: '1',
                    title: 'Expert Callback',
                    desc: 'Our move specialist calls you within 30 minutes to understand your requirements.',
                  },
                  {
                    icon: Star,
                    color: 'bg-orange-100 text-orange-600',
                    step: '2',
                    title: 'Custom Quote',
                    desc: 'Receive a detailed, transparent quotation with no hidden charges.',
                  },
                  {
                    icon: CheckCircle,
                    color: 'bg-green-100 text-green-600',
                    step: '3',
                    title: 'Schedule & Confirm',
                    desc: 'Pick a convenient date and confirm your booking with our team.',
                  },
                  {
                    icon: Truck,
                    color: 'bg-teal-100 text-teal-600',
                    step: '4',
                    title: 'Stress-Free Move',
                    desc: 'Our professional team handles everything — packing, moving, and unpacking.',
                  },
                ].map((item) => (
                  <div key={item.step} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-400">STEP {item.step}</span>
                      </div>
                      <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={onBack}
                className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 font-semibold py-3 rounded-xl hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </button>
              <a
                href="tel:+911800000000"
                className="flex-1 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-200"
              >
                <Phone className="w-4 h-4" />
                Call Us Now
              </a>
            </div>
          </div>

          {/* Assurance badges */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { icon: Clock, label: '30-Min Callback', sub: 'Guaranteed' },
              { icon: CheckCircle, label: 'Free Quote', sub: 'No obligation' },
              { icon: Star, label: '4.9/5 Rating', sub: '12K+ Reviews' },
            ].map((b) => (
              <div
                key={b.label}
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <b.icon className="w-5 h-5 text-orange-500" />
                </div>
                <div className="text-sm font-bold text-gray-900">{b.label}</div>
                <div className="text-xs text-gray-400">{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} SafeMove Packers & Movers. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
