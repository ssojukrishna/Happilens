# DataBoard - Global Happiness Explorer

A data visualization platform for exploring global happiness and development indicators, built using Agile/Scrum methodology.

## 🎯 Project Overview

DataBoard helps users explore and understand the relationships between happiness and various development indicators across countries and regions. The platform provides interactive visualizations that make complex global data accessible and insightful.

## 🚀 Features

### Current Features
- **Country Trends Analysis**: Explore indicator trends for selected countries over time periods
- **Interactive Navigation**: Clean, responsive interface for accessing different analysis views

### Planned Features (Coming Soon)
- **Happiness vs Indicators Comparison**: Compare happiness index with development indicators
- **Regional Analysis**: Visualize happiness distribution across world regions  
- **India Dashboard**: Specialized dashboard showing India's happiness correlations
- **Regional Country Comparison**: Compare countries within regions on chosen indicators

## 🛠️ Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Visualization**: Chart.js, Vue-Chart.js, Plotly.js
- **HTTP Client**: Axios
- **Routing**: Vue Router
- **Deployment**: GitHub Pages

## 📊 Data Sources

- [World Happiness Report](https://data.worldhappiness.report/map)
- [World Bank Indicators API](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [Country Classifications](https://datahelpdesk.worldbank.org/knowledgebase/articles/906519)

## 🏃‍♂️ Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd HappiLens
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

- [Live Demo](# "Will be added after deployment")
- [Jira Board](# "Add your Jira board link")
- [Team Documentation](docs/)
