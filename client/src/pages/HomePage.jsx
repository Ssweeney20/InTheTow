import { Link } from "react-router-dom"
import { Clock, CheckCircle, Star, Truck, Users, MapPin, TrendingUp, Search, Shield } from 'lucide-react'
import { useAuthContext } from "../hooks/useAuthContext";

const HomePage = () => {
  const { user } = useAuthContext()

  return (
    <main className="bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-20 md:pt-28 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
              Where drivers share what dispatch won't.
              <span className="pt-5 text-3xl block text-blue-200">Wait less. Drive more.</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              See what's ahead at every warehouse. Real wait times, parking info, and driver notes that save you hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              {!user && (
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start posting reviews
              </Link>)}
              <Link
                to="/warehouses"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-blue-700 transition-colors"
              >
                Browse warehouses
              </Link>
            </div>

            <p className="text-blue-200">
              Community powered by drivers across the U.S.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <Truck className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">15,000+</div>
              <div className="text-gray-600">Active Truckers</div>
            </div>
            <div>
              <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">8,500+</div>
              <div className="text-gray-600">Warehouses</div>
            </div>
            <div>
              <Star className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">45,000+</div>
              <div className="text-gray-600">Reviews</div>
            </div>
            <div>
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">125,000+</div>
              <div className="text-gray-600">Hours Saved</div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Props Section */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Truckers Choose InTheTow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get the inside scoop on every warehouse from drivers who've been there
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            <ValueCard 
              icon={Clock}
              title="Wait Smarter"
              description="See how long drivers actually waited compared to appointment times, so you can plan your stop with confidence."
            />
            <ValueCard 
              icon={MapPin}
              title="Parking & amenities"
              description="Overnight parking, restrooms, food options, and staging advice—at a glance."
            />
            <ValueCard 
              icon={Shield}
              title="Safety & security"
              description="Lighting, guard notes, and neighborhood tips from drivers who were there."
            />
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="mx-auto max-w-7xl px-4 py-20 text-center text-white">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Share a review. Save someone's shift.
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Quick, structured posts keep info consistent and useful for everyone.
          </p>
          {!user && (
          <Link
            to="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-4 text-lg font-semibold text-blue-700 hover:bg-gray-100 transition-colors shadow-lg"
          >
            Create a free account
          </Link>)}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold text-white">InTheTow</span>
              </div>
              <p className="text-gray-400">
                The trusted platform for truckers to share and discover warehouse experiences.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Truckers</h3>
              <ul className="space-y-2">
                <li><Link to="/warehouses" className="hover:text-white transition-colors">Find Warehouses</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors">Write Reviews</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">For Businesses</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Claim Your Warehouse</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Analytics Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Premium Features</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 InTheTow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

// Value Card Component
function ValueCard({ icon: IconComponent, title, description }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 hover:shadow-lg transition-shadow">
      <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
        <IconComponent className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}


export default HomePage