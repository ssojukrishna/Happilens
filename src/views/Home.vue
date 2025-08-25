<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>DataBoard - Global Happiness Explorer</h1>
        <p class="hero-subtitle">
          Explore and understand global happiness and development indicators through interactive visualizations
        </p>
        <div class="features-grid">
          <router-link to="/country-trends" class="feature-card">
            <h3>Country Trends</h3>
            <p>Explore indicator trends for selected countries over time</p>
          </router-link>
          
          <router-link to="/happiness-comparison" class="feature-card">
            <h3>Happiness Comparison</h3>
            <p>Compare indicators with happiness index across countries</p>
          </router-link>
          
          <router-link to="/regional-view" class="feature-card">
            <h3>Regional Analysis</h3>
            <p>Visualize happiness distribution across world regions</p>
          </router-link>
          
          <router-link to="/india-dashboard" class="feature-card">
            <h3>India Dashboard</h3>
            <p>Detailed analysis of India's happiness correlations</p>
          </router-link>
          
          <router-link to="/region-comparison" class="feature-card">
            <h3>Regional Comparison</h3>
            <p>Compare countries within regions on key indicators</p>
          </router-link>
        </div>
      </div>
    </section>

    <section class="data-sources">
      <h2>Data Sources</h2>
      <div class="sources-grid">
        <div class="source-card">
          <h4>World Happiness Report</h4>
          <p>Annual ranking and analysis of global happiness levels</p>
        </div>
        <div class="source-card">
          <h4>World Bank Indicators</h4>
          <p>Comprehensive development indicators and economic data</p>
        </div>
        <div class="source-card">
          <h4>Country Classifications</h4>
          <p>Income groups, regions, and country metadata</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4rem 2rem;
  text-align: center;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
}

.hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 3rem;
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  color: white;
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.feature-card h3 {
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.feature-card p {
  opacity: 0.9;
  line-height: 1.6;
}

.data-sources {
  padding: 4rem 2rem;
  background: #f8f9fa;
}

.data-sources h2 {
  text-align: center;
  margin-bottom: 3rem;
  font-size: 2.5rem;
  color: #333;
}

.sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.source-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.source-card h4 {
  margin-bottom: 1rem;
  color: #667eea;
  font-size: 1.3rem;
}

.source-card p {
  color: #666;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
