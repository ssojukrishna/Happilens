import { ref, computed } from 'vue';
import happinessService from '../services/happinessService';

export function useHappinessData() {
  const happinessData = ref([]);
  const regionalData = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadHappinessData = async (year = 2023) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log(`Loading happiness data for year ${year}...`);
      const data = await happinessService.getHappinessData(year);
      happinessData.value = data;
      console.log(`Successfully loaded ${data.length} happiness records`);
    } catch (err) {
      error.value = `Failed to load happiness data: ${err.message || 'Unknown error'}`;
      console.error('Error in useHappinessData:', err);
      // Set empty array as fallback
      happinessData.value = [];
    } finally {
      loading.value = false;
    }
  };

  const loadRegionalData = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log('Loading regional happiness data...');
      const data = await happinessService.getRegionalHappiness();
      regionalData.value = data;
      console.log(`Successfully loaded ${data.length} regional records`);
    } catch (err) {
      error.value = `Failed to load regional happiness data: ${err.message || 'Unknown error'}`;
      console.error('Error loading regional data:', err);
      // Set empty array as fallback
      regionalData.value = [];
    } finally {
      loading.value = false;
    }
  };

  const getCountryHappiness = async (countryCode, startYear = 2015, endYear = 2023) => {
    try {
      console.log(`Loading happiness data for ${countryCode} (${startYear}-${endYear})...`);
      const data = await happinessService.getCountryHappiness(countryCode, startYear, endYear);
      console.log(`Successfully loaded happiness data for ${countryCode}`);
      return data;
    } catch (err) {
      error.value = `Failed to load country happiness data: ${err.message || 'Unknown error'}`;
      console.error(`Error loading happiness data for ${countryCode}:`, err);
      throw err;
    }
  };

  const getHappinessScore = (countryCode) => {
    const country = happinessData.value.find(c => c.countryCode === countryCode);
    return country ? country.happinessScore : null;
  };

  return {
    happinessData: computed(() => happinessData.value),
    regionalData: computed(() => regionalData.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadHappinessData,
    loadRegionalData,
    getCountryHappiness,
    getHappinessScore
  };
}
