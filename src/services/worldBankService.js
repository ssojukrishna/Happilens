import axios from 'axios';

// World Bank API service
class WorldBankService {
  constructor() {
    this.baseURL = 'https://api.worldbank.org/v2';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 15000,
      headers: {
        'Accept': 'application/json',
      }
    });
  }

  // Get countries list with income groups and regions
  async getCountries() {
    try {
      console.log('Attempting to fetch countries from World Bank API...');
      const response = await this.client.get('/countries?format=json&per_page=300');
      console.log('Successfully fetched countries from API');
      return response.data[1]; // World Bank API returns [metadata, data]
    } catch (error) {
      console.warn('World Bank API failed, using mock data:', error.message);
      // Return mock data if API fails
      return this.getMockCountries();
    }
  }

  // Get specific indicator data for countries
  async getIndicatorData(indicatorCode, countryCode = 'all', dateRange = '2010:2023') {
    try {
      console.log(`Attempting to fetch indicator ${indicatorCode} for ${countryCode}...`);
      const response = await this.client.get(
        `/countries/${countryCode}/indicators/${indicatorCode}?format=json&date=${dateRange}&per_page=1000`
      );
      console.log('Successfully fetched indicator data from API');
      return response.data[1] || [];
    } catch (error) {
      console.warn(`World Bank API failed for indicator ${indicatorCode}, using mock data:`, error.message);
      // Return mock data if API fails
      return this.getMockIndicatorData(indicatorCode, countryCode, dateRange);
    }
  }

  // Mock data for development and fallback
  getMockCountries() {
    return [
      {
        id: 'USA',
        name: 'United States',
        capitalCity: 'Washington D.C.',
        region: { id: 'NAC', value: 'North America' },
        incomeLevel: { id: 'HIC', value: 'High income' }
      },
      {
        id: 'IND',
        name: 'India',
        capitalCity: 'New Delhi',
        region: { id: 'SAS', value: 'South Asia' },
        incomeLevel: { id: 'LMC', value: 'Lower middle income' }
      },
      {
        id: 'CHN',
        name: 'China',
        capitalCity: 'Beijing',
        region: { id: 'EAS', value: 'East Asia & Pacific' },
        incomeLevel: { id: 'UMC', value: 'Upper middle income' }
      },
      {
        id: 'DEU',
        name: 'Germany',
        capitalCity: 'Berlin',
        region: { id: 'ECS', value: 'Europe & Central Asia' },
        incomeLevel: { id: 'HIC', value: 'High income' }
      },
      {
        id: 'BRA',
        name: 'Brazil',
        capitalCity: 'Brasilia',
        region: { id: 'LCN', value: 'Latin America & Caribbean' },
        incomeLevel: { id: 'UMC', value: 'Upper middle income' }
      },
      {
        id: 'JPN',
        name: 'Japan',
        capitalCity: 'Tokyo',
        region: { id: 'EAS', value: 'East Asia & Pacific' },
        incomeLevel: { id: 'HIC', value: 'High income' }
      },
      {
        id: 'GBR',
        name: 'United Kingdom',
        capitalCity: 'London',
        region: { id: 'ECS', value: 'Europe & Central Asia' },
        incomeLevel: { id: 'HIC', value: 'High income' }
      },
      {
        id: 'FRA',
        name: 'France',
        capitalCity: 'Paris',
        region: { id: 'ECS', value: 'Europe & Central Asia' },
        incomeLevel: { id: 'HIC', value: 'High income' }
      }
    ];
  }

  getMockIndicatorData(indicatorCode, countryCode, dateRange) {
    const [startYear, endYear] = dateRange.split(':').map(Number);
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    // Generate realistic mock data based on indicator and country
    const baseValues = {
      'NY.GDP.PCAP.CD': { // GDP per Capita
        'USA': 65000,
        'IND': 2400,
        'CHN': 12000,
        'DEU': 50000,
        'BRA': 9000,
        'JPN': 40000,
        'GBR': 45000,
        'FRA': 43000
      },
      'SP.DYN.LE00.IN': { // Life Expectancy
        'USA': 78.5,
        'IND': 69.7,
        'CHN': 77.4,
        'DEU': 81.2,
        'BRA': 75.9,
        'JPN': 84.6,
        'GBR': 81.4,
        'FRA': 82.7
      },
      'SL.UEM.TOTL.ZS': { // Unemployment Rate
        'USA': 5.4,
        'IND': 7.1,
        'CHN': 4.0,
        'DEU': 3.6,
        'BRA': 12.3,
        'JPN': 2.8,
        'GBR': 4.2,
        'FRA': 8.1
      },
      'SE.XPD.TOTL.GD.ZS': { // Education Expenditure
        'USA': 6.2,
        'IND': 4.6,
        'CHN': 4.1,
        'DEU': 4.8,
        'BRA': 6.1,
        'JPN': 3.4,
        'GBR': 5.5,
        'FRA': 5.4
      }
    };

    const baseValue = baseValues[indicatorCode]?.[countryCode] || 100;
    
    return years.map(year => ({
      indicator: { id: indicatorCode, value: this.getIndicatorName(indicatorCode) },
      country: { id: countryCode, value: this.getCountryName(countryCode) },
      countryiso3code: countryCode,
      date: year.toString(),
      value: this.generateTrendValue(baseValue, year, startYear, indicatorCode),
      unit: '',
      obs_status: '',
      decimal: 1
    }));
  }

  generateTrendValue(baseValue, year, startYear, indicatorCode) {
    const yearOffset = year - startYear;
    const trendMultiplier = indicatorCode === 'NY.GDP.PCAP.CD' ? 1.02 : // GDP grows
                           indicatorCode === 'SP.DYN.LE00.IN' ? 1.003 : // Life expectancy slowly increases
                           indicatorCode === 'SL.UEM.TOTL.ZS' ? 0.98 : // Unemployment slowly decreases
                           1.01; // Education expenditure increases
    
    const trend = Math.pow(trendMultiplier, yearOffset);
    const randomVariation = 0.9 + Math.random() * 0.2; // ±10% random variation
    
    return Math.round(baseValue * trend * randomVariation * 100) / 100;
  }

  getIndicatorName(code) {
    const names = {
      'NY.GDP.PCAP.CD': 'GDP per capita (current US$)',
      'SP.DYN.LE00.IN': 'Life expectancy at birth, total (years)',
      'SL.UEM.TOTL.ZS': 'Unemployment, total (% of total labor force)',
      'SE.XPD.TOTL.GD.ZS': 'Government expenditure on education, total (% of GDP)'
    };
    return names[code] || 'Unknown Indicator';
  }

  getCountryName(code) {
    const names = {
      'USA': 'United States',
      'IND': 'India',
      'CHN': 'China',
      'DEU': 'Germany',
      'BRA': 'Brazil',
      'JPN': 'Japan',
      'GBR': 'United Kingdom',
      'FRA': 'France'
    };
    return names[code] || code;
  }

  // Common indicators
  getGDPPerCapita(countryCode, dateRange) {
    return this.getIndicatorData('NY.GDP.PCAP.CD', countryCode, dateRange);
  }

  getLifeExpectancy(countryCode, dateRange) {
    return this.getIndicatorData('SP.DYN.LE00.IN', countryCode, dateRange);
  }

  getUnemploymentRate(countryCode, dateRange) {
    return this.getIndicatorData('SL.UEM.TOTL.ZS', countryCode, dateRange);
  }

  getEducationIndex(countryCode, dateRange) {
    return this.getIndicatorData('SE.XPD.TOTL.GD.ZS', countryCode, dateRange);
  }
}

export default new WorldBankService();
