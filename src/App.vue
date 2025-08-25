<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <h2>DataBoard</h2>
        </router-link>
        
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/country-trends" class="nav-link">Country Trends</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/happiness-comparison" class="nav-link">Happiness vs Indicators</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/regional-view" class="nav-link">Regional View</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/india-dashboard" class="nav-link">India Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/region-comparison" class="nav-link">Region Comparison</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <p>&copy; 2025 DataBoard - Global Happiness Explorer</p>
        <p>Built with Agile/Scrum methodology for educational purposes</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}

.nav-brand {
  text-decoration: none;
  color: #667eea;
}

.nav-brand h2 {
  font-weight: 700;
}

.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #667eea;
  color: white;
}

.main-content {
  flex: 1;
  padding-top: 0;
}

.footer {
  background: #f8f9fa;
  padding: 2rem;
  text-align: center;
  border-top: 1px solid #dee2e6;
}

.footer-content p {
  color: #666;
  margin: 0.25rem 0;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    height: auto;
    padding: 1rem;
  }
  
  .nav-menu {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 1rem;
    gap: 1rem;
  }
  
  .nav-link {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
}
</style>
