# Work & Travel Job Finder

A modern, intuitive job search interface designed for international workers seeking employment opportunities in Australia. Built as part of a frontend coding challenge for Work and Travel Guide.

## 🌟 Features

- **Split-view Interface**: Browse job opportunities in a clean list view on the left, with an interactive map visualization on the right
- **Smart Filtering**: Filter companies by location (state) and industry
- **Contact Tracking**: Mark employers you've already contacted (session-based)
- **Complete Contact Information**: All essential details available at a glance (email, phone, address)
- **AI Email Generator**: Generate personalized outreach emails for each company
- **Responsive Design**: Modern, minimal UI that works across devices
- **Interactive Map**: Visualize job locations with OpenStreetMap integration

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **React Leaflet** for interactive maps
- **OpenStreetMap** for map data

## 🚀 Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mosatiii/work-travel-job-finder.git
   cd work-travel-job-finder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.tsx           # Application header with title
│   ├── FilterPanel.tsx      # Filtering controls for location and industry
│   ├── JobList.tsx          # Job listings with contact tracking
│   ├── MapView.tsx          # Interactive map with job markers
│   └── AIEmailGenerator.tsx # AI-powered email generation
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Main application component
├── main.tsx                 # Application entry point
└── index.css                # Global styles with Tailwind
```

## 🎯 Key Components

### FilterPanel
- Filter by Australian states (NSW, VIC, QLD, etc.)
- Filter by industry categories
- Clear all filters functionality

### JobList
- Displays company information with contact details
- Track contacted companies with visual indicators
- Responsive card-based layout

### MapView
- Interactive map using OpenStreetMap
- Markers for each job location
- Popup information on marker click

### AIEmailGenerator
- Generate personalized outreach emails
- Company-specific customization
- Copy-to-clipboard functionality

## 📊 Data Structure

Each job opportunity includes:
- Company name and industry
- Contact person (first name, last name)
- Email and phone number
- Complete address with coordinates
- State location

## 🎨 Design Principles

- **Clean & Minimal**: Focus on usability and content
- **Responsive**: Works seamlessly across desktop and mobile
- **Accessible**: Proper contrast ratios and semantic HTML
- **Modern**: Contemporary UI patterns and smooth interactions

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 Notes

- Contact tracking is session-based and will reset on page reload
- Map requires internet connection for tile loading
- Email generation is template-based (no external AI service required)

## 🤝 Contributing

This project was created as a coding challenge. Feel free to fork and enhance!

## 📄 License

This project is for demonstration purposes as part of a coding challenge.

---

Built with ❤️ for Work and Travel Guide 