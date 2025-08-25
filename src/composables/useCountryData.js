import { ref, computed, watch } from 'vue';
import worldBankService from '../services/worldBankService';
import happinessService from '../services/happinessService';

export function useCountryData() {
  const countries = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const loadCountries = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await worldBankService.getCountries();
      countries.value = data.filter(country => 
        country.capitalCity && country.region.value !== 'Aggregates'
      );
    } catch (err) {
      error.value = 'Failed to load countries data';
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getCountryByCode = (code) => {
    return countries.value.find(country => country.id === code);
  };

  const getCountriesByRegion = (regionCode) => {
    return countries.value.filter(country => country.region.id === regionCode);
  };

  return {
    countries: computed(() => countries.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    loadCountries,
    getCountryByCode,
    getCountriesByRegion
  };
}
