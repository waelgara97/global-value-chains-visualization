import React, { useState } from 'react';

// Define regions with their center coordinates (approximate)
const regions = {
  "North America": { lat: 40, lng: -100, color: "#1f77b4" },
  "Europe": { lat: 50, lng: 10, color: "#ff7f0e" },
  "East Asia": { lat: 35, lng: 120, color: "#2ca02c" },
  "Southeast Asia": { lat: 10, lng: 110, color: "#d62728" },
  "South Asia": { lat: 20, lng: 80, color: "#9467bd" },
  "Latin America": { lat: -10, lng: -60, color: "#8c564b" },
  "Africa": { lat: 0, lng: 20, color: "#e377c2" },
  "Middle East": { lat: 30, lng: 50, color: "#7f7f7f" },
  "Oceania": { lat: -25, lng: 135, color: "#bcbd22" }
};

// Define flow data (values are in billions USD, 2023 estimates)
const flows = [
  // From North America
  { from: "North America", to: "Europe", primary: 85, intermediate: 310, final: 220 },
  { from: "North America", to: "East Asia", primary: 105, intermediate: 290, final: 180 },
  { from: "North America", to: "Latin America", primary: 65, intermediate: 180, final: 150 },
  
  // From Europe
  { from: "Europe", to: "North America", primary: 75, intermediate: 280, final: 210 },
  { from: "Europe", to: "East Asia", primary: 90, intermediate: 220, final: 170 },
  { from: "Europe", to: "Middle East", primary: 50, intermediate: 120, final: 95 },
  { from: "Europe", to: "Africa", primary: 45, intermediate: 95, final: 85 },
  
  // From East Asia
  { from: "East Asia", to: "North America", primary: 60, intermediate: 350, final: 290 },
  { from: "East Asia", to: "Europe", primary: 55, intermediate: 320, final: 260 },
  { from: "East Asia", to: "Southeast Asia", primary: 95, intermediate: 220, final: 120 },
  
  // From Southeast Asia
  { from: "Southeast Asia", to: "East Asia", primary: 110, intermediate: 190, final: 85 },
  { from: "Southeast Asia", to: "North America", primary: 45, intermediate: 130, final: 120 },
  
  // From South Asia
  { from: "South Asia", to: "Middle East", primary: 60, intermediate: 85, final: 45 },
  { from: "South Asia", to: "Europe", primary: 40, intermediate: 75, final: 95 },
  
  // From Latin America
  { from: "Latin America", to: "North America", primary: 120, intermediate: 110, final: 70 },
  { from: "Latin America", to: "Europe", primary: 70, intermediate: 45, final: 35 },
  
  // From Africa
  { from: "Africa", to: "Europe", primary: 85, intermediate: 40, final: 30 },
  { from: "Africa", to: "East Asia", primary: 95, intermediate: 35, final: 20 },
  
  // From Middle East
  { from: "Middle East", to: "Europe", primary: 130, intermediate: 60, final: 40 },
  { from: "Middle East", to: "East Asia", primary: 160, intermediate: 45, final: 30 },
  
  // From Oceania
  { from: "Oceania", to: "East Asia", primary: 90, intermediate: 50, final: 35 },
  { from: "Oceania", to: "Southeast Asia", primary: 55, intermediate: 30, final: 25 }
];

// Function to convert lat/lng to x/y coordinates
function projection([lng, lat]) {
  // Simple Mercator projection
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (450 / 180);
  return [x, y];
}

// Create a bezier curve between two points
function createCurve(from, to, thickness) {
  const [fromX, fromY] = projection([from.lng, from.lat]);
  const [toX, toY] = projection([to.lng, to.lat]);
  
  // Calculate control points for bezier curve
  const dx = toX - fromX;
  const dy = toY - fromY;
  const controlX = (fromX + toX) / 2 - dy / 8;
  const controlY = (fromY + toY) / 2 + dx / 8;
  
  return `M ${fromX},${fromY} Q ${controlX},${controlY} ${toX},${toY}`;
}

const GlobalValueChainsMap = () => {
  const [selectedType, setSelectedType] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState(null);
  
  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };
  
  const handleRegionClick = (region) => {
    setSelectedRegion(selectedRegion === region ? null : region);
  };
  
  // Filter flows based on selection
  const filteredFlows = flows.filter(flow => {
    if (selectedRegion) {
      return flow.from === selectedRegion || flow.to === selectedRegion;
    }
    return true;
  });
  
  return (
    <div className="w-full h-full overflow-hidden bg-white p-4">
      <h2 className="text-xl font-bold mb-4">Global Value Chains Flow Map (2023)</h2>
      
      <div className="flex mb-4 space-x-4">
        <div>
          <label className="mr-2 font-medium">Filter by type:</label>
          <select 
            value={selectedType}
            onChange={handleTypeChange}
            className="border rounded p-1"
          >
            <option value="all">All Goods & Services</option>
            <option value="primary">Primary Goods</option>
            <option value="intermediate">Intermediate Goods</option>
            <option value="final">Final Goods & Services</option>
          </select>
        </div>
        <div>
          <button 
            onClick={() => setSelectedRegion(null)}
            className={`border rounded px-2 py-1 ${!selectedRegion ? 'bg-blue-100' : ''}`}
          >
            Show All Regions
          </button>
        </div>
      </div>
      
      <div className="text-sm mb-4">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-600 mr-2 rounded-full"></div>
          <span>Primary Goods</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-600 mr-2 rounded-full"></div>
          <span>Intermediate Goods</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 mr-2 rounded-full"></div>
          <span>Final Goods & Services</span>
        </div>
        <div className="mt-1">* Line thickness represents volume in billions USD</div>
      </div>
      
      <div className="relative">
        <svg width="800" height="450">
          {/* World map background */}
          <rect x="0" y="0" width="800" height="450" fill="#f0f0f0" stroke="#ccc" />
          
          {/* Flow lines */}
          {filteredFlows.map((flow, i) => {
            const fromRegion = regions[flow.from];
            const toRegion = regions[flow.to];
            
            // Calculate total thickness based on selected type
            let thickness = 0;
            
            if (selectedType === "all" || selectedType === "primary") {
              thickness += flow.primary;
            }
            if (selectedType === "all" || selectedType === "intermediate") {
              thickness += flow.intermediate;
            }
            if (selectedType === "all" || selectedType === "final") {
              thickness += flow.final;
            }
            
            // Scale down thickness for visual purposes
            thickness = Math.log(thickness) * 2;
            
            // If thickness is too small, don't render
            if (thickness < 1) return null;
            
            const path = createCurve(fromRegion, toRegion, thickness);
            
            // Drawing lines for each type
            return (
              <g key={`flow-${i}`}>
                {(selectedType === "all" || selectedType === "primary") && flow.primary > 0 && (
                  <path 
                    d={path} 
                    stroke="green" 
                    strokeWidth={Math.log(flow.primary) * 1.5} 
                    fill="none" 
                    strokeOpacity={0.6}
                  />
                )}
                {(selectedType === "all" || selectedType === "intermediate") && flow.intermediate > 0 && (
                  <path 
                    d={path} 
                    stroke="blue" 
                    strokeWidth={Math.log(flow.intermediate) * 1.5} 
                    fill="none" 
                    strokeOpacity={0.6}
                  />
                )}
                {(selectedType === "all" || selectedType === "final") && flow.final > 0 && (
                  <path 
                    d={path} 
                    stroke="red" 
                    strokeWidth={Math.log(flow.final) * 1.5} 
                    fill="none" 
                    strokeOpacity={0.6}
                  />
                )}
              </g>
            );
          })}
          
          {/* Region markers */}
          {Object.entries(regions).map(([name, region]) => {
            const [x, y] = projection([region.lng, region.lat]);
            const isSelected = selectedRegion === name;
            const isHighlighted = selectedRegion === null || isSelected || 
              filteredFlows.some(flow => flow.from === name || flow.to === name);
            
            return (
              <g 
                key={name}
                onClick={() => handleRegionClick(name)}
                style={{ cursor: 'pointer' }}
                opacity={isHighlighted ? 1 : 0.3}
              >
                <circle 
                  cx={x} 
                  cy={y} 
                  r={isSelected ? 12 : 8} 
                  fill={region.color}
                  stroke={isSelected ? "#000" : "none"}
                  strokeWidth={2}
                />
                <text 
                  x={x} 
                  y={y + 20} 
                  textAnchor="middle" 
                  fontSize={12} 
                  fontWeight={isSelected ? "bold" : "normal"}
                >
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      
      {selectedRegion && (
        <div className="mt-4 border p-4 rounded bg-gray-50">
          <h3 className="font-bold mb-2">{selectedRegion} Trade Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium">Exports (Billions USD)</h4>
              <ul className="list-disc pl-5">
                {flows
                  .filter(flow => flow.from === selectedRegion)
                  .map((flow, i) => (
                    <li key={`export-${i}`}>
                      To {flow.to}: 
                      Primary: ${flow.primary}B, 
                      Intermediate: ${flow.intermediate}B, 
                      Final: ${flow.final}B
                    </li>
                  ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium">Imports (Billions USD)</h4>
              <ul className="list-disc pl-5">
                {flows
                  .filter(flow => flow.to === selectedRegion)
                  .map((flow, i) => (
                    <li key={`import-${i}`}>
                      From {flow.from}: 
                      Primary: ${flow.primary}B, 
                      Intermediate: ${flow.intermediate}B, 
                      Final: ${flow.final}B
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalValueChainsMap;