<template>
  <div class="regional-view">
    <div class="page-header">
      <h1>Regional Happiness Distribution</h1>
      <p>Visualize happiness distribution across world regions</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Select Year:</label>
        <select v-model="selectedYear" @change="loadData">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>Chart Type:</label>
        <select v-model="chartType" @change="updateChart">
          <option value="bar">Regional Averages (Bar Chart)</option>
          <option value="doughnut">Regional Distribution (Pie Chart)</option>
          <option value="line">Trends Over Time</option>
        </select>
      </div>
    </div>

    <div class="charts-container">
      <div class="chart-section">
        <canvas ref="chartCanvas"></canvas>
      </div>

      <div class="regional-stats" v-if="regionalStats">
        <h3>Regional Statistics</h3>
        <div class="stats-grid">
          <div v-for="region in regionalStats" :key="region.name" class="stat-card">
            <h4>{{ region.name }}</h4>
            <div class="stat-item">
              <span class="stat-label">Average Happiness:</span>
              <span class="stat-value">{{ region.average.toFixed(3) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Countries:</span>
              <span class="stat-value">{{ region.countries.length }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Highest:</span>
              <span class="stat-value">{{ region.highest.country }} ({{ region.highest.score.toFixed(3) }})</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Lowest:</span>
              <span class="stat-value">{{ region.lowest.country }} ({{ region.lowest.score.toFixed(3) }})</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading regional data...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { useHappinessData } from '../composables/useHappinessData'

Chart.register(...registerables)

export default {
  name: 'RegionalView',
  setup() {
    const chartCanvas = ref(null)
    const chartInstance = ref(null)
    const selectedYear = ref(2023)
    const chartType = ref('bar')
    const loading = ref(false)
    const error = ref(null)
    const regionalStats = ref(null)

    const { happinessData, loadHappinessData } = useHappinessData()
    
    const availableYears = ref([2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015])

    // Mock regional mapping for our countries
    const regionMapping = {
      'USA': 'North America',
      'IND': 'South Asia',
      'CHN': 'East Asia',
      'DEU': 'Western Europe',
      'BRA': 'Latin America',
      'JPN': 'East Asia',
      'GBR': 'Western Europe',
      'FRA': 'Western Europe'
    }

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null

        console.log('Loading regional data for year:', selectedYear.value)

        // Load happiness data
        await loadHappinessData()

        // Get mock happiness data for our countries
        const mockHappinessData = [
          { countryCode: 'USA', country: 'United States', happinessScore: 6.894, region: 'North America' },
          { countryCode: 'IND', country: 'India', happinessScore: 4.036, region: 'South Asia' },
          { countryCode: 'CHN', country: 'China', happinessScore: 5.125, region: 'East Asia' },
          { countryCode: 'DEU', country: 'Germany', happinessScore: 7.034, region: 'Western Europe' },
          { countryCode: 'BRA', country: 'Brazil', happinessScore: 6.293, region: 'Latin America' },
          { countryCode: 'JPN', country: 'Japan', happinessScore: 5.886, region: 'East Asia' },
          { countryCode: 'GBR', country: 'United Kingdom', happinessScore: 7.064, region: 'Western Europe' },
          { countryCode: 'FRA', country: 'France', happinessScore: 6.661, region: 'Western Europe' }
        ]

        // Group by regions
        const regionGroups = {}
        mockHappinessData.forEach(item => {
          if (!regionGroups[item.region]) {
            regionGroups[item.region] = []
          }
          regionGroups[item.region].push(item)
        })

        // Calculate regional statistics
        const stats = Object.keys(regionGroups).map(regionName => {
          const countries = regionGroups[regionName]
          const scores = countries.map(c => c.happinessScore)
          const average = scores.reduce((sum, score) => sum + score, 0) / scores.length
          
          const sortedCountries = countries.sort((a, b) => b.happinessScore - a.happinessScore)
          
          return {
            name: regionName,
            average,
            countries: countries.map(c => ({ country: c.country, score: c.happinessScore })),
            highest: { country: sortedCountries[0].country, score: sortedCountries[0].happinessScore },
            lowest: { country: sortedCountries[sortedCountries.length - 1].country, score: sortedCountries[sortedCountries.length - 1].happinessScore }
          }
        })

        regionalStats.value = stats.sort((a, b) => b.average - a.average)
        
        console.log('Regional statistics:', regionalStats.value)

        await nextTick()
        updateChart()

      } catch (err) {
        error.value = `Failed to load regional data: ${err.message}`
        console.error('Error loading regional data:', err)
      } finally {
        loading.value = false
      }
    }

    const updateChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      if (!chartCanvas.value || !regionalStats.value) return

      const regionColors = {
        'North America': '#FF6384',
        'South Asia': '#36A2EB',
        'East Asia': '#FFCE56',
        'Western Europe': '#4BC0C0',
        'Latin America': '#9966FF'
      }

      let chartData, chartOptions

      if (chartType.value === 'bar') {
        chartData = {
          labels: regionalStats.value.map(r => r.name),
          datasets: [{
            label: 'Average Happiness Score',
            data: regionalStats.value.map(r => r.average),
            backgroundColor: regionalStats.value.map(r => regionColors[r.name] || '#999999'),
            borderColor: regionalStats.value.map(r => regionColors[r.name] || '#999999'),
            borderWidth: 2
          }]
        }

        chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Regional Happiness Averages (${selectedYear.value})`,
              font: { size: 16 }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: Math.min(...regionalStats.value.map(r => r.average)) - 0.5,
              max: Math.max(...regionalStats.value.map(r => r.average)) + 0.5,
              title: {
                display: true,
                text: 'Happiness Score'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Region'
              }
            }
          }
        }
      } else if (chartType.value === 'doughnut') {
        chartData = {
          labels: regionalStats.value.map(r => r.name),
          datasets: [{
            data: regionalStats.value.map(r => r.average),
            backgroundColor: regionalStats.value.map(r => regionColors[r.name] || '#999999'),
            borderWidth: 2
          }]
        }

        chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: `Regional Happiness Distribution (${selectedYear.value})`,
              font: { size: 16 }
            },
            legend: {
              position: 'right'
            }
          }
        }
      } else if (chartType.value === 'line') {
        // Mock trend data over years
        const years = [2019, 2020, 2021, 2022, 2023]
        const datasets = regionalStats.value.map(region => ({
          label: region.name,
          data: years.map(year => {
            // Generate realistic trend data
            const baseScore = region.average
            const variance = (Math.random() - 0.5) * 0.5 // Small random variation
            return Math.max(0, baseScore + variance)
          }),
          borderColor: regionColors[region.name] || '#999999',
          backgroundColor: regionColors[region.name] || '#999999',
          fill: false,
          tension: 0.4
        }))

        chartData = {
          labels: years,
          datasets
        }

        chartOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Regional Happiness Trends Over Time',
              font: { size: 16 }
            },
            legend: {
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              title: {
                display: true,
                text: 'Happiness Score'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Year'
              }
            }
          }
        }
      }

      chartInstance.value = new Chart(chartCanvas.value, {
        type: chartType.value === 'doughnut' ? 'doughnut' : chartType.value === 'line' ? 'line' : 'bar',
        data: chartData,
        options: chartOptions
      })
    }

    onMounted(async () => {
      await loadData()
    })

    return {
      chartCanvas,
      selectedYear,
      chartType,
      availableYears,
      regionalStats,
      loading,
      error,
      loadData,
      updateChart
    }
  }
}
</script>

<style scoped>
.regional-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-header h1 {
  color: #2c3e50;
  margin-bottom: 10px;
}

.page-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.controls {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-weight: 600;
  color: #34495e;
}

.control-group select {
  padding: 8px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  min-width: 200px;
}

.control-group select:focus {
  outline: none;
  border-color: #667eea;
}

.charts-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
  margin-bottom: 30px;
}

.chart-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 500px;
}

.regional-stats {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.regional-stats h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.stats-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.stat-card {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.stat-card h4 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.stat-label {
  color: #7f8c8d;
  font-size: 14px;
}

.stat-value {
  color: #2c3e50;
  font-weight: 600;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #7f8c8d;
}

.error {
  text-align: center;
  padding: 20px;
  background: #ffe6e6;
  border: 1px solid #ff9999;
  border-radius: 8px;
  color: #cc0000;
  margin: 20px 0;
}

@media (max-width: 768px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .control-group select {
    min-width: 100%;
  }
}
</style>
