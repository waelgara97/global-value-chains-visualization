import React from 'react';
import GlobalValueChainsMap from './GlobalValueChainsMap';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Global Value Chains Visualization</h1>
      </header>
      <main>
        <GlobalValueChainsMap />
      </main>
      <footer>
        <p>Data represents estimated 2023 trade flows in billions USD</p>
      </footer>
    </div>
  );
}

export default App;