import React from 'react';

import debounce from 'lodash/debounce';

export const DEBOUNCE_DELAY = 500;

export default function Autocomplete() {
  return (
    <div className="Autocomplete root">
      <input className="input" placeholder="Start typing to search..." />
      <div className="dropdown"></div>
    </div>
  );
}
