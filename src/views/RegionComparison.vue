<template>
  <div class="region-comparison">
    <div class="page-header">
      <h1>Regional Country Comparison</h1>
      <p>Compare countries within regions to see which are outperforming others</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Select Region:</label>
        <select v-model="selectedRegion" @change="loadData">
          <option v-for="region in availableRegions" :key="region" :value="region">
            {{ region }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>Primary Indicator:</label>
        <select v-model="selectedIndicator" @change="loadData">
          <option value="NY.GDP.PCAP.CD">GDP per Capita</option>
          <option value="SP.DYN.LE00.IN">Life Expectancy</option>
          <option value="SL.UEM.TOTL.ZS">Unemployment Rate</option>
          <option value="SE.XPD.TOTL.GD.ZS">Education Expenditure</option>
        </select>
      </div>

      <div class="control-group">
        <label>Year:</label>
        <select v-model="selectedYear" @change="loadData">
          <option v-for="year in availableYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div class="control-group">
        <label>Chart Type:</label>
        <select v-model="chartType" @change="updateChart">
          <option value="bar">Performance Ranking</option>
          <option value="scatter">Happiness vs Indicator</option>
          <option value="radar">Multi-Indicator Comparison</option>
        </select>
      </div>
    </div>

    <!-- Regional Overview -->
    <div class="regional-overview" v-if="regionStats">
      <h3>{{ selectedRegion }} Overview</h3>
      <div class="overview-stats">
        <div class="overview-card">
          <div class="overview-label">Countries</div>
          <div class="overview-value">{{ regionStats.countryCount }}</div>
        </div>
        <div class="overview-card">
          <div class="overview-label">Avg Happiness</div>
          <div class="overview-value">{{ regionStats.avgHappiness.toFixed(3) }}</div>
        </div>
        <div class="overview-card">
          <div class="overview-label">Top Performer</div>
          <div class="overview-value">{{ regionStats.topPerformer.country }}</div>
        </div>
        <div class="overview-card">
          <div class="overview-label">Performance Gap</div>
          <div class="overview-value">{{ regionStats.performanceGap.toFixed(3) }}</div>
        </div>
      </div>
    </div>

    <!-- Main Chart -->
    <div class="chart-container">
      <canvas ref="mainChart"></canvas>
    </div>

    <!-- Country Rankings Table -->
    <div class="rankings-section" v-if="countryRankings">
      <h3>Country Rankings - {{ indicatorNames[selectedIndicator] }}</h3>
      <div class="rankings-table">
        <div class="table-header">
          <div class="rank-col">Rank</div>
          <div class="country-col">Country</div>
          <div class="happiness-col">Happiness</div>
          <div class="indicator-col">{{ indicatorNames[selectedIndicator] }}</div>
          <div class="trend-col">Trend</div>
        </div>
        <div v-for="(country, index) in countryRankings" :key="country.countryCode" class="table-row">
          <div class="rank-col">
            <span class="rank-badge" :class="getRankClass(index + 1)">#{{ index + 1 }}</span>
          </div>
          <div class="country-col">
            <span class="country-name">{{ country.country }}</span>
          </div>
          <div class="happiness-col">
            <span class="happiness-score">{{ country.happiness.toFixed(3) }}</span>
          </div>
          <div class="indicator-col">
            <span class="indicator-value">{{ formatIndicatorValue(country.indicator) }}</span>
          </div>
          <div class="trend-col">
            <span class="trend-indicator" :class="country.trend > 0 ? 'positive' : 'negative'">
              {{ country.trend > 0 ? '↗' : '↘' }} {{ Math.abs(country.trend).toFixed(1) }}%
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Insights -->
    <div class="insights-section" v-if="insights">
      <h3>Key Insights</h3>
      <div class="insights-grid">
        <div v-for="insight in insights" :key="insight.title" class="insight-card" :class="insight.type">
          <div class="insight-icon">{{ insight.icon }}</div>
          <div class="insight-content">
            <h4>{{ insight.title }}</h4>
            <p>{{ insight.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading regional comparison data...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import worldBankService from '../services/worldBankService'

Chart.register(...registerables)

export default {
  name: 'RegionComparison',
  setup() {
    const mainChart = ref(null)
    const chartInstance = ref(null)
    const selectedRegion = ref('Western Europe')
    const selectedIndicator = ref('NY.GDP.PCAP.CD')
    const selectedYear = ref(2023)
    const chartType = ref('bar')
    const loading = ref(false)
    const error = ref(null)
    const regionStats = ref(null)
    const countryRankings = ref(null)
    const insights = ref(null)

    const availableRegions = ref([
      'Western Europe',
      'East Asia',
      'North America',
      'South Asia',
      'Latin America'
    ])

    const availableYears = ref([2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015])

    const indicatorNames = {
      'NY.GDP.PCAP.CD': 'GDP per Capita',
      'SP.DYN.LE00.IN': 'Life Expectancy',
      'SL.UEM.TOTL.ZS': 'Unemployment Rate',
      'SE.XPD.TOTL.GD.ZS': 'Education Expenditure'
    }

    // Mock comprehensive regional data
    const regionalData = {
      'Western Europe': [
        { countryCode: 'DEU', country: 'Germany', happiness: 7.034, region: 'Western Europe' },
        { countryCode: 'GBR', country: 'United Kingdom', happiness: 7.064, region: 'Western Europe' },
        { countryCode: 'FRA', country: 'France', happiness: 6.661, region: 'Western Europe' }
      ],
      'East Asia': [
        { countryCode: 'JPN', country: 'Japan', happiness: 5.886, region: 'East Asia' },
        { countryCode: 'CHN', country: 'China', happiness: 5.125, region: 'East Asia' }
      ],
      'North America': [
        { countryCode: 'USA', country: 'United States', happiness: 6.894, region: 'North America' }
      ],
      'South Asia': [
        { countryCode: 'IND', country: 'India', happiness: 4.036, region: 'South Asia' }
      ],
      'Latin America': [
        { countryCode: 'BRA', country: 'Brazil', happiness: 6.293, region: 'Latin America' }
      ]
    }

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null

        console.log('Loading data for region:', selectedRegion.value)

        const regionCountries = regionalData[selectedRegion.value] || []
        
        if (regionCountries.length === 0) {
          error.value = 'No data available for the selected region'
          return
        }

        // Get indicator data for countries in the region
        const countriesWithData = await Promise.all(
          regionCountries.map(async (country) => {
            const indicatorData = await worldBankService.getIndicatorData(
              country.countryCode, 
              selectedIndicator.value, 
              selectedYear.value, 
              selectedYear.value
            )
            
            // Generate mock indicator values if API data not available
            const mockIndicatorData = {
              'NY.GDP.PCAP.CD': {
                'DEU': 48260, 'GBR': 42330, 'FRA': 39030, 'JPN': 39285, 
                'CHN': 12556, 'USA': 63544, 'IND': 2256, 'BRA': 8917
              },
              'SP.DYN.LE00.IN': {
                'DEU': 81.2, 'GBR': 81.1, 'FRA': 82.5, 'JPN': 84.4, 
                'CHN': 76.9, 'USA': 78.9, 'IND': 69.4, 'BRA': 75.9
              },
              'SL.UEM.TOTL.ZS': {
                'DEU': 3.1, 'GBR': 3.7, 'FRA': 7.3, 'JPN': 2.8, 
                'CHN': 5.2, 'USA': 3.7, 'IND': 8.0, 'BRA': 9.3
              },
              'SE.XPD.TOTL.GD.ZS': {
                'DEU': 4.9, 'GBR': 5.5, 'FRA': 5.4, 'JPN': 3.2, 
                'CHN': 4.0, 'USA': 6.2, 'IND': 4.6, 'BRA': 6.0
              }
            }

            const indicatorValue = indicatorData.length > 0 
              ? indicatorData[0].value 
              : mockIndicatorData[selectedIndicator.value][country.countryCode]

            // Generate mock trend data
            const trend = (Math.random() - 0.5) * 10 // -5% to +5% change

            return {
              ...country,
              indicator: indicatorValue,
              trend
            }
          })
        )

        // Sort by indicator value (descending for most indicators, ascending for unemployment)
        const isNegativeIndicator = selectedIndicator.value === 'SL.UEM.TOTL.ZS'
        countriesWithData.sort((a, b) => {
          return isNegativeIndicator 
            ? a.indicator - b.indicator 
            : b.indicator - a.indicator
        })

        countryRankings.value = countriesWithData

        // Calculate regional statistics
        const happinessScores = countriesWithData.map(c => c.happiness)
        const avgHappiness = happinessScores.reduce((sum, score) => sum + score, 0) / happinessScores.length
        const topPerformer = countriesWithData[0]
        const bottomPerformer = countriesWithData[countriesWithData.length - 1]
        const performanceGap = topPerformer.happiness - bottomPerformer.happiness

        regionStats.value = {
          countryCount: countriesWithData.length,
          avgHappiness,
          topPerformer,
          performanceGap
        }

        // Generate insights
        generateInsights(countriesWithData)

        await nextTick()
        updateChart()

      } catch (err) {
        error.value = `Failed to load regional comparison data: ${err.message}`
        console.error('Error loading regional comparison:', err)
      } finally {
        loading.value = false
      }
    }

    const generateInsights = (countries) => {
      const insightsList = []

      // Performance leader insight
      const leader = countries[0]
      insightsList.push({
        type: 'success',
        icon: '🏆',
        title: 'Regional Leader',
        description: `${leader.country} leads the region in ${indicatorNames[selectedIndicator.value]} with a score of ${formatIndicatorValue(leader.indicator)} and happiness score of ${leader.happiness.toFixed(3)}.`
      })

      // Performance gap insight
      if (countries.length > 1) {
        const gap = countries[0].indicator - countries[countries.length - 1].indicator
        const gapPercent = ((gap / countries[countries.length - 1].indicator) * 100).toFixed(1)
        insightsList.push({
          type: 'warning',
          icon: '📊',
          title: 'Performance Gap',
          description: `There's a ${gapPercent}% gap in ${indicatorNames[selectedIndicator.value]} between the top and bottom performers in the region.`
        })
      }

      // Correlation insight
      const correlation = calculateCorrelation(countries)
      if (Math.abs(correlation) > 0.5) {
        insightsList.push({
          type: 'info',
          icon: '📈',
          title: 'Strong Correlation',
          description: `${indicatorNames[selectedIndicator.value]} shows a ${correlation > 0 ? 'positive' : 'negative'} correlation with happiness (r = ${correlation.toFixed(3)}).`
        })
      }

      insights.value = insightsList
    }

    const calculateCorrelation = (countries) => {
      const n = countries.length
      if (n < 2) return 0

      const xValues = countries.map(c => c.indicator)
      const yValues = countries.map(c => c.happiness)

      const xMean = xValues.reduce((sum, x) => sum + x, 0) / n
      const yMean = yValues.reduce((sum, y) => sum + y, 0) / n

      let numerator = 0
      let xVariance = 0
      let yVariance = 0

      for (let i = 0; i < n; i++) {
        const xDiff = xValues[i] - xMean
        const yDiff = yValues[i] - yMean
        
        numerator += xDiff * yDiff
        xVariance += xDiff * xDiff
        yVariance += yDiff * yDiff
      }

      const denominator = Math.sqrt(xVariance * yVariance)
      return denominator === 0 ? 0 : numerator / denominator
    }

    const updateChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      if (!mainChart.value || !countryRankings.value) return

      const countries = countryRankings.value
      const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b']

      if (chartType.value === 'bar') {
        chartInstance.value = new Chart(mainChart.value, {
          type: 'bar',
          data: {
            labels: countries.map(c => c.country),
            datasets: [{
              label: indicatorNames[selectedIndicator.value],
              data: countries.map(c => c.indicator),
              backgroundColor: colors.slice(0, countries.length),
              borderColor: colors.slice(0, countries.length),
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${selectedRegion.value} - ${indicatorNames[selectedIndicator.value]} Rankings`,
                font: { size: 16 }
              },
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: selectedIndicator.value !== 'SL.UEM.TOTL.ZS',
                title: {
                  display: true,
                  text: indicatorNames[selectedIndicator.value]
                }
              }
            }
          }
        })
      } else if (chartType.value === 'scatter') {
        chartInstance.value = new Chart(mainChart.value, {
          type: 'scatter',
          data: {
            datasets: [{
              label: 'Countries',
              data: countries.map((country, index) => ({
                x: country.indicator,
                y: country.happiness,
                country: country.country,
                rank: index + 1
              })),
              backgroundColor: colors.slice(0, countries.length),
              borderColor: colors.slice(0, countries.length),
              pointRadius: 8,
              pointHoverRadius: 10
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${selectedRegion.value} - Happiness vs ${indicatorNames[selectedIndicator.value]}`,
                font: { size: 16 }
              },
              legend: {
                display: false
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    const point = context.raw
                    return [
                      `Country: ${point.country}`,
                      `Rank: #${point.rank}`,
                      `${indicatorNames[selectedIndicator.value]}: ${point.x}`,
                      `Happiness: ${point.y.toFixed(3)}`
                    ]
                  }
                }
              }
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: indicatorNames[selectedIndicator.value]
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Happiness Score'
                }
              }
            }
          }
        })
      }
    }

    const formatIndicatorValue = (value) => {
      if (selectedIndicator.value === 'NY.GDP.PCAP.CD') {
        return `$${value.toLocaleString()}`
      } else if (selectedIndicator.value === 'SP.DYN.LE00.IN') {
        return `${value.toFixed(1)} years`
      } else if (selectedIndicator.value.includes('ZS')) {
        return `${value.toFixed(1)}%`
      }
      return value.toFixed(2)
    }

    const getRankClass = (rank) => {
      if (rank === 1) return 'rank-gold'
      if (rank === 2) return 'rank-silver'
      if (rank === 3) return 'rank-bronze'
      return 'rank-normal'
    }

    onMounted(async () => {
      await loadData()
    })

    return {
      mainChart,
      selectedRegion,
      selectedIndicator,
      selectedYear,
      chartType,
      availableRegions,
      availableYears,
      indicatorNames,
      regionStats,
      countryRankings,
      insights,
      loading,
      error,
      loadData,
      updateChart,
      formatIndicatorValue,
      getRankClass
    }
  }
}
</script>

<style scoped>
.region-comparison {
  padding: 20px;
  max-width: 1400px;
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
  justify-content: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-weight: 600;
  color: #34495e;
  font-size: 14px;
}

.control-group select {
  padding: 8px 12px;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  min-width: 180px;
}

.control-group select:focus {
  outline: none;
  border-color: #667eea;
}

.regional-overview {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.regional-overview h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-size: 18px;
}

.overview-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.overview-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
  border-left: 4px solid #667eea;
}

.overview-label {
  color: #7f8c8d;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.overview-value {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
}

.chart-container {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  height: 500px;
}

.rankings-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.rankings-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.rankings-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.table-header {
  display: grid;
  grid-template-columns: 80px 1fr 120px 140px 100px;
  gap: 16px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 80px 1fr 120px 140px 100px;
  gap: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  align-items: center;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f8f9fa;
}

.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 12px;
}

.rank-badge.rank-gold {
  background: #FFD700;
  color: #8B6914;
}

.rank-badge.rank-silver {
  background: #C0C0C0;
  color: #5A5A5A;
}

.rank-badge.rank-bronze {
  background: #CD7F32;
  color: #4A2C1A;
}

.rank-badge.rank-normal {
  background: #e1e8ed;
  color: #2c3e50;
}

.country-name {
  font-weight: 600;
  color: #2c3e50;
}

.happiness-score {
  color: #667eea;
  font-weight: 600;
}

.indicator-value {
  color: #2c3e50;
  font-weight: 500;
}

.trend-indicator {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.trend-indicator.positive {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.trend-indicator.negative {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.insights-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
}

.insights-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.insight-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid;
}

.insight-card.success {
  background: rgba(76, 175, 80, 0.05);
  border-left-color: #4CAF50;
}

.insight-card.warning {
  background: rgba(255, 193, 7, 0.05);
  border-left-color: #FFC107;
}

.insight-card.info {
  background: rgba(33, 150, 243, 0.05);
  border-left-color: #2196F3;
}

.insight-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.insight-content h4 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 16px;
}

.insight-content p {
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
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

@media (max-width: 968px) {
  .table-header,
  .table-row {
    grid-template-columns: 60px 1fr 100px 120px 80px;
    gap: 8px;
    font-size: 12px;
  }
  
  .overview-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}

@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: center;
  }
  
  .control-group select {
    min-width: 250px;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  
  .table-header > div,
  .table-row > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .table-header > div::before,
  .table-row > div::before {
    content: attr(data-label);
    font-weight: 600;
    color: #7f8c8d;
  }
}
</style>
