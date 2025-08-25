<template>
  <div class="india-dashboard">
    <div class="page-header">
      <h1>🇮🇳 India Happiness Dashboard</h1>
      <p>Detailed analysis of indicators that correlate with India's happiness index</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Time Period:</label>
        <select v-model="selectedPeriod" @change="loadData">
          <option value="recent">Recent Years (2019-2023)</option>
          <option value="extended">Extended Period (2015-2023)</option>
        </select>
      </div>
    </div>

    <!-- Key Metrics Cards -->
    <div class="metrics-grid" v-if="indiaStats">
      <div class="metric-card happiness">
        <div class="metric-icon">�</div>
        <div class="metric-content">
          <h3>Current Happiness Score</h3>
          <div class="metric-value">{{ indiaStats.currentHappiness.toFixed(3) }}</div>
          <div class="metric-trend" :class="indiaStats.happinessTrend > 0 ? 'positive' : 'negative'">
            {{ indiaStats.happinessTrend > 0 ? '↗' : '↘' }} {{ Math.abs(indiaStats.happinessTrend).toFixed(3) }} vs last year
          </div>
        </div>
      </div>

      <div class="metric-card regional">
        <div class="metric-icon">🌏</div>
        <div class="metric-content">
          <h3>Regional Ranking</h3>
          <div class="metric-value">#{{ indiaStats.regionalRank }}</div>
          <div class="metric-subtitle">in South Asia</div>
        </div>
      </div>

      <div class="metric-card global">
        <div class="metric-icon">🌍</div>
        <div class="metric-content">
          <h3>Global Position</h3>
          <div class="metric-value">#{{ indiaStats.globalRank }}</div>
          <div class="metric-subtitle">out of {{ indiaStats.totalCountries }} countries</div>
        </div>
      </div>

      <div class="metric-card improvement">
        <div class="metric-icon">📈</div>
        <div class="metric-content">
          <h3>Improvement Potential</h3>
          <div class="metric-value">+{{ indiaStats.improvementPotential.toFixed(2) }}</div>
          <div class="metric-subtitle">points possible</div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="charts-container">
      <div class="chart-section">
        <h3>India's Happiness Trends Over Time</h3>
        <canvas ref="trendChart"></canvas>
      </div>

      <div class="chart-section">
        <h3>Correlation with Development Indicators</h3>
        <canvas ref="correlationChart"></canvas>
      </div>
    </div>

    <!-- Analysis Sections -->
    <div class="analysis-container">
      <div class="analysis-section positive">
        <h3>🟢 Positive Correlations</h3>
        <p>Indicators that improve alongside happiness:</p>
        <div class="correlation-list">
          <div v-for="factor in positiveFactors" :key="factor.name" class="correlation-item">
            <span class="factor-name">{{ factor.name }}</span>
            <span class="correlation-value positive">+{{ factor.correlation.toFixed(3) }}</span>
          </div>
        </div>
      </div>

      <div class="analysis-section negative">
        <h3>🔴 Negative Correlations</h3>
        <p>Indicators that may impact happiness negatively:</p>
        <div class="correlation-list">
          <div v-for="factor in negativeFactors" :key="factor.name" class="correlation-item">
            <span class="factor-name">{{ factor.name }}</span>
            <span class="correlation-value negative">{{ factor.correlation.toFixed(3) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="recommendations-section">
      <h3>💡 Policy Recommendations</h3>
      <div class="recommendations-grid">
        <div v-for="rec in recommendations" :key="rec.title" class="recommendation-card">
          <div class="rec-icon">{{ rec.icon }}</div>
          <h4>{{ rec.title }}</h4>
          <p>{{ rec.description }}</p>
          <div class="rec-impact">Expected Impact: <span class="impact-value">{{ rec.impact }}</span></div>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading India dashboard data...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import worldBankService from '../services/worldBankService'

Chart.register(...registerables)

export default {
  name: 'IndiaDashboard',
  setup() {
    const trendChart = ref(null)
    const correlationChart = ref(null)
    const trendChartInstance = ref(null)
    const correlationChartInstance = ref(null)
    const selectedPeriod = ref('recent')
    const loading = ref(false)
    const error = ref(null)
    const indiaStats = ref(null)

    const positiveFactors = ref([
      { name: 'GDP per Capita', correlation: 0.742 },
      { name: 'Life Expectancy', correlation: 0.681 },
      { name: 'Education Expenditure', correlation: 0.524 }
    ])

    const negativeFactors = ref([
      { name: 'Unemployment Rate', correlation: -0.456 },
      { name: 'Inflation Rate', correlation: -0.321 },
      { name: 'Income Inequality', correlation: -0.587 }
    ])

    const recommendations = ref([
      {
        icon: '💼',
        title: 'Employment Generation',
        description: 'Focus on creating sustainable employment opportunities, especially in rural areas and for youth.',
        impact: 'High'
      },
      {
        icon: '🏥',
        title: 'Healthcare Access',
        description: 'Improve healthcare infrastructure and accessibility to increase life expectancy and overall well-being.',
        impact: 'High'
      },
      {
        icon: '📚',
        title: 'Education Investment',
        description: 'Increase education expenditure and focus on quality improvements in primary and secondary education.',
        impact: 'Medium'
      },
      {
        icon: '🏭',
        title: 'Economic Diversification',
        description: 'Diversify the economy to reduce dependency on specific sectors and increase GDP per capita.',
        impact: 'High'
      }
    ])

    const loadData = async () => {
      try {
        loading.value = true
        error.value = null

        // Mock India-specific data analysis
        const currentYear = 2023
        const years = selectedPeriod.value === 'recent' 
          ? [2019, 2020, 2021, 2022, 2023]
          : [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023]

        // India's happiness trend (mock realistic data)
        const happinessTrend = {
          2015: 4.015,
          2016: 4.034,
          2017: 4.042,
          2018: 4.028,
          2019: 4.036,
          2020: 3.987, // COVID impact
          2021: 3.994,
          2022: 4.011,
          2023: 4.036
        }

        // Calculate statistics
        const currentHappiness = happinessTrend[currentYear]
        const previousYearHappiness = happinessTrend[currentYear - 1]
        const happinessTrendValue = currentHappiness - previousYearHappiness

        indiaStats.value = {
          currentHappiness,
          happinessTrend: happinessTrendValue,
          regionalRank: 3, // in South Asia
          globalRank: 126, // approximate global ranking
          totalCountries: 156,
          improvementPotential: 7.5 - currentHappiness // potential to reach top happiness levels
        }

        await nextTick()
        createTrendChart(years, happinessTrend)
        createCorrelationChart()

      } catch (err) {
        error.value = `Failed to load India dashboard data: ${err.message}`
        console.error('Error loading India dashboard:', err)
      } finally {
        loading.value = false
      }
    }

    const createTrendChart = (years, happinessData) => {
      if (trendChartInstance.value) {
        trendChartInstance.value.destroy()
      }

      if (!trendChart.value) return

      const data = years.map(year => happinessData[year])

      trendChartInstance.value = new Chart(trendChart.value, {
        type: 'line',
        data: {
          labels: years,
          datasets: [{
            label: "India's Happiness Score",
            data: data,
            borderColor: '#FF6B35',
            backgroundColor: 'rgba(255, 107, 53, 0.1)',
            fill: true,
            tension: 0.4,
            pointRadius: 6,
            pointHoverRadius: 8,
            pointBackgroundColor: '#FF6B35',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "India's Happiness Score Trajectory",
              font: { size: 14 }
            },
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: false,
              min: Math.min(...data) - 0.1,
              max: Math.max(...data) + 0.1,
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
      })
    }

    const createCorrelationChart = () => {
      if (correlationChartInstance.value) {
        correlationChartInstance.value.destroy()
      }

      if (!correlationChart.value) return

      const allFactors = [...positiveFactors.value, ...negativeFactors.value]
      const labels = allFactors.map(f => f.name)
      const correlations = allFactors.map(f => f.correlation)
      const colors = correlations.map(c => c > 0 ? '#4CAF50' : '#F44336')

      correlationChartInstance.value = new Chart(correlationChart.value, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Correlation with Happiness',
            data: correlations,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            title: {
              display: true,
              text: 'Indicator Correlations with Happiness',
              font: { size: 14 }
            },
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              min: -1,
              max: 1,
              title: {
                display: true,
                text: 'Correlation Coefficient'
              }
            }
          }
        }
      })
    }

    onMounted(async () => {
      await loadData()
    })

    return {
      trendChart,
      correlationChart,
      selectedPeriod,
      loading,
      error,
      indiaStats,
      positiveFactors,
      negativeFactors,
      recommendations,
      loadData
    }
  }
}
</script>

<style scoped>
.india-dashboard {
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
  font-size: 2.5rem;
}

.page-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.controls {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
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

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.metric-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s;
}

.metric-card:hover {
  transform: translateY(-2px);
}

.metric-card.happiness {
  border-left: 4px solid #FF6B35;
}

.metric-card.regional {
  border-left: 4px solid #4CAF50;
}

.metric-card.global {
  border-left: 4px solid #2196F3;
}

.metric-card.improvement {
  border-left: 4px solid #9C27B0;
}

.metric-icon {
  font-size: 2rem;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 50%;
}

.metric-content h3 {
  color: #2c3e50;
  margin-bottom: 8px;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  line-height: 1;
}

.metric-trend {
  font-size: 12px;
  margin-top: 4px;
}

.metric-trend.positive {
  color: #4CAF50;
}

.metric-trend.negative {
  color: #F44336;
}

.metric-subtitle {
  font-size: 12px;
  color: #7f8c8d;
  margin-top: 4px;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.chart-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 400px;
}

.chart-section h3 {
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
  font-size: 16px;
}

.analysis-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.analysis-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.analysis-section.positive {
  border-left: 4px solid #4CAF50;
}

.analysis-section.negative {
  border-left: 4px solid #F44336;
}

.analysis-section h3 {
  color: #2c3e50;
  margin-bottom: 16px;
}

.analysis-section p {
  color: #7f8c8d;
  margin-bottom: 20px;
}

.correlation-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.correlation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.factor-name {
  color: #2c3e50;
  font-weight: 500;
}

.correlation-value {
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
}

.correlation-value.positive {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.correlation-value.negative {
  background: rgba(244, 67, 54, 0.1);
  color: #F44336;
}

.recommendations-section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
}

.recommendations-section h3 {
  color: #2c3e50;
  margin-bottom: 24px;
  text-align: center;
  font-size: 20px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.recommendation-card {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.2s;
}

.recommendation-card:hover {
  transform: translateY(-2px);
}

.rec-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.recommendation-card h4 {
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 16px;
}

.recommendation-card p {
  color: #7f8c8d;
  margin-bottom: 16px;
  line-height: 1.5;
}

.rec-impact {
  font-size: 14px;
  color: #34495e;
}

.impact-value {
  font-weight: bold;
  color: #667eea;
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
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .analysis-container {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }
  
  .recommendations-grid {
    grid-template-columns: 1fr;
  }
}
</style>
