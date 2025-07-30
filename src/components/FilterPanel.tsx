import React from 'react';
import { 
  Search, X, Filter, MapPin, Briefcase, TrendingUp,
  UtensilsCrossed, Camera, Tractor, ShoppingBag, HardHat, 
  Truck, Music, GraduationCap, Heart, Anchor, Mountain,
  Hammer, Trophy, Coffee, Trees, Building, ChevronDown, ChevronUp
} from 'lucide-react';
import { Filters, AUSTRALIAN_STATES, INDUSTRIES } from '../types';

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Partial<Filters>) => void;
  onClearFilters: () => void;
  resultCount: number;
}

// Industry icons mapping
const industryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Hospitality': UtensilsCrossed,
  'Tourism': Camera,
  'Agriculture': Tractor,
  'Retail': ShoppingBag,
  'Construction': HardHat,
  'Transportation': Truck,
  'Entertainment': Music,
  'Education': GraduationCap,
  'Health & Wellness': Heart,
  'Marine Services': Anchor,
  'Adventure Tourism': Mountain,
  'Mining & Resources': Hammer,
  'Sports & Recreation': Trophy,
  'Food & Beverage': Coffee,
  'Wildlife & Conservation': Trees,
  'Retail & Tourism': Building
};

// State abbreviations with colors
const stateColors: Record<string, string> = {
  'NSW': 'from-blue-500 to-blue-600',
  'VIC': 'from-purple-500 to-purple-600',
  'QLD': 'from-yellow-500 to-orange-500',
  'WA': 'from-red-500 to-red-600',
  'SA': 'from-green-500 to-green-600',
  'TAS': 'from-teal-500 to-teal-600',
  'NT': 'from-orange-500 to-red-500',
  'ACT': 'from-indigo-500 to-indigo-600'
};

// Australian state flags mapping
const stateFlags: Record<string, string> = {
  'NSW': '🔵', // New South Wales - Blue represents the blue ensign
  'VIC': '👑', // Victoria - Crown represents the Victorian state crown
  'QLD': '☀️', // Queensland - Sun represents the tropical climate
  'WA': '🦢', // Western Australia - Black swan is the state bird
  'SA': '🏛️', // South Australia - Represents the state's heritage
  'TAS': '🍃', // Tasmania - Green represents the island's nature
  'NT': '🌋', // Northern Territory - Represents Uluru/outback
  'ACT': '🏛️'  // Australian Capital Territory - Parliament house
};

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  resultCount 
}) => {
  const [statesCollapsed, setStatesCollapsed] = React.useState(true);
  const [industriesCollapsed, setIndustriesCollapsed] = React.useState(true);

  const handleStateToggle = (state: string) => {
    const newStates = filters.states.includes(state)
      ? filters.states.filter(s => s !== state)
      : [...filters.states, state];
    onFilterChange({ states: newStates });
  };

  const handleIndustryToggle = (industry: string) => {
    const newIndustries = filters.industries.includes(industry)
      ? filters.industries.filter(i => i !== industry)
      : [...filters.industries, industry];
    onFilterChange({ industries: newIndustries });
  };

  const hasActiveFilters = filters.states.length > 0 || filters.industries.length > 0 || filters.searchTerm;

  return (
    <div className="bg-white border border-gray-200 shadow-sm flex-shrink-0 rounded-2xl mx-4 mt-4">
      <div className="p-3 space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by company, location, or contact name..."
            value={filters.searchTerm}
            onChange={(e) => onFilterChange({ searchTerm: e.target.value })}
            className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-colors duration-200"
          />
          {filters.searchTerm && (
            <button
              onClick={() => onFilterChange({ searchTerm: '' })}
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
            >
              <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>



                {/* State Filters */}
        <div className="space-y-1">
          <button
            onClick={() => setStatesCollapsed(!statesCollapsed)}
            className="flex items-center justify-between w-full hover:bg-gray-50 rounded-lg p-1 transition-colors"
          >
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-indigo-600" />
                <h3 className="text-xs font-semibold text-gray-900">States</h3>
                {filters.states.length > 0 && (
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {filters.states.length}
                  </span>
                )}
              </div>
              {filters.states.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ states: [] });
                  }}
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 ml-2"
                >
                  <X className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            {statesCollapsed ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronUp className="w-3 h-3 text-gray-400" />
            )}
          </button>
          
          {!statesCollapsed && (
            <div className="flex flex-wrap gap-1">
              {AUSTRALIAN_STATES.map(state => (
                <button
                  key={state}
                  onClick={() => handleStateToggle(state)}
                  className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                    filters.states.includes(state)
                      ? `bg-gradient-to-r ${stateColors[state]} text-white border-transparent shadow-sm`
                      : 'text-gray-700 border-gray-300 bg-white hover:border-indigo-300 hover:bg-indigo-50'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full flex items-center justify-center text-xs font-bold ${
                    filters.states.includes(state) ? 'bg-white/25 text-white' : `bg-gradient-to-br ${stateColors[state]} text-white`
                  }`}>
                    <span className="text-xs">{stateFlags[state] || state.charAt(0)}</span>
                  </div>
                  <span>{state}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Industry Filters */}
        <div className="space-y-1">
          <button
            onClick={() => setIndustriesCollapsed(!industriesCollapsed)}
            className="flex items-center justify-between w-full hover:bg-gray-50 rounded-lg p-1 transition-colors"
          >
            <div className="flex items-center justify-between flex-1">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-3 h-3 text-purple-600" />
                <h3 className="text-xs font-semibold text-gray-900">Industries</h3>
                {filters.industries.length > 0 && (
                  <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-1.5 py-0.5 rounded-full">
                    {filters.industries.length}
                  </span>
                )}
              </div>
              {filters.industries.length > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onFilterChange({ industries: [] });
                  }}
                  className="flex items-center space-x-1 px-1.5 py-0.5 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 ml-2"
                >
                  <X className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            {industriesCollapsed ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronUp className="w-3 h-3 text-gray-400" />
            )}
          </button>
          
          {!industriesCollapsed && (
            <div className="flex flex-wrap gap-1">
              {INDUSTRIES.map(industry => {
                const IconComponent = industryIcons[industry] || Briefcase;
                const isSelected = filters.industries.includes(industry);
                
                return (
                  <button
                    key={industry}
                    onClick={() => handleIndustryToggle(industry)}
                    className={`flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-transparent shadow-sm'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300 hover:bg-purple-50'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-white/25' : 'bg-gradient-to-br from-purple-100 to-purple-200'
                    }`}>
                      <IconComponent className={`w-2 h-2 ${isSelected ? 'text-white' : 'text-purple-600'}`} />
                    </div>
                    <span>
                      {industry.length > 12 ? industry.split(' ')[0] : industry}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 