<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-container">
        <router-link to="/" class="nav-brand">
          <h2>HappliLens</h2>
        </router-link>
        
        <ul class="nav-menu">
          <li class="nav-item">
            <router-link to="/country-trends" >Country Trends</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/happiness-comparison" >Happiness vs Indicators</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/regional-view" >Regional View</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/india-dashboard" >India Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/region-comparison" >Region Comparison</router-link>
          </li>
        </ul>
      </div>
    </nav>

    <main class="main-content">
      <router-view />
    </main>
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

html, body {
  height: 100%;
  width: 100%;
  overflow: hidden; /* Prevent body scrollbar */
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
}

#app {
  height: 100vh;
  width: 100vw;
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
  width: 100%;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
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
  gap: 1rem;
}

.nav-link {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #667eea;
  color: white;
}

.main-content {
  flex: 1;
  height: calc(100vh - 50px); /* Subtract reduced navbar height */
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
