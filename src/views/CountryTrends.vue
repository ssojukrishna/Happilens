<template>
  <div class="country-trends">
    <div class="page-header">
      <h1>Country Trends Analysis</h1>
      <p>Explore indicator trends for selected countries over chosen time periods</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Select Country:</label>
        <select v-model="selectedCountry" @change="loadData">
          <option value="">Choose a country...</option>
          <option v-for="country in countries" :key="country.id" :value="country.id">
            {{ country.name }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>Select Indicator:</label>
        <select v-model="selectedIndicator" @change="loadData">
          <option value="NY.GDP.PCAP.CD">GDP per Capita</option>
          <option value="SP.DYN.LE00.IN">Life Expectancy</option>
          <option value="SL.UEM.TOTL.ZS">Unemployment Rate</option>
          <option value="SE.XPD.TOTL.GD.ZS">Education Expenditure</option>
        </select>
      </div>

      <div class="control-group">
        <label>Time Period:</label>
        <div class="year-inputs">
          <input v-model="startYear" type="number" min="2000" max="2023" placeholder="Start Year">
          <span>to</span>
          <input v-model="endYear" type="number" min="2000" max="2023" placeholder="End Year">
        </div>
      </div>
    </div>

    <div class="chart-container" v-if="!loading && chartData">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading data...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>

    <div v-if="!selectedCountry && !loading" class="placeholder">
      <p>Please select a country to view trends</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useCountryData } from '../composables/useCountryData'
import worldBankService from '../services/worldBankService'

Chart.register(...registerables)

export default {
  name: 'CountryTrends',
  setup() {
    const chartCanvas = ref(null)
    const chartInstance = ref(null)
    const selectedCountry = ref('')
    const selectedIndicator = ref('NY.GDP.PCAP.CD')
    const startYear = ref(2015)
    const endYear = ref(2023)
    const chartData = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const { countries, loadCountries } = useCountryData()

    const indicatorNames = {
      'NY.GDP.PCAP.CD': 'GDP per Capita (USD)',
      'SP.DYN.LE00.IN': 'Life Expectancy (years)',
      'SL.UEM.TOTL.ZS': 'Unemployment Rate (%)',
      'SE.XPD.TOTL.GD.ZS': 'Education Expenditure (% of GDP)'
    }

    const loadData = async () => {
      if (!selectedCountry.value || !selectedIndicator.value) return

      loading.value = true
      error.value = null

      try {
        const dateRange = `${startYear.value}:${endYear.value}`
        console.log(`Loading data for ${selectedCountry.value}, indicator: ${selectedIndicator.value}, range: ${dateRange}`)
        
        const data = await worldBankService.getIndicatorData(
          selectedIndicator.value,
          selectedCountry.value,
          dateRange
        )

        console.log('Received data:', data)

        if (data && data.length > 0) {
          const sortedData = data
            .filter(item => item.value !== null && item.value !== undefined)
            .sort((a, b) => parseInt(a.date) - parseInt(b.date))

          console.log('Filtered and sorted data:', sortedData)

          if (sortedData.length === 0) {
            error.value = `No valid data points found for ${indicatorNames[selectedIndicator.value]} in ${countries.value.find(c => c.id === selectedCountry.value)?.name || selectedCountry.value}`
            return
          }

          chartData.value = {
            labels: sortedData.map(item => item.date),
            datasets: [{
              label: indicatorNames[selectedIndicator.value],
              data: sortedData.map(item => item.value),
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }]
          }

          await nextTick()
          createChart()
        } else {
          error.value = `No data available for ${indicatorNames[selectedIndicator.value]} in ${countries.value.find(c => c.id === selectedCountry.value)?.name || selectedCountry.value} for the period ${startYear.value}-${endYear.value}`
        }
      } catch (err) {
        error.value = `Failed to load data: ${err.message || 'Unknown error occurred'}`
        console.error('Error loading indicator data:', err)
      } finally {
        loading.value = false
      }
    }

    const createChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      if (chartCanvas.value && chartData.value) {
        chartInstance.value = new Chart(chartCanvas.value, {
          type: 'line',
          data: chartData.value,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${indicatorNames[selectedIndicator.value]} - ${countries.value.find(c => c.id === selectedCountry.value)?.name || selectedCountry.value}`,
                font: { size: 16 }
              },
              legend: {
                display: true,
                position: 'top'
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Year'
                }
              },
              y: {
                title: {
                  display: true,
                  text: indicatorNames[selectedIndicator.value]
                }
              }
            }
          }
        })
      }
    }

    onMounted(async () => {
      await loadCountries()
    })

    watch([selectedCountry, selectedIndicator, startYear, endYear], () => {
      if (selectedCountry.value) {
        loadData()
      }
    })

    return {
      chartCanvas,
      selectedCountry,
      selectedIndicator,
      startYear,
      endYear,
      chartData,
      loading,
      error,
      countries,
      loadData
    }
  }
}
</script>

<style scoped>
.country-trends {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-header h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

.page-header p {
  color: #666;
  font-size: 1.1rem;
}

.controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: #333;
}

.control-group select,
.control-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.year-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-inputs input {
  flex: 1;
}

.year-inputs span {
  color: #666;
}

.chart-container {
  height: 500px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading, .error, .placeholder {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 6px;
}

@media (max-width: 768px) {
  .controls {
    grid-template-columns: 1fr;
  }
  
  .year-inputs {
    flex-direction: column;
  }
}
</style>
