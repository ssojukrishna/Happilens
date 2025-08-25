# HappiLens - Global Happiness Explorer

A comprehensive data visualization platform for exploring global happiness and development indicators, built using Agile/Scrum methodology with Vue.js 3.

## 🎯 Project Overview

HappiLens helps users explore and understand the relationships between happiness and various development indicators across 100 countries from 7 global regions. The platform provides interactive visualizations that make complex global data accessible and insightful.

## 🚀 Features

### Implemented Features
- **Country Trends Analysis**: Explore indicator trends for selected countries over time periods
- **Happiness vs Indicators Comparison**: Interactive scatter plots comparing happiness with development indicators for all 100 countries
- **Regional Analysis**: Visualize happiness distribution across world regions with multiple chart types
- **India Dashboard**: Specialized dashboard showing India's happiness correlations and metrics
- **Regional Country Comparison**: Compare countries within regions with ranking systems
- **Interactive Navigation**: Clean, responsive interface with modern Vue.js design

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Visualization**: Chart.js for interactive charts
- **HTTP Client**: Axios (with comprehensive mock data systems)
- **Routing**: Vue Router
- **Deployment**: GitHub Pages ready

## 📊 Data Coverage

- **Countries**: 100 countries across 7 global regions
- **Regions**: North America, Europe & Central Asia, East Asia & Pacific, South Asia, Latin America & Caribbean, Middle East & North Africa, Sub-Saharan Africa
- **Indicators**: GDP per Capita, Life Expectancy, Unemployment Rate, Education Expenditure
- **Analysis**: Correlation analysis, regional comparisons, trend visualization

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ssojukrishna/Happilens.git
cd Happilens
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
├── composables/         # Vue composables for data fetching
├── services/           # API service modules
├── views/              # Page-level components
├── utils/              # Utility functions
└── assets/             # Static assets

docs/                   # Agile/Scrum documentation
├── agile-process.md    # Team process and ceremonies
└── user-stories.md     # Product backlog and user stories
```

## 🔄 Agile Development Process

This project follows Scrum methodology adapted for academic constraints:

- **Sprint Length**: 2 weeks
- **Team Roles**: Product Owner, Scrum Master, Developers
- **Communication**: Asynchronous daily updates via messaging
- **Documentation**: Jira for backlog management

See [docs/agile-process.md](docs/agile-process.md) for detailed process documentation.

## 🎯 Learning Objectives

This project is designed to provide hands-on experience with:
- Agile/Scrum software development methodology
- Modern web development with Vue.js
- Data visualization techniques
- API integration and data handling
- Collaborative software development

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🤝 Contributing

This is an educational project. Team members should:
1. Follow the defined Scrum process
2. Create feature branches for new work
3. Submit pull requests for code review
4. Update documentation as needed

## 📄 License

This project is for educational purposes as part of an Agile software development course.

## 🔗 Links

- [GitHub Repository](https://github.com/ssojukrishna/Happilens)
- [Live Demo](# "Will be deployed to GitHub Pages")
- [Team Documentation](docs/)
