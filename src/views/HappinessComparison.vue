<template>
  <div class="happiness-comparison">
    <div class="page-header">
      <h1>Happiness vs Indicators Comparison</h1>
      <p>Compare happiness scores with various development indicators for all countries using interactive scatter plots</p>
    </div>

    <div class="controls">
      <div class="control-group">
        <label>Select Indicator to Compare:</label>
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
    </div>

    <div class="chart-container" v-if="!loading && !error">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <div class="data-summary" v-if="!loading && !error && chartData">
      <h3>Data Summary</h3>
      <div class="summary-stats">
        <div class="stat-card">
          <span class="stat-label">Countries Displayed:</span>
          <span class="stat-value">{{ chartData.datasets[0].data.length }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Highest Happiness:</span>
          <span class="stat-value">{{ getHighestHappiness() }}</span>
        </div>
        <div class="stat-card">
          <span class="stat-label">Lowest Happiness:</span>
          <span class="stat-value">{{ getLowestHappiness() }}</span>
        </div>
      </div>
    </div>

    <div class="correlation-info" v-if="correlationData && !loading">
      <h3>Correlation Analysis</h3>
      <div class="correlation-stats">
        <div class="stat-item">
          <span class="stat-label">Correlation Coefficient:</span>
          <span class="stat-value" :class="getCorrelationClass(correlationData.coefficient)">
            {{ correlationData.coefficient.toFixed(3) }}
          </span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Relationship Strength:</span>
          <span class="stat-value">{{ correlationData.strength }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Direction:</span>
          <span class="stat-value">{{ correlationData.direction }}</span>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading">
      <p>Loading comparison data...</p>
    </div>

    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { Chart, registerables } from 'chart.js'
import worldBankService from '../services/worldBankService'

Chart.register(...registerables)

export default {
  name: 'HappinessComparison',
  setup() {
    const chartCanvas = ref(null)
    const chartInstance = ref(null)
    const selectedIndicator = ref('NY.GDP.PCAP.CD')
    const selectedYear = ref(2023)
    const chartData = ref(null)
    const correlationData = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const availableYears = ref([2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015])
    
    // All available countries data - 100 countries from different global regions
    const allCountries = [
      // North America
      { id: 'USA', name: 'United States', region: 'North America' },
      { id: 'CAN', name: 'Canada', region: 'North America' },
      { id: 'MEX', name: 'Mexico', region: 'North America' },
      
      // Europe & Central Asia
      { id: 'DEU', name: 'Germany', region: 'Europe & Central Asia' },
      { id: 'GBR', name: 'United Kingdom', region: 'Europe & Central Asia' },
      { id: 'FRA', name: 'France', region: 'Europe & Central Asia' },
      { id: 'ITA', name: 'Italy', region: 'Europe & Central Asia' },
      { id: 'ESP', name: 'Spain', region: 'Europe & Central Asia' },
      { id: 'NLD', name: 'Netherlands', region: 'Europe & Central Asia' },
      { id: 'CHE', name: 'Switzerland', region: 'Europe & Central Asia' },
      { id: 'SWE', name: 'Sweden', region: 'Europe & Central Asia' },
      { id: 'NOR', name: 'Norway', region: 'Europe & Central Asia' },
      { id: 'DNK', name: 'Denmark', region: 'Europe & Central Asia' },
      { id: 'FIN', name: 'Finland', region: 'Europe & Central Asia' },
      { id: 'AUT', name: 'Austria', region: 'Europe & Central Asia' },
      { id: 'BEL', name: 'Belgium', region: 'Europe & Central Asia' },
      { id: 'IRL', name: 'Ireland', region: 'Europe & Central Asia' },
      { id: 'PRT', name: 'Portugal', region: 'Europe & Central Asia' },
      { id: 'GRC', name: 'Greece', region: 'Europe & Central Asia' },
      { id: 'POL', name: 'Poland', region: 'Europe & Central Asia' },
      { id: 'CZE', name: 'Czech Republic', region: 'Europe & Central Asia' },
      { id: 'HUN', name: 'Hungary', region: 'Europe & Central Asia' },
      { id: 'SVK', name: 'Slovakia', region: 'Europe & Central Asia' },
      { id: 'SVN', name: 'Slovenia', region: 'Europe & Central Asia' },
      { id: 'EST', name: 'Estonia', region: 'Europe & Central Asia' },
      { id: 'LVA', name: 'Latvia', region: 'Europe & Central Asia' },
      { id: 'LTU', name: 'Lithuania', region: 'Europe & Central Asia' },
      { id: 'RUS', name: 'Russia', region: 'Europe & Central Asia' },
      { id: 'UKR', name: 'Ukraine', region: 'Europe & Central Asia' },
      { id: 'TUR', name: 'Turkey', region: 'Europe & Central Asia' },
      
      // East Asia & Pacific
      { id: 'CHN', name: 'China', region: 'East Asia & Pacific' },
      { id: 'JPN', name: 'Japan', region: 'East Asia & Pacific' },
      { id: 'AUS', name: 'Australia', region: 'East Asia & Pacific' },
      { id: 'KOR', name: 'South Korea', region: 'East Asia & Pacific' },
      { id: 'NZL', name: 'New Zealand', region: 'East Asia & Pacific' },
      { id: 'SGP', name: 'Singapore', region: 'East Asia & Pacific' },
      { id: 'MYS', name: 'Malaysia', region: 'East Asia & Pacific' },
      { id: 'THA', name: 'Thailand', region: 'East Asia & Pacific' },
      { id: 'VNM', name: 'Vietnam', region: 'East Asia & Pacific' },
      { id: 'IDN', name: 'Indonesia', region: 'East Asia & Pacific' },
      { id: 'PHL', name: 'Philippines', region: 'East Asia & Pacific' },
      { id: 'TWN', name: 'Taiwan', region: 'East Asia & Pacific' },
      { id: 'HKG', name: 'Hong Kong', region: 'East Asia & Pacific' },
      { id: 'MAC', name: 'Macao', region: 'East Asia & Pacific' },
      { id: 'BRN', name: 'Brunei', region: 'East Asia & Pacific' },
      { id: 'KHM', name: 'Cambodia', region: 'East Asia & Pacific' },
      { id: 'LAO', name: 'Laos', region: 'East Asia & Pacific' },
      { id: 'MMR', name: 'Myanmar', region: 'East Asia & Pacific' },
      { id: 'PNG', name: 'Papua New Guinea', region: 'East Asia & Pacific' },
      { id: 'FJI', name: 'Fiji', region: 'East Asia & Pacific' },
      
      // South Asia
      { id: 'IND', name: 'India', region: 'South Asia' },
      { id: 'PAK', name: 'Pakistan', region: 'South Asia' },
      { id: 'BGD', name: 'Bangladesh', region: 'South Asia' },
      { id: 'LKA', name: 'Sri Lanka', region: 'South Asia' },
      { id: 'NPL', name: 'Nepal', region: 'South Asia' },
      { id: 'BTN', name: 'Bhutan', region: 'South Asia' },
      { id: 'MDV', name: 'Maldives', region: 'South Asia' },
      { id: 'AFG', name: 'Afghanistan', region: 'South Asia' },
      
      // Latin America & Caribbean
      { id: 'BRA', name: 'Brazil', region: 'Latin America & Caribbean' },
      { id: 'ARG', name: 'Argentina', region: 'Latin America & Caribbean' },
      { id: 'CHL', name: 'Chile', region: 'Latin America & Caribbean' },
      { id: 'COL', name: 'Colombia', region: 'Latin America & Caribbean' },
      { id: 'PER', name: 'Peru', region: 'Latin America & Caribbean' },
      { id: 'URY', name: 'Uruguay', region: 'Latin America & Caribbean' },
      { id: 'ECU', name: 'Ecuador', region: 'Latin America & Caribbean' },
      { id: 'BOL', name: 'Bolivia', region: 'Latin America & Caribbean' },
      { id: 'PRY', name: 'Paraguay', region: 'Latin America & Caribbean' },
      { id: 'VEN', name: 'Venezuela', region: 'Latin America & Caribbean' },
      { id: 'CRI', name: 'Costa Rica', region: 'Latin America & Caribbean' },
      { id: 'PAN', name: 'Panama', region: 'Latin America & Caribbean' },
      { id: 'GTM', name: 'Guatemala', region: 'Latin America & Caribbean' },
      { id: 'HND', name: 'Honduras', region: 'Latin America & Caribbean' },
      { id: 'NIC', name: 'Nicaragua', region: 'Latin America & Caribbean' },
      { id: 'SLV', name: 'El Salvador', region: 'Latin America & Caribbean' },
      { id: 'CUB', name: 'Cuba', region: 'Latin America & Caribbean' },
      { id: 'JAM', name: 'Jamaica', region: 'Latin America & Caribbean' },
      { id: 'DOM', name: 'Dominican Republic', region: 'Latin America & Caribbean' },
      { id: 'TTO', name: 'Trinidad and Tobago', region: 'Latin America & Caribbean' },
      
      // Middle East & North Africa
      { id: 'SAU', name: 'Saudi Arabia', region: 'Middle East & North Africa' },
      { id: 'ARE', name: 'United Arab Emirates', region: 'Middle East & North Africa' },
      { id: 'ISR', name: 'Israel', region: 'Middle East & North Africa' },
      { id: 'QAT', name: 'Qatar', region: 'Middle East & North Africa' },
      { id: 'KWT', name: 'Kuwait', region: 'Middle East & North Africa' },
      { id: 'BHR', name: 'Bahrain', region: 'Middle East & North Africa' },
      { id: 'OMN', name: 'Oman', region: 'Middle East & North Africa' },
      { id: 'JOR', name: 'Jordan', region: 'Middle East & North Africa' },
      { id: 'LBN', name: 'Lebanon', region: 'Middle East & North Africa' },
      { id: 'EGY', name: 'Egypt', region: 'Middle East & North Africa' },
      { id: 'MAR', name: 'Morocco', region: 'Middle East & North Africa' },
      { id: 'TUN', name: 'Tunisia', region: 'Middle East & North Africa' },
      { id: 'DZA', name: 'Algeria', region: 'Middle East & North Africa' },
      { id: 'IRN', name: 'Iran', region: 'Middle East & North Africa' },
      { id: 'IRQ', name: 'Iraq', region: 'Middle East & North Africa' },
      
      // Sub-Saharan Africa
      { id: 'ZAF', name: 'South Africa', region: 'Sub-Saharan Africa' },
      { id: 'NGA', name: 'Nigeria', region: 'Sub-Saharan Africa' },
      { id: 'KEN', name: 'Kenya', region: 'Sub-Saharan Africa' },
      { id: 'ETH', name: 'Ethiopia', region: 'Sub-Saharan Africa' },
      { id: 'GHA', name: 'Ghana', region: 'Sub-Saharan Africa' },
      { id: 'UGA', name: 'Uganda', region: 'Sub-Saharan Africa' },
      { id: 'TZA', name: 'Tanzania', region: 'Sub-Saharan Africa' },
      { id: 'RWA', name: 'Rwanda', region: 'Sub-Saharan Africa' },
      { id: 'SEN', name: 'Senegal', region: 'Sub-Saharan Africa' },
      { id: 'BWA', name: 'Botswana', region: 'Sub-Saharan Africa' },
      { id: 'MUS', name: 'Mauritius', region: 'Sub-Saharan Africa' },
      { id: 'NAM', name: 'Namibia', region: 'Sub-Saharan Africa' }
    ]

    const indicatorNames = {
      'NY.GDP.PCAP.CD': 'GDP per Capita (USD)',
      'SP.DYN.LE00.IN': 'Life Expectancy (years)',
      'SL.UEM.TOTL.ZS': 'Unemployment Rate (%)',
      'SE.XPD.TOTL.GD.ZS': 'Education Expenditure (% of GDP)'
    }

    // Mock happiness data for all 100 countries
    const mockHappinessData = {
      // North America
      'USA': 6.894, 'CAN': 7.103, 'MEX': 6.317,
      
      // Europe & Central Asia
      'DEU': 7.034, 'GBR': 7.064, 'FRA': 6.661, 'ITA': 6.387, 'ESP': 6.491,
      'NLD': 7.449, 'CHE': 7.560, 'SWE': 7.353, 'NOR': 7.488, 'DNK': 7.636,
      'FIN': 7.842, 'AUT': 7.268, 'BEL': 6.834, 'IRL': 6.977, 'PRT': 5.929,
      'GRC': 5.723, 'POL': 6.166, 'CZE': 6.965, 'HUN': 6.000, 'SVK': 6.173,
      'SVN': 6.461, 'EST': 6.455, 'LVA': 6.032, 'LTU': 6.216, 'RUS': 5.546,
      'UKR': 4.561, 'TUR': 5.488,
      
      // East Asia & Pacific
      'CHN': 5.125, 'JPN': 5.886, 'AUS': 7.162, 'KOR': 5.845, 'NZL': 7.300,
      'SGP': 6.343, 'MYS': 5.384, 'THA': 6.072, 'VNM': 5.411, 'IDN': 5.277,
      'PHL': 5.880, 'TWN': 6.446, 'HKG': 5.477, 'MAC': 5.558, 'BRN': 6.041,
      'KHM': 4.848, 'LAO': 5.030, 'MMR': 4.426, 'PNG': 5.084, 'FJI': 5.891,
      
      // South Asia
      'IND': 4.036, 'PAK': 4.555, 'BGD': 5.025, 'LKA': 4.366, 'NPL': 5.269,
      'BTN': 5.985, 'MDV': 5.198, 'AFG': 2.404,
      
      // Latin America & Caribbean
      'BRA': 6.293, 'ARG': 5.975, 'CHL': 6.172, 'COL': 6.012, 'PER': 5.697,
      'URY': 6.431, 'ECU': 5.925, 'BOL': 5.600, 'PRY': 5.692, 'VEN': 5.053,
      'CRI': 7.069, 'PAN': 6.180, 'GTM': 6.262, 'HND': 5.860, 'NIC': 5.972,
      'SLV': 6.253, 'CUB': 5.176, 'JAM': 5.890, 'DOM': 5.545, 'TTO': 6.192,
      
      // Middle East & North Africa
      'SAU': 6.494, 'ARE': 6.791, 'ISR': 7.364, 'QAT': 6.374, 'KWT': 6.106,
      'BHR': 6.227, 'OMN': 7.025, 'JOR': 4.633, 'LBN': 2.955, 'EGY': 4.166,
      'MAR': 5.060, 'TUN': 4.596, 'DZA': 5.005, 'IRN': 4.721, 'IRQ': 4.854,
      
      // Sub-Saharan Africa
      'ZAF': 4.946, 'NGA': 4.552, 'KEN': 4.543, 'ETH': 4.186, 'GHA': 5.088,
      'UGA': 4.432, 'TZA': 3.702, 'RWA': 3.268, 'SEN': 4.981, 'BWA': 3.467,
      'MUS': 6.071, 'NAM': 4.451
    }

    // Mock indicator data for different indicators - all 100 countries
    const mockIndicatorData = {
      'NY.GDP.PCAP.CD': {
        // North America
        'USA': 63593, 'CAN': 43258, 'MEX': 9673,
        
        // Europe & Central Asia
        'DEU': 46259, 'GBR': 41030, 'FRA': 38625, 'ITA': 31955, 'ESP': 27057,
        'NLD': 52331, 'CHE': 81867, 'SWE': 51648, 'NOR': 75420, 'DNK': 60170,
        'FIN': 48810, 'AUT': 45437, 'BEL': 42658, 'IRL': 69727, 'PRT': 22439,
        'GRC': 17676, 'POL': 13823, 'CZE': 21821, 'HUN': 15731, 'SVK': 18596,
        'SVN': 25104, 'EST': 22990, 'LVA': 17861, 'LTU': 19158, 'RUS': 11289,
        'UKR': 3726, 'TUR': 9661,
        
        // East Asia & Pacific
        'CHN': 10500, 'JPN': 39285, 'AUS': 51812, 'KOR': 31846, 'NZL': 42084,
        'SGP': 59797, 'MYS': 11373, 'THA': 7189, 'VNM': 3755, 'IDN': 4256,
        'PHL': 3485, 'TWN': 32123, 'HKG': 46323, 'MAC': 43897, 'BRN': 31087,
        'KHM': 1625, 'LAO': 2535, 'MMR': 1400, 'PNG': 2729, 'FJI': 6071,
        
        // South Asia
        'IND': 2256, 'PAK': 1543, 'BGD': 2503, 'LKA': 3682, 'NPL': 1155,
        'BTN': 3360, 'MDV': 10366, 'AFG': 507,
        
        // Latin America & Caribbean
        'BRA': 8897, 'ARG': 10003, 'CHL': 15346, 'COL': 6131, 'PER': 6692,
        'URY': 16190, 'ECU': 6196, 'BOL': 3552, 'PRY': 5821, 'VEN': 6691,
        'CRI': 12509, 'PAN': 15575, 'GTM': 4603, 'HND': 2574, 'NIC': 2151,
        'SLV': 4408, 'CUB': 8821, 'JAM': 5362, 'DOM': 8052, 'TTO': 15438,
        
        // Middle East & North Africa
        'SAU': 23139, 'ARE': 43103, 'ISR': 43593, 'QAT': 61276, 'KWT': 29040,
        'BHR': 23504, 'OMN': 15341, 'JOR': 4406, 'LBN': 5490, 'EGY': 3547,
        'MAR': 3204, 'TUN': 3807, 'DZA': 4206, 'IRN': 3290, 'IRQ': 4157,
        
        // Sub-Saharan Africa
        'ZAF': 6994, 'NGA': 2085, 'KEN': 1838, 'ETH': 925, 'GHA': 2202,
        'UGA': 817, 'TZA': 1122, 'RWA': 822, 'SEN': 1488, 'BWA': 7348,
        'MUS': 10021, 'NAM': 4729
      },
      'SP.DYN.LE00.IN': {
        // North America
        'USA': 78.9, 'CAN': 82.4, 'MEX': 75.0,
        
        // Europe & Central Asia
        'DEU': 81.3, 'GBR': 81.2, 'FRA': 82.7, 'ITA': 83.5, 'ESP': 83.6,
        'NLD': 82.3, 'CHE': 83.8, 'SWE': 82.8, 'NOR': 82.3, 'DNK': 80.9,
        'FIN': 81.7, 'AUT': 81.6, 'BEL': 82.0, 'IRL': 82.3, 'PRT': 82.1,
        'GRC': 82.3, 'POL': 78.7, 'CZE': 79.4, 'HUN': 76.4, 'SVK': 77.5,
        'SVN': 81.3, 'EST': 78.8, 'LVA': 75.3, 'LTU': 75.9, 'RUS': 72.6,
        'UKR': 71.8, 'TUR': 77.7,
        
        // East Asia & Pacific
        'CHN': 78.2, 'JPN': 84.6, 'AUS': 83.4, 'KOR': 83.5, 'NZL': 82.3,
        'SGP': 83.6, 'MYS': 76.2, 'THA': 77.2, 'VNM': 75.4, 'IDN': 71.7,
        'PHL': 71.2, 'TWN': 80.9, 'HKG': 85.2, 'MAC': 84.7, 'BRN': 75.9,
        'KHM': 69.8, 'LAO': 68.1, 'MMR': 67.1, 'PNG': 64.5, 'FJI': 67.4,
        
        // South Asia
        'IND': 69.7, 'PAK': 67.3, 'BGD': 72.6, 'LKA': 76.4, 'NPL': 70.8,
        'BTN': 71.8, 'MDV': 78.9, 'AFG': 64.8,
        
        // Latin America & Caribbean
        'BRA': 76.2, 'ARG': 76.7, 'CHL': 80.2, 'COL': 77.3, 'PER': 76.7,
        'URY': 78.0, 'ECU': 77.0, 'BOL': 71.2, 'PRY': 74.3, 'VEN': 72.1,
        'CRI': 80.3, 'PAN': 78.5, 'GTM': 74.3, 'HND': 75.3, 'NIC': 74.5,
        'SLV': 73.3, 'CUB': 78.8, 'JAM': 74.5, 'DOM': 74.0, 'TTO': 73.6,
        
        // Middle East & North Africa
        'SAU': 75.1, 'ARE': 78.0, 'ISR': 83.0, 'QAT': 80.2, 'KWT': 75.5,
        'BHR': 77.3, 'OMN': 78.0, 'JOR': 74.5, 'LBN': 79.3, 'EGY': 71.9,
        'MAR': 76.7, 'TUN': 76.7, 'DZA': 76.9, 'IRN': 76.7, 'IRQ': 70.6,
        
        // Sub-Saharan Africa
        'ZAF': 64.1, 'NGA': 54.3, 'KEN': 66.7, 'ETH': 66.6, 'GHA': 64.1,
        'UGA': 63.4, 'TZA': 65.5, 'RWA': 69.0, 'SEN': 67.9, 'BWA': 69.6,
        'MUS': 74.9, 'NAM': 63.4
      },
      'SL.UEM.TOTL.ZS': {
        // North America
        'USA': 3.7, 'CAN': 5.2, 'MEX': 3.4,
        
        // Europe & Central Asia
        'DEU': 3.1, 'GBR': 3.7, 'FRA': 7.3, 'ITA': 8.1, 'ESP': 12.9,
        'NLD': 3.6, 'CHE': 3.0, 'SWE': 7.6, 'NOR': 3.9, 'DNK': 4.9,
        'FIN': 7.8, 'AUT': 4.8, 'BEL': 5.6, 'IRL': 4.5, 'PRT': 6.6,
        'GRC': 11.2, 'POL': 2.9, 'CZE': 2.2, 'HUN': 3.4, 'SVK': 6.6,
        'SVN': 4.2, 'EST': 5.4, 'LVA': 6.9, 'LTU': 8.5, 'RUS': 4.6,
        'UKR': 8.9, 'TUR': 10.9,
        
        // East Asia & Pacific
        'CHN': 4.3, 'JPN': 2.8, 'AUS': 3.7, 'KOR': 2.7, 'NZL': 3.2,
        'SGP': 2.3, 'MYS': 3.3, 'THA': 1.2, 'VNM': 2.2, 'IDN': 4.1,
        'PHL': 2.4, 'TWN': 3.8, 'HKG': 2.9, 'MAC': 1.9, 'BRN': 9.1,
        'KHM': 0.4, 'LAO': 1.4, 'MMR': 1.6, 'PNG': 2.5, 'FJI': 4.5,
        
        // South Asia
        'IND': 2.9, 'PAK': 4.3, 'BGD': 4.2, 'LKA': 4.7, 'NPL': 11.4,
        'BTN': 2.4, 'MDV': 7.0, 'AFG': 13.3,
        
        // Latin America & Caribbean
        'BRA': 9.3, 'ARG': 7.1, 'CHL': 7.2, 'COL': 10.5, 'PER': 3.9,
        'URY': 8.3, 'ECU': 3.8, 'BOL': 3.5, 'PRY': 5.7, 'VEN': 7.7,
        'CRI': 11.8, 'PAN': 7.3, 'GTM': 2.4, 'HND': 5.7, 'NIC': 5.0,
        'SLV': 4.1, 'CUB': 1.3, 'JAM': 8.0, 'DOM': 5.8, 'TTO': 4.1,
        
        // Middle East & North Africa
        'SAU': 6.6, 'ARE': 2.4, 'ISR': 3.8, 'QAT': 0.1, 'KWT': 2.1,
        'BHR': 1.2, 'OMN': 3.0, 'JOR': 22.7, 'LBN': 6.2, 'EGY': 7.4,
        'MAR': 9.2, 'TUN': 16.2, 'DZA': 11.7, 'IRN': 9.1, 'IRQ': 13.0,
        
        // Sub-Saharan Africa
        'ZAF': 28.7, 'NGA': 9.8, 'KEN': 5.7, 'ETH': 5.2, 'GHA': 4.5,
        'UGA': 1.9, 'TZA': 2.4, 'RWA': 16.7, 'SEN': 6.6, 'BWA': 24.9,
        'MUS': 6.9, 'NAM': 29.6
      },
      'SE.XPD.TOTL.GD.ZS': {
        // North America
        'USA': 6.1, 'CAN': 5.3, 'MEX': 5.2,
        
        // Europe & Central Asia
        'DEU': 4.9, 'GBR': 5.5, 'FRA': 5.4, 'ITA': 4.1, 'ESP': 4.6,
        'NLD': 5.2, 'CHE': 5.3, 'SWE': 7.6, 'NOR': 7.6, 'DNK': 6.4,
        'FIN': 6.6, 'AUT': 5.6, 'BEL': 6.7, 'IRL': 3.5, 'PRT': 5.0,
        'GRC': 4.3, 'POL': 4.9, 'CZE': 5.8, 'HUN': 4.8, 'SVK': 4.1,
        'SVN': 5.8, 'EST': 6.2, 'LVA': 6.3, 'LTU': 4.2, 'RUS': 4.7,
        'UKR': 5.4, 'TUR': 4.3,
        
        // East Asia & Pacific
        'CHN': 4.1, 'JPN': 3.2, 'AUS': 5.0, 'KOR': 4.3, 'NZL': 6.0,
        'SGP': 2.9, 'MYS': 4.8, 'THA': 4.1, 'VNM': 5.7, 'IDN': 3.5,
        'PHL': 4.1, 'TWN': 6.2, 'HKG': 3.3, 'MAC': 2.7, 'BRN': 4.4,
        'KHM': 2.2, 'LAO': 2.9, 'MMR': 2.1, 'PNG': 1.4, 'FJI': 4.7,
        
        // South Asia
        'IND': 4.6, 'PAK': 2.9, 'BGD': 2.1, 'LKA': 3.1, 'NPL': 5.1,
        'BTN': 7.4, 'MDV': 4.2, 'AFG': 4.1,
        
        // Latin America & Caribbean
        'BRA': 6.0, 'ARG': 5.0, 'CHL': 5.4, 'COL': 4.5, 'PER': 3.8,
        'URY': 4.4, 'ECU': 5.0, 'BOL': 7.3, 'PRY': 3.4, 'VEN': 6.9,
        'CRI': 7.0, 'PAN': 3.2, 'GTM': 2.8, 'HND': 6.0, 'NIC': 4.5,
        'SLV': 3.8, 'CUB': 12.9, 'JAM': 5.4, 'DOM': 4.0, 'TTO': 4.1,
        
        // Middle East & North Africa
        'SAU': 7.8, 'ARE': 1.3, 'ISR': 7.5, 'QAT': 2.3, 'KWT': 3.8,
        'BHR': 2.6, 'OMN': 5.7, 'JOR': 3.0, 'LBN': 2.5, 'EGY': 2.5,
        'MAR': 5.3, 'TUN': 6.6, 'DZA': 7.2, 'IRN': 4.0, 'IRQ': 5.7,
        
        // Sub-Saharan Africa
        'ZAF': 6.2, 'NGA': 0.5, 'KEN': 5.2, 'ETH': 4.5, 'GHA': 4.0,
        'UGA': 2.3, 'TZA': 3.4, 'RWA': 3.1, 'SEN': 5.1, 'BWA': 9.6,
        'MUS': 4.8, 'NAM': 8.1
      }
    }

    const destroyChart = () => {
      if (chartInstance.value) {
        chartInstance.value.destroy()
        chartInstance.value = null
      }
    }

    const loadData = async () => {
      loading.value = true
      error.value = null
      
      try {
        // Combine data for all countries
        const combinedData = []
        
        allCountries.forEach(country => {
          const happinessScore = mockHappinessData[country.id]
          const indicatorValue = mockIndicatorData[selectedIndicator.value]?.[country.id]
          
          if (happinessScore && indicatorValue !== undefined) {
            combinedData.push({
              country: country.name,
              countryCode: country.id,
              happiness: happinessScore,
              indicator: indicatorValue,
              region: country.region
            })
          }
        })

        if (combinedData.length === 0) {
          error.value = 'No data available for the selected indicator.'
          loading.value = false
          return
        }

        // Calculate correlation
        correlationData.value = calculateCorrelation(combinedData)

        // Create chart data with different colors for different regions
        const regionColors = {
          'North America': 'rgba(255, 99, 132, 0.7)',
          'South Asia': 'rgba(54, 162, 235, 0.7)',
          'East Asia & Pacific': 'rgba(255, 205, 86, 0.7)',
          'Europe & Central Asia': 'rgba(75, 192, 192, 0.7)',
          'Latin America & Caribbean': 'rgba(153, 102, 255, 0.7)',
          'Middle East & North Africa': 'rgba(255, 159, 64, 0.7)',
          'Sub-Saharan Africa': 'rgba(199, 199, 199, 0.7)'
        }

        chartData.value = {
          datasets: [{
            label: `${indicatorNames[selectedIndicator.value]} vs Happiness Score`,
            data: combinedData.map(item => ({
              x: item.indicator,
              y: item.happiness,
              country: item.country,
              region: item.region
            })),
            backgroundColor: combinedData.map(item => regionColors[item.region] || 'rgba(102, 126, 234, 0.7)'),
            borderColor: combinedData.map(item => {
              const color = regionColors[item.region] || 'rgba(102, 126, 234, 0.7)'
              return color.replace('0.7', '1')
            }),
            borderWidth: 2,
            pointRadius: 8,
            pointHoverRadius: 10
          }]
        }

        loading.value = false
        createChart()

      } catch (err) {
        error.value = `Failed to load comparison data: ${err.message || 'Unknown error'}`
        console.error('Error loading comparison data:', err)
        loading.value = false
      }
    }

    const calculateCorrelation = (data) => {
      if (data.length < 2) return null

      const n = data.length
      const sumX = data.reduce((sum, item) => sum + item.indicator, 0)
      const sumY = data.reduce((sum, item) => sum + item.happiness, 0)
      const sumXY = data.reduce((sum, item) => sum + (item.indicator * item.happiness), 0)
      const sumX2 = data.reduce((sum, item) => sum + (item.indicator * item.indicator), 0)
      const sumY2 = data.reduce((sum, item) => sum + (item.happiness * item.happiness), 0)

      const numerator = (n * sumXY) - (sumX * sumY)
      const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)))
      
      const coefficient = denominator === 0 ? 0 : numerator / denominator

      let strength = 'None'
      const abs = Math.abs(coefficient)
      if (abs >= 0.7) strength = 'Strong'
      else if (abs >= 0.5) strength = 'Moderate'
      else if (abs >= 0.3) strength = 'Weak'

      const direction = coefficient > 0 ? 'Positive' : coefficient < 0 ? 'Negative' : 'None'

      return { coefficient, strength, direction }
    }

    const getCorrelationClass = (coefficient) => {
      const abs = Math.abs(coefficient)
      if (abs >= 0.7) return 'strong-correlation'
      if (abs >= 0.5) return 'moderate-correlation'
      if (abs >= 0.3) return 'weak-correlation'
      return 'no-correlation'
    }

    const getHighestHappiness = () => {
      if (!chartData.value?.datasets[0]?.data) return 'N/A'
      const maxHappiness = Math.max(...chartData.value.datasets[0].data.map(d => d.y))
      const country = chartData.value.datasets[0].data.find(d => d.y === maxHappiness)?.country
      return `${country} (${maxHappiness.toFixed(2)})`
    }

    const getLowestHappiness = () => {
      if (!chartData.value?.datasets[0]?.data) return 'N/A'
      const minHappiness = Math.min(...chartData.value.datasets[0].data.map(d => d.y))
      const country = chartData.value.datasets[0].data.find(d => d.y === minHappiness)?.country
      return `${country} (${minHappiness.toFixed(2)})`
    }

    const createChart = () => {
      if (!chartCanvas.value || !chartData.value) return

      destroyChart()

      try {
        chartInstance.value = new Chart(chartCanvas.value, {
          type: 'scatter',
          data: chartData.value,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: true,
                text: `${indicatorNames[selectedIndicator.value]} vs Happiness Score (${selectedYear.value})`,
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
                      `Region: ${point.region}`,
                      `${indicatorNames[selectedIndicator.value]}: ${point.x.toLocaleString()}`,
                      `Happiness Score: ${point.y.toFixed(2)}`
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
                },
                min: 0,
                max: 10
              }
            }
          }
        })
      } catch (chartError) {
        console.error('Error creating chart:', chartError)
        error.value = `Failed to create chart: ${chartError.message}`
      }
    }

    onMounted(() => {
      loadData()
    })

    return {
      chartCanvas,
      selectedIndicator,
      selectedYear,
      availableYears,
      chartData,
      correlationData,
      loading,
      error,
      loadData,
      getCorrelationClass,
      getHighestHappiness,
      getLowestHappiness
    }
  }
}
</script>

<style scoped>
.happiness-comparison {
  padding: 2rem;
  max-width: 1400px;
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

.control-group select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.chart-container {
  height: 600px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.data-summary {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.data-summary h3 {
  margin-bottom: 1rem;
  color: #333;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-weight: 600;
  color: #555;
}

.stat-value {
  font-weight: 700;
  color: #333;
}

.correlation-info {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.correlation-info h3 {
  margin-bottom: 1rem;
  color: #333;
}

.correlation-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-label {
  font-weight: 600;
  color: #555;
}

.stat-value {
  font-weight: 700;
}

.strong-correlation {
  color: #28a745;
}

.moderate-correlation {
  color: #ffc107;
}

.weak-correlation {
  color: #fd7e14;
}

.no-correlation {
  color: #6c757d;
}

.loading, .error {
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
  
  .summary-stats {
    grid-template-columns: 1fr;
  }
  
  .correlation-stats {
    grid-template-columns: 1fr;
  }
}
</style>
