import React, { useState, useEffect } from 'react';
import { useBooking } from './Root';
import { useNavigate } from 'react-router';
import { MapPin, Search, Calendar, Users, ChevronRight, ClipboardList, CheckSquare, HelpCircle } from 'lucide-react';
import { MapWidget } from '../components/MapWidget';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { HelpSupportModal } from '../components/HelpSupportModal';
import { PriceCalendar } from '../components/PriceCalendar';
import { toast } from 'sonner';

const destinations = [
  { name: 'Tokyo, Japan', code: 'HND', lat: 35.5494, lng: 139.7798 },
  { name: 'London, UK', code: 'LHR', lat: 51.4700, lng: -0.4543 },
  { name: 'New York, USA', code: 'JFK', lat: 40.6413, lng: -73.7781 },
  { name: 'Paris, France', code: 'CDG', lat: 49.0097, lng: 2.5479 },
  { name: 'Sydney, Australia', code: 'SYD', lat: -33.9399, lng: 151.1753 },
  { name: 'Dubai, UAE', code: 'DXB', lat: 25.2532, lng: 55.3657 },
  { name: 'Singapore', code: 'SIN', lat: 1.3644, lng: 103.9915 },
  { name: 'Hong Kong', code: 'HKG', lat: 22.3080, lng: 113.9185 },
  { name: 'Barcelona, Spain', code: 'BCN', lat: 41.2974, lng: 2.0833 },
  { name: 'Rome, Italy', code: 'FCO', lat: 41.8003, lng: 12.2389 },
  { name: 'Amsterdam, Netherlands', code: 'AMS', lat: 52.3105, lng: 4.7683 },
  { name: 'Frankfurt, Germany', code: 'FRA', lat: 50.0379, lng: 8.5622 },
  { name: 'Miami, USA', code: 'MIA', lat: 25.7959, lng: -80.2870 },
  { name: 'Boston, USA', code: 'BOS', lat: 42.3656, lng: -71.0096 },
  { name: 'Seattle, USA', code: 'SEA', lat: 47.4502, lng: -122.3088 },
];

const origins = [
  { name: 'San Francisco, USA', code: 'SFO' },
  { name: 'Los Angeles, USA', code: 'LAX' },
  { name: 'Chicago, USA', code: 'ORD' },
  { name: 'New York, USA', code: 'JFK' },
  { name: 'Dallas, USA', code: 'DFW' },
  { name: 'Denver, USA', code: 'DEN' },
  { name: 'Atlanta, USA', code: 'ATL' },
  { name: 'Phoenix, USA', code: 'PHX' },
  { name: 'Las Vegas, USA', code: 'LAS' },
  { name: 'Houston, USA', code: 'IAH' },
];

export function Home() {
  const { state, updateState } = useBooking();
  const navigate = useNavigate();
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [selectedDest, setSelectedDest] = useState<typeof destinations[0] | null>(null);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showPriceCalendar, setShowPriceCalendar] = useState(false);
  const [showReturnCalendar, setShowReturnCalendar] = useState(false);

  const filteredOrigins = origins.filter(o => o.name.toLowerCase().includes(originSearch.toLowerCase()) || o.code.toLowerCase().includes(originSearch.toLowerCase())).slice(0, 5);
  const filteredDestinations = destinations.filter(d => d.name.toLowerCase().includes(destSearch.toLowerCase()) || d.code.toLowerCase().includes(destSearch.toLowerCase())).slice(0, 5);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Use the current search values if origin/destination aren't set
    const origin = state.origin || originSearch;
    const destination = state.destination || destSearch;

    if (origin && destination && state.date && (state.tripType === 'oneway' || state.returnDate)) {
      // Update state with the values if they're not already set
      if (!state.origin) updateState({ origin });
      if (!state.destination) updateState({ destination });
      navigate('/flights');
    } else {
      toast.error('Please fill in all required fields.');
    }
  };

  const handleFeaturedCardClick = (destinationName: string) => {
    updateState({ destination: destinationName });
    toast.success(`Destination set to ${destinationName}!`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden h-[400px] group">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1768346564210-f382cdf18375?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhaXJwbGFuZSUyMGludGVyaW9yJTIwbHV4dXJ5JTIwY2FiaW58ZW58MXx8fHwxNzc0Mjg1NTk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Modern airplane interior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-neutral-900/40 to-transparent flex flex-col justify-end p-12">
          <h1 className="text-5xl font-bold text-white mb-4">Your Next Journey Starts Here</h1>
          <p className="text-xl text-neutral-200 max-w-xl">
            Book your flights with complete price transparency and a seamless experience.
          </p>
        </div>
      </div>

      {/* Search Interface */}
      <div className="bg-white p-8 rounded-3xl shadow-xl -mt-24 relative z-10 border border-neutral-100">
        <div className="flex gap-4 mb-6">
          <button 
            type="button"
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${state.tripType === 'round' ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            onClick={() => updateState({ tripType: 'round' })}
          >
            Round Trip
          </button>
          <button 
            type="button"
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${state.tripType === 'oneway' ? 'bg-blue-600 text-white shadow-md' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}
            onClick={() => updateState({ tripType: 'oneway' })}
          >
            One Way
          </button>
        </div>
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Origin */}
          <div className="relative lg:col-span-1">
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">From Where?</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type Origin..."
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-neutral-900 font-semibold shadow-sm"
                value={showOriginDropdown ? originSearch : state.origin || originSearch}
                onChange={(e) => {
                  setOriginSearch(e.target.value);
                  if (!showOriginDropdown) setShowOriginDropdown(true);
                }}
                onFocus={() => {
                  setShowOriginDropdown(true);
                  setOriginSearch('');
                }}
                onBlur={() => setTimeout(() => setShowOriginDropdown(false), 200)}
              />
              <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${showOriginDropdown ? 'text-blue-500' : 'text-neutral-400'}`} size={20} />
            </div>
            {showOriginDropdown && filteredOrigins.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border border-neutral-200 rounded-xl shadow-2xl z-20 py-2">
                {filteredOrigins.map((o) => (
                  <button
                    key={o.code}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center gap-3 group"
                    onMouseDown={() => {
                      updateState({ origin: o.name });
                      setOriginSearch('');
                      setShowOriginDropdown(false);
                    }}
                  >
                    <MapPin size={16} className="text-neutral-400 group-hover:text-blue-500" />
                    <div>
                      <div className="font-semibold text-neutral-900">{o.name}</div>
                      <div className="text-xs text-neutral-500">{o.code}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative lg:col-span-1">
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">To Where?</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Type Destination..."
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none text-neutral-900 font-semibold shadow-sm"
                value={showDestDropdown ? destSearch : state.destination || destSearch}
                onChange={(e) => {
                  setDestSearch(e.target.value);
                  if (!showDestDropdown) setShowDestDropdown(true);
                }}
                onFocus={() => {
                  setShowDestDropdown(true);
                  setDestSearch('');
                }}
                onBlur={() => setTimeout(() => setShowDestDropdown(false), 200)}
              />
              <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${showDestDropdown ? 'text-blue-500' : 'text-neutral-400'}`} size={20} />
            </div>
            {showDestDropdown && filteredDestinations.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 w-80 bg-white border border-neutral-200 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col">
                <div className="p-2 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
                  <span className="text-xs font-bold text-neutral-500 uppercase px-2">Results</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {filteredDestinations.map((d) => (
                    <button
                      key={d.code}
                      type="button"
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors flex items-center justify-between group"
                      onMouseEnter={() => setSelectedDest(d)}
                      onMouseDown={() => {
                        updateState({ destination: d.name });
                        setDestSearch('');
                        setShowDestDropdown(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-neutral-400 group-hover:text-blue-500" />
                        <div>
                          <div className="font-semibold text-neutral-900">{d.name}</div>
                          <div className="text-xs text-neutral-500">{d.code}</div>
                        </div>
                      </div>
                      {selectedDest?.code === d.code && <ChevronRight size={16} className="text-blue-500" />}
                    </button>
                  ))}
                </div>
                {selectedDest && (
                  <div className="h-48 border-t border-neutral-100 p-2 bg-neutral-50 shrink-0">
                    <MapWidget lat={selectedDest.lat} lng={selectedDest.lng} name={selectedDest.name} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Date */}
          <div className="lg:col-span-1 relative">
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Departure</label>
            <div className="relative">
              <input
                type="text"
                readOnly
                placeholder="Select date..."
                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none font-semibold shadow-sm text-neutral-900 cursor-pointer"
                value={state.date ? new Date(state.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                onClick={() => setShowPriceCalendar(!showPriceCalendar)}
                onFocus={() => setShowPriceCalendar(true)}
              />
              <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${showPriceCalendar ? 'text-blue-500' : 'text-neutral-400'}`} size={20} />
            </div>
            {showPriceCalendar && (
              <>
                <div 
                  className="fixed inset-0 z-20"
                  onClick={() => setShowPriceCalendar(false)}
                />
                <PriceCalendar
                  selectedDate={state.date}
                  onSelectDate={(date) => updateState({ date })}
                  onClose={() => setShowPriceCalendar(false)}
                />
              </>
            )}
          </div>

          {/* Return Date */}
          {state.tripType === 'round' && (
            <div className="lg:col-span-1 relative">
              <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Return</label>
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  placeholder="Select return date..."
                  className="w-full h-14 pl-12 pr-4 bg-white border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none font-semibold shadow-sm text-neutral-900 cursor-pointer"
                  value={state.returnDate ? new Date(state.returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                  onClick={() => setShowReturnCalendar(!showReturnCalendar)}
                  onFocus={() => setShowReturnCalendar(true)}
                />
                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 ${showReturnCalendar ? 'text-blue-500' : 'text-neutral-400'}`} size={20} />
              </div>
              {showReturnCalendar && (
                <>
                  <div 
                    className="fixed inset-0 z-20"
                    onClick={() => setShowReturnCalendar(false)}
                  />
                  <PriceCalendar
                    selectedDate={state.returnDate}
                    onSelectDate={(date) => updateState({ returnDate: date })}
                    onClose={() => setShowReturnCalendar(false)}
                    minDate={state.date}
                  />
                </>
              )}
            </div>
          )}

          {/* Passengers & Search */}
          <div className={`flex flex-col ${state.tripType === 'oneway' ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
            <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase tracking-wide">Passengers</label>
            <div className="flex gap-2 h-14">
              <div className="relative flex-1 h-full">
                <input
                  type="number"
                  min="1"
                  max="9"
                  className="w-full h-full pl-12 pr-4 bg-white border-2 border-neutral-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all outline-none font-semibold shadow-sm text-neutral-900"
                  value={state.passengers}
                  onChange={(e) => updateState({ passengers: parseInt(e.target.value) || 1 })}
                />
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
              </div>
              <button
                type="submit"
                className="h-full w-14 lg:w-full lg:max-w-[80px] bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center shadow-lg shadow-blue-200 group flex-shrink-0"
              >
                <Search size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Featured Locations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Best Value Tokyo", destination: "Tokyo, Japan", price: 649, img: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf" },
          { title: "Explore London", destination: "London, UK", price: 580, img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad" },
          { title: "Romance in Paris", destination: "Paris, France", price: 612, img: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34" }
        ].map((loc, i) => (
          <div key={i} className="group cursor-pointer" onClick={() => handleFeaturedCardClick(loc.destination)}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
              <ImageWithFallback src={loc.img} alt={loc.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-bold text-neutral-900 shadow-sm">
                From ${loc.price}
              </div>
            </div>
            <h3 className="text-xl font-bold text-neutral-900 group-hover:text-blue-600 transition-colors">{loc.title}</h3>
            <p className="text-neutral-500 text-sm">Non-stop flights available daily</p>
          </div>
        ))}
      </div>

      {/* Bottom Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <button
          onClick={() => navigate('/manage')}
          className="flex items-start gap-4 p-6 rounded-2xl border border-neutral-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <ClipboardList size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Manage Booking</h3>
            <p className="text-sm text-neutral-500">View or modify your reservation</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/checkin')}
          className="flex items-start gap-4 p-6 rounded-2xl border border-neutral-200 bg-white hover:border-green-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CheckSquare size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Check-In</h3>
            <p className="text-sm text-neutral-500">Get your boarding pass online</p>
          </div>
        </button>

        <button
          onClick={() => setShowHelpModal(true)}
          className="flex items-start gap-4 p-6 rounded-2xl border border-neutral-200 bg-white hover:border-purple-500 hover:shadow-lg transition-all text-left group"
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-neutral-900 mb-1">Help & Support</h3>
            <p className="text-sm text-neutral-500">24/7 customer assistance</p>
          </div>
        </button>
      </div>

      <HelpSupportModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
}