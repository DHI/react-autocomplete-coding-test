import React from 'react';
import ReactDOM from 'react-dom';

import './fetch';
import './styles.css';

import Autocomplete from './Autocomplete';

function App() {
  const handleSelect = React.useCallback(
    selection => alert(`Your selection is "${selection}"`),
    []
  );

  return (
    <div className="App">
      <h1>UE Country</h1>
      <Autocomplete onSelect={handleSelect} />
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
