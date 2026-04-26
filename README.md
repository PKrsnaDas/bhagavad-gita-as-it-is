# Bhagavad Gita - Complete Study Guide

A beautiful, modern website for studying the Bhagavad Gita based on "Bhagavad Gita As It Is" by HDG A.C. Bhaktivedanta Swami Prabhupada. Built with React, Vite, TailwindCSS, and Framer Motion.

## Features

- **Complete Chapter Overview**: All 18 chapters with Sanskrit names, English translations, and summaries
- **Acronym-Based Learning**: Each chapter summarized with memorable acronyms for easy understanding and retention
- **Collapsible Sections**: Interactive expandable/collapsible subsections for detailed study
- **Visual Chapter Flow**: Beautiful graph visualization showing connections between chapters
- **Appropriate Imagery**: Curated images for each chapter to enhance visual learning
- **Detailed Chapter Views**: In-depth information about each chapter including key teachings
- **Search Functionality**: Quickly find chapters by name, theme, acronym, or English translation
- **Modern UI/UX**: Clean, contemporary design with smooth animations
- **Dark Mode**: Toggle between light and dark themes
- **Responsive**: Fully responsive design for all screen sizes
- **Smooth Animations**: Built with Framer Motion for engaging interactions
- **Spiritual Theme**: Orange/amber color scheme inspired by saffron

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation with dark mode toggle
│   ├── Hero.jsx            # Landing section with Gita overview
│   ├── ChaptersOverview.jsx # Grid of all 18 chapters with search
│   ├── ChapterFlowGraph.jsx # Visual flow graph of chapters
│   ├── ChapterDetail.jsx   # Detailed view for individual chapters
│   └── Footer.jsx          # Footer with inspirational quote
├── data/
│   └── chaptersData.js     # Complete data for all 18 chapters with acronyms
├── App.jsx                 # Main app component
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## Learning Features

### Based on Bhagavad Gita As It Is
All content is based on the authoritative translation and commentary by HDG A.C. Bhaktivedanta Swami Prabhupada, the founder of ISKCON. The teachings follow the Gaudiya Vaishnava tradition.

### Acronym System
Each chapter is summarized with a memorable acronym that breaks down the core teachings according to Prabhupada's purports:
- **Chapter 1 (D.H.A.R.M.A)**: Dilemma, Hesitation, Attachment, Realization, Master, Awakening
- **Chapter 2 (S.O.U.L.)**: Soul, Origin, Understanding, Liberation
- **Chapter 3 (K.A.R.M.A)**: Knowledge, Action, Renunciation, Manifestation, Awakening
- And more for all 18 chapters!

### Collapsible Sections
Each acronym section can be expanded to reveal:
- Detailed explanation of each letter's meaning based on Prabhupada's commentary
- Subsections for deeper exploration of Gaudiya Vaishnava philosophy
- Interactive learning experience with Krishna consciousness

### Visual Flow Graph
A beautiful visualization showing:
- How chapters connect and build upon each other
- The progression from foundation to liberation
- Three main sections: Foundation (1-6), Devotion (7-12), Liberation (13-18)

## Customization

### Chapter Data

All chapter information is stored in `src/data/chaptersData.js`. Each chapter includes:
- Basic information (name, Sanskrit, English, verses, theme)
- Acronym with meaning
- Acronym sections with content and subsections
- Key teachings
- Image URL

You can:
- Add more detailed summaries
- Include verse-by-verse breakdowns
- Add audio or video resources
- Include commentaries from different scholars
- Modify acronyms for different learning styles

### Color Scheme

The website uses an orange/amber/saffron theme. To customize colors, edit `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Orange color palette
  },
  saffron: {
    // Saffron color palette
  }
}
```

### Adding Features

Consider adding:
- Verse-by-verse breakdown with Sanskrit text
- Multiple translations (English, Hindi, etc.)
- Audio recitations
- Commentaries from renowned scholars
- Study progress tracking
- Bookmark favorite verses
- Daily verse feature
- Quiz functionality
- Interactive diagrams
- Sanskrit pronunciation guide

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Vite and deploy

### Netlify

1. Push your code to GitHub
2. Import your repository in Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

## License

This project is open source and available for educational and spiritual purposes.

## Acknowledgments

- The wisdom of the Bhagavad Gita, timeless teachings for all humanity
- The React, Vite, and TailwindCSS communities for amazing tools
- Unsplash for beautiful imagery
