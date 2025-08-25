import axios from 'axios';

// World Happiness Report service
// Note: Currently using mock data as the official World Happiness Report API
// structure is not clearly documented. Mock data provides realistic values
// for development and demonstration purposes.
class HappinessService {
  constructor() {
    // Note: This is a placeholder URL - you'll need to use the actual API endpoint
    // from the World Happiness Report or load data from a JSON file
    this.baseURL = 'https://data.worldhappiness.report';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
    });
    
    // Development mode - set to false to suppress mock data messages
    this.developmentMode = true;
  }

  // Get happiness data for all countries
  async getHappinessData(year = 2023) {
    try {
      if (this.developmentMode) {
        console.log(`Attempting to fetch happiness data for year ${year}...`);
      }
      // This is a placeholder implementation - the actual World Happiness Report API endpoint
      // For now, we'll immediately fall back to mock data since the API structure is unclear
      throw new Error('API endpoint not yet implemented - using mock data');
    } catch (error) {
      if (this.developmentMode) {
        console.info(`📊 Using mock happiness data for year ${year} (API not configured)`);
      }
      // Fallback to mock data for development
      return this.getMockHappinessData(year);
    }
  }

  // Get happiness data for a specific country
  async getCountryHappiness(countryCode, startYear = 2015, endYear = 2023) {
    try {
      if (this.developmentMode) {
        console.log(`Attempting to fetch happiness data for ${countryCode} (${startYear}-${endYear})...`);
      }
      // This is a placeholder implementation
      throw new Error('API endpoint not yet implemented - using mock data');
    } catch (error) {
      if (this.developmentMode) {
        console.info(`📊 Using mock happiness data for ${countryCode} (${startYear}-${endYear})`);
      }
      return this.getMockCountryData(countryCode, startYear, endYear);
    }
  }

  // Mock data for development (replace with actual API calls)
  getMockHappinessData(year = 2023) {
    return [
      {
        country: 'United States',
        countryCode: 'USA',
        year: 2023,
        happinessScore: 6.894,
        region: 'North America',
        gdpPerCapita: 1.488,
        socialSupport: 1.504,
        healthyLifeExpectancy: 0.856,
        freedomToMakeLifeChoices: 0.586,
        generosity: 0.308,
        perceptionsOfCorruption: 0.394
      },
      {
        country: 'India',
        countryCode: 'IND',
        year: 2023,
        happinessScore: 4.036,
        region: 'South Asia',
        gdpPerCapita: 0.755,
        socialSupport: 0.765,
        healthyLifeExpectancy: 0.588,
        freedomToMakeLifeChoices: 0.498,
        generosity: 0.200,
        perceptionsOfCorruption: 0.085
      },
      {
        country: 'China',
        countryCode: 'CHN',
        year: 2023,
        happinessScore: 5.125,
        region: 'East Asia & Pacific',
        gdpPerCapita: 1.181,
        socialSupport: 1.402,
        healthyLifeExpectancy: 0.932,
        freedomToMakeLifeChoices: 0.416,
        generosity: 0.106,
        perceptionsOfCorruption: 0.100
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        year: 2023,
        happinessScore: 7.034,
        region: 'Europe & Central Asia',
        gdpPerCapita: 1.456,
        socialSupport: 1.570,
        healthyLifeExpectancy: 0.963,
        freedomToMakeLifeChoices: 0.612,
        generosity: 0.248,
        perceptionsOfCorruption: 0.464
      },
      {
        country: 'Brazil',
        countryCode: 'BRA',
        year: 2023,
        happinessScore: 6.293,
        region: 'Latin America & Caribbean',
        gdpPerCapita: 1.004,
        socialSupport: 1.439,
        healthyLifeExpectancy: 0.802,
        freedomToMakeLifeChoices: 0.390,
        generosity: 0.099,
        perceptionsOfCorruption: 0.086
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        year: 2023,
        happinessScore: 5.886,
        region: 'East Asia & Pacific',
        gdpPerCapita: 1.420,
        socialSupport: 1.419,
        healthyLifeExpectancy: 1.088,
        freedomToMakeLifeChoices: 0.445,
        generosity: 0.069,
        perceptionsOfCorruption: 0.408
      },
      {
        country: 'United Kingdom',
        countryCode: 'GBR',
        year: 2023,
        happinessScore: 7.064,
        region: 'Europe & Central Asia',
        gdpPerCapita: 1.441,
        socialSupport: 1.545,
        healthyLifeExpectancy: 0.943,
        freedomToMakeLifeChoices: 0.558,
        generosity: 0.464,
        perceptionsOfCorruption: 0.382
      },
      {
        country: 'France',
        countryCode: 'FRA',
        year: 2023,
        happinessScore: 6.661,
        region: 'Europe & Central Asia',
        gdpPerCapita: 1.449,
        socialSupport: 1.479,
        healthyLifeExpectancy: 1.000,
        freedomToMakeLifeChoices: 0.557,
        generosity: 0.184,
        perceptionsOfCorruption: 0.305
      }
    ];
  }

  getMockCountryData(countryCode, startYear = 2015, endYear = 2023) {
    // Return time series data for a specific country
    const baseData = this.getMockHappinessData().find(d => d.countryCode === countryCode);
    if (!baseData) return [];

    // Generate time series data for the specified range
    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }
    
    return years.map(year => ({
      ...baseData,
      year,
      happinessScore: baseData.happinessScore + (Math.random() - 0.5) * 0.5 // Add some variation
    }));
  }

  // Get regional happiness averages
  async getRegionalHappiness() {
    try {
      const allData = await this.getHappinessData();
      const regions = {};
      
      allData.forEach(country => {
        if (!regions[country.region]) {
          regions[country.region] = {
            region: country.region,
            countries: [],
            totalScore: 0,
            count: 0
          };
        }
        regions[country.region].countries.push(country);
        regions[country.region].totalScore += country.happinessScore;
        regions[country.region].count += 1;
      });

      return Object.values(regions).map(region => ({
        region: region.region,
        averageHappiness: region.totalScore / region.count,
        countryCount: region.count,
        countries: region.countries
      }));
    } catch (error) {
      console.error('Error calculating regional happiness:', error);
      throw error;
    }
  }
}

export default new HappinessService();
