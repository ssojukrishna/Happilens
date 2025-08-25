# Copilot Instructions for DataBoard Project

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Context
This is a DataBoard project - a data visualization platform built for exploring global happiness and development indicators using Agile/Scrum methodology.

## Technical Stack
- **Frontend**: Vue.js 3 with Vite
- **Visualization**: Chart.js, Vue-Chart.js, Plotly.js
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Deployment**: GitHub Pages

## Data Sources
- World Happiness Report API: https://data.worldhappiness.report/map
- World Bank Indicators API: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392
- Country classification data: https://datahelpdesk.worldbank.org/knowledgebase/articles/906519

## Core Features to Implement
1. Explore indicator trends for selected countries over time periods
2. Compare indicators with happiness index for countries and time ranges
3. Visualize happiness distribution across world regions
4. Dashboard for India showing correlations with happiness index
5. Compare countries within regions on chosen indicators

## Development Guidelines
- Use Vue 3 Composition API
- Create reusable chart components
- Implement proper error handling for API calls
- Follow responsive design principles
- Use async/await for API calls
- Implement loading states and error messages
- Create modular service layers for API interactions

## Project Structure Preferences
- `/src/components` - Vue components
- `/src/services` - API service modules
- `/src/composables` - Vue composables for data fetching
- `/src/views` - Page-level components
- `/src/utils` - Utility functions
- `/src/assets` - Static assets
- `/docs` - Agile/Scrum documentation

## Agile Context
This project follows Scrum methodology with:
- Sprint-based development
- User story driven features
- Regular retrospectives and planning
- Iterative delivery approach
