import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { LatLngExpression, DivIcon } from 'leaflet';
import { Company } from '../types';
import { 
  Mail, Phone, MapPin, User, Check, Building, Star,
  UtensilsCrossed, Camera, Tractor, ShoppingBag, HardHat, 
  Truck, Music, GraduationCap, Heart, Anchor, Mountain,
  Hammer, Trophy, Coffee, Trees, Briefcase, Home
} from 'lucide-react';

interface MapViewProps {
  companies: Company[];
  selectedCompany: Company | null;
  contactedCompanies: Set<string>;
  onCompanySelect: (company: Company) => void;
  onContactToggle: (companyId: string) => void;
}



// Helper function to get SVG string for industry icons
const getIconSvg = (industry: string, color: string = 'white') => {
  // Correct Lucide icon SVG paths for each industry
  const iconSvgs: Record<string, string> = {
    'Hospitality': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8"/><path d="M9 5H2v2a3 3 0 0 0 3 3h4"/><path d="m7 21 8-8-8-8-8 8 8 8Z"/></svg>`,
    'Tourism': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2v11z"/><circle cx="12" cy="13" r="3"/></svg>`,
    'Agriculture': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7" cy="18" r="3"/><path d="M6 18h0"/><path d="m12 18 4-4h2l-4-4"/><path d="M6 8V6c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2"/><path d="M6 8h12v4H6z"/><circle cx="18" cy="18" r="2"/></svg>`,
    'Retail': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    'Construction': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18h20"/><path d="M12 2L8 6h8l-4-4z"/><path d="M4 14h16v4H4z"/></svg>`,
    'Transportation': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v9H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`,
    'Entertainment': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><path d="M6 15h9"/><path d="M9 9l12-2"/></svg>`,
    'Education': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6"/><path d="M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 0 5-1 8-1v-4"/></svg>`,
    'Health & Wellness': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
    'Marine Services': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="3"/><path d="M12 8v13"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg>`,
    'Adventure Tourism': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21l4-7 4 7"/><path d="M1 21h22"/><path d="M15 5L9 11l6 10"/></svg>`,
    'Mining & Resources': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 7L6.5 4.5a1 1 0 0 1 1.414-1.414L10.5 5.5"/><path d="M15 7l2.5-2.5a1 1 0 0 1 1.414 1.414L16.5 8.5"/><path d="M7.5 10.5L9 12l-1.5 1.5a1 1 0 0 1-1.414-1.414L7.5 10.5z"/><path d="M16.5 10.5L15 12l1.5 1.5a1 1 0 0 0 1.414-1.414L16.5 10.5z"/><path d="M12 16v6"/><path d="M12 2v6"/></svg>`,
    'Sports & Recreation': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>`,
    'Food & Beverage': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>`,
    'Wildlife & Conservation': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z"/><path d="M7 16v6"/><path d="M13 19v3"/><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 4h-.1a1 1 0 0 0-.9-1.7L10 5.5"/></svg>`,
    'Retail & Tourism': `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6z"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/></svg>`
  };

  return iconSvgs[industry] || iconSvgs['Retail & Tourism']; // fallback to building icon
};

// Custom marker icons with modern design and industry icons
const createMarkerIcon = (isSelected: boolean, isContacted: boolean, industry: string) => {
  const color = isContacted ? '#10B981' : isSelected ? '#6366F1' : '#6B7280';
  const shadowColor = isContacted ? '16, 185, 129' : isSelected ? '99, 102, 241' : '107, 114, 128';
  const iconSvg = getIconSvg(industry, 'white');
  
  return new DivIcon({
    html: `
      <div style="
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(${shadowColor}, 0.3), 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
        transition: all 0.2s ease;
      ">
        ${iconSvg}
        ${isSelected ? `
          <div style="
            position: absolute;
            top: -8px;
            right: -8px;
            width: 16px;
            height: 16px;
            background: #FBBF24;
            border-radius: 50%;
            border: 2px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="width: 6px; height: 6px; background: #92400E; border-radius: 50%;"></div>
          </div>
        ` : ''}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Component to handle map updates when selected company changes
const MapUpdater: React.FC<{ selectedCompany: Company | null }> = ({ selectedCompany }) => {
  const map = useMap();
  
  useEffect(() => {
    if (selectedCompany) {
      map.setView([selectedCompany.latitude, selectedCompany.longitude], 12, {
        animate: true,
        duration: 1
      });
    }
  }, [selectedCompany, map]);
  
  return null;
};

// Component for reset view button
const ResetViewButton: React.FC = () => {
  const map = useMap();
  const australiaCenter: LatLngExpression = [-25.2744, 133.7751];
  
  const handleResetView = () => {
    map.setView(australiaCenter, 4, {
      animate: true,
      duration: 1
    });
  };
  
  return (
    <div className="absolute bottom-4 left-4 z-[1000]">
      <button
        onClick={handleResetView}
        className="inline-flex items-center space-x-2 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-lg"
        title="Reset view to see all Australia"
      >
        <Home className="w-4 h-4" />
        <span>Reset View</span>
      </button>
    </div>
  );
};

const MapView: React.FC<MapViewProps> = ({ 
  companies, 
  selectedCompany, 
  contactedCompanies,
  onCompanySelect, 
  onContactToggle 
}) => {
  // Australia center coordinates
  const australiaCenter: LatLngExpression = [-25.2744, 133.7751];
  
  if (companies.length === 0) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center">
            <MapPin className="w-12 h-12 text-indigo-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">No locations to explore</h3>
          <p className="text-gray-600 leading-relaxed">
            Adjust your search filters to discover amazing work & travel opportunities across Australia on the map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Map container - full height */}
      <div className="flex-1 rounded-2xl overflow-hidden shadow-lg border border-gray-200 bg-white m-4">
        <MapContainer
          center={australiaCenter}
          zoom={4}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          className="rounded-2xl"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapUpdater selectedCompany={selectedCompany} />
          <ResetViewButton />
          
          {companies.map(company => {
            const isSelected = selectedCompany?.companyId === company.companyId;
            const isContacted = contactedCompanies.has(company.companyId);
            
            return (
              <Marker
                key={company.companyId}
                position={[company.latitude, company.longitude]}
                icon={createMarkerIcon(isSelected, isContacted, company.industry)}
                eventHandlers={{
                  click: () => onCompanySelect(company),
                }}
              >
                <Popup 
                  className="custom-popup"
                  offset={[0, -10]}
                  closeButton={true}
                  autoPan={true}
                  autoPanPadding={[20, 20]}
                  maxWidth={400}
                  minWidth={320}
                >
                  <div className="p-4 min-w-[320px] max-w-[400px]">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                          {company.companyName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{company.state}</span>
                          </span>
                          <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Briefcase className="w-2.5 h-2.5" />
                            <span>{company.industry}</span>
                          </span>
                        </div>
                      </div>
                      
                      {isContacted && (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                          <Check className="w-3 h-3" />
                          <span>Contacted</span>
                        </div>
                      )}
                    </div>

                    {/* Contact info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="font-medium">{company.firstName} {company.lastName}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{company.address}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex space-x-3">
                        <a
                          href={`mailto:${company.email}`}
                          className="inline-flex items-center space-x-1 px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors border border-indigo-600 hover:border-indigo-700"
                        >
                          <Mail className="w-3 h-3 text-white" />
                          <span className="text-white">Email</span>
                        </a>
                        
                        <a
                          href={`tel:${company.phoneNumber}`}
                          className="inline-flex items-center space-x-1 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call</span>
                        </a>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onContactToggle(company.companyId);
                        }}
                        className={`inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 border ml-3 min-w-[90px] ${
                          isContacted 
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200 hover:border-green-300' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-300 hover:border-gray-400'
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
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      {/* Map legend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex-shrink-0 mx-4 mb-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Map Legend</h4>
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-600">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-600">Selected</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-gray-600">Contacted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView; 