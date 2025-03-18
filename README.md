# Global Value Chains Visualization

An interactive visualization of global value chain flows between regions by volume, distinguishing between intermediate, primary, and final goods and services.

## Overview

This visualization maps the flow of goods and services across major global regions, categorized into:

- **Primary goods** (green lines): raw materials, agricultural products, and natural resources
- **Intermediate goods** (blue lines): components, parts, and semi-finished products
- **Final goods and services** (red lines): completed products ready for consumption

## Features

- Interactive world map showing trade flows between major global regions
- Line thickness represents trade volume in billions of USD
- Filter by type of goods (primary, intermediate, final, or all)
- Click on any region to focus on its specific trading relationships
- View detailed import/export statistics for selected regions

## Implementation

This visualization is built using:
- React for the UI components
- D3.js for geographical data processing
- Recharts for mapping components
- Tailwind CSS for styling

## Data

The visualization uses estimated 2023 trade flow data between major global regions including:
- North America
- Europe
- East Asia
- Southeast Asia
- South Asia
- Latin America
- Africa
- Middle East
- Oceania

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone this repository
```
git clone https://github.com/waelgara97/global-value-chains-visualization.git
```

2. Install dependencies
```
cd global-value-chains-visualization
npm install
```

3. Start the development server
```
npm start
```

## License

MIT