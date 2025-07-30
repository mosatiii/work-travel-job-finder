import { useState, useMemo } from 'react';
import { Company, Filters } from './types';
import JobList from './components/JobList';
import MapView from './components/MapView';
import FilterPanel from './components/FilterPanel';
import Header from './components/Header';
import companiesData from '../companies.json';

function App() {
  // State management
  const [companies] = useState<Company[]>(companiesData);
  const [contactedCompanies, setContactedCompanies] = useState<Set<string>>(new Set());
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [filters, setFilters] = useState<Filters>({
    states: [],
    industries: [],
    searchTerm: ''
  });

  // Filter companies based on current filters
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // State filter
      if (filters.states.length > 0 && !filters.states.includes(company.state)) {
        return false;
      }

      // Industry filter
      if (filters.industries.length > 0 && !filters.industries.includes(company.industry)) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        return (
          company.companyName.toLowerCase().includes(searchLower) ||
          company.industry.toLowerCase().includes(searchLower) ||
          company.address.toLowerCase().includes(searchLower) ||
          `${company.firstName} ${company.lastName}`.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [companies, filters]);

  // Handler functions
  const handleContactToggle = (companyId: string) => {
    setContactedCompanies(prev => {
      const newSet = new Set(prev);
      if (newSet.has(companyId)) {
        newSet.delete(companyId);
      } else {
        newSet.add(companyId);
      }
      return newSet;
    });
  };

  const handleCompanySelect = (company: Company | null) => {
    setSelectedCompany(company);
  };

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      <Header />
      
      <div className="flex h-[calc(100vh-3rem)]">
        {/* Left Panel - Job List */}
        <div className="w-1/2 flex flex-col">
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
          />
          
          <JobList
            companies={filteredCompanies}
            contactedCompanies={contactedCompanies}
            selectedCompany={selectedCompany}
            onContactToggle={handleContactToggle}
            onCompanySelect={handleCompanySelect}
          />
        </div>

        {/* Right Panel - Map */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-50 to-purple-50">
          <MapView
            companies={filteredCompanies}
            selectedCompany={selectedCompany}
            contactedCompanies={contactedCompanies}
            onCompanySelect={handleCompanySelect}
            onContactToggle={handleContactToggle}
          />
        </div>
      </div>
    </div>
  );
}

export default App; 