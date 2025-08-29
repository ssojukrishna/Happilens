<template>
  <div class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>HappliLens - Global Happiness Explorer</h1>
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
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  height: 100%;
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 1rem;
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  width: 100%;
  max-width: none;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  margin-top: 2rem;
}

.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  color: white;
  transition: transform 0.3s ease, background 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2);
}

.feature-card h3 {
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.feature-card p {
  opacity: 0.9;
  line-height: 1.4;
  font-size: 0.9rem;
}

</style>
