import React from 'react';
import { Company } from '../types';
import { 
  Mail, Phone, MapPin, User, Check, Building, Star,
  UtensilsCrossed, Camera, Tractor, ShoppingBag, HardHat, 
  Truck, Music, GraduationCap, Heart, Anchor, Mountain,
  Hammer, Trophy, Coffee, Trees, Briefcase, Filter, ChevronLeft, ChevronRight, Sparkles
} from 'lucide-react';
import AIEmailGenerator from './AIEmailGenerator';

interface JobListProps {
  companies: Company[];
  contactedCompanies: Set<string>;
  selectedCompany: Company | null;
  onContactToggle: (companyId: string) => void;
  onCompanySelect: (company: Company) => void;
}

// Function to generate company logo placeholder based on company name
const getCompanyInitials = (companyName: string): string => {
  return companyName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// Function to generate a color based on company name
const getCompanyColor = (companyName: string): string => {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-yellow-500 to-yellow-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-teal-500 to-teal-600'
  ];
  
  const hash = companyName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
};

// Industry icons mapping (same as FilterPanel and MapView)
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

const JobList: React.FC<JobListProps> = ({ 
  companies, 
  contactedCompanies, 
  selectedCompany,
  onContactToggle, 
  onCompanySelect 
}) => {
  const [showContactedOnly, setShowContactedOnly] = React.useState(false);
  const [aiGeneratorCompany, setAiGeneratorCompany] = React.useState<Company | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage] = React.useState(12); // 12 items per page for good UX

  // Filter companies based on the toggle state
  const filteredCompanies = showContactedOnly 
    ? companies.filter(company => contactedCompanies.has(company.companyId))
    : companies;

  // Calculate pagination
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, endIndex);

  // Reset to first page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [showContactedOnly, companies]);

  // Handle empty states
  if (filteredCompanies.length === 0) {
    if (showContactedOnly && contactedCompanies.size === 0) {
      // No contacted companies yet
      return (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <Star className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">You haven't contacted anyone yet</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Start reaching out to companies! Mark them as contacted after sending emails to keep track of your applications.
            </p>
            <button
              onClick={() => setShowContactedOnly(false)}
              className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Opportunities
            </button>
          </div>
        </div>
      );
    } else if (companies.length === 0) {
      // No companies at all
      return (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Building className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No opportunities found</h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Try adjusting your search criteria or filters to discover more exciting work & travel opportunities.
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white rounded-2xl shadow-sm border border-gray-200 mx-4 mt-4">
      {/* Filter header */}
      <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 p-3 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {filteredCompanies.length} {filteredCompanies.length === 1 ? 'Opportunity' : 'Opportunities'}
            </h2>
            {totalPages > 1 && (
              <p className="text-xs text-gray-500">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredCompanies.length)} of {filteredCompanies.length}
              </p>
            )}
          </div>
          <button
            onClick={() => setShowContactedOnly(!showContactedOnly)}
            className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              showContactedOnly 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>{showContactedOnly ? 'Show All' : 'Contacted Only'}</span>
            {showContactedOnly && <Check className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <div className="p-3 space-y-2">
        {currentCompanies.map(company => {
          const isContacted = contactedCompanies.has(company.companyId);
          const isSelected = selectedCompany?.companyId === company.companyId;
          const companyInitials = getCompanyInitials(company.companyName);
          const companyColor = getCompanyColor(company.companyName);
          const IndustryIcon = industryIcons[company.industry] || Briefcase;
          
          return (
            <div
              key={company.companyId}
              onClick={() => onCompanySelect(company)}
              className={`group relative bg-white rounded-2xl shadow-sm border transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 ${
                isSelected 
                  ? 'ring-2 ring-indigo-500 shadow-lg shadow-indigo-100 border-indigo-200' 
                  : 'border-gray-200 hover:border-gray-300'
              } ${isContacted ? 'opacity-90' : ''}`}
            >
              {/* Status indicator */}
              {isContacted && (
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>Contacted</span>
                  </div>
                </div>
              )}

              <div className="p-4">
                {/* Header with logo and basic info */}
                <div className="flex items-start space-x-3 mb-3">
                  {/* Company logo placeholder */}
                  <div className={`w-10 h-10 rounded-lg ${companyColor} flex items-center justify-center text-white font-bold text-sm shadow-md flex-shrink-0`}>
                    {companyInitials}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                      {company.companyName}
                    </h3>
                    
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        <span className="text-xs">{stateFlags[company.state] || '🇦🇺'}</span>
                        <span>{company.state}</span>
                      </span>
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <IndustryIcon className="w-2.5 h-2.5" />
                        <span>{company.industry}</span>
                      </span>
                    </div>
                    
                    {/* Contact information - inline */}
                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex items-center">
                        <User className="w-3 h-3 mr-2 text-gray-400" />
                        <span>{company.firstName} {company.lastName}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                        <span className="truncate">{company.address}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <a
                      href={`mailto:${company.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-xs font-medium rounded-md hover:bg-indigo-700 transition-colors duration-200"
                    >
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </a>
                    
                    <a
                      href={`tel:${company.phoneNumber}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </a>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setAiGeneratorCompany(company);
                      }}
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-medium rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      AI Email
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onContactToggle(company.companyId);
                    }}
                    className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
                      isContacted 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {isContacted ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Contacted</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-3 h-3" />
                        <span>Mark</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          );
        })}
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 text-sm font-medium rounded-lg transition-colors ${
                        currentPage === pageNum
                          ? 'bg-indigo-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-gray-400">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>
      )}
      
      {/* AI Email Generator Modal */}
      {aiGeneratorCompany && (
        <AIEmailGenerator 
          company={aiGeneratorCompany}
          onClose={() => setAiGeneratorCompany(null)}
        />
      )}
    </div>
  );
};

export default JobList; 