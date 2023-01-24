import React from 'react';

import { render, fireEvent, waitForElement, act } from '@testing-library/react';

import './fetch';
import { FETCH_DELAY } from './fetch';

import Autocomplete, { DEBOUNCE_DELAY } from './Autocomplete';

test('first fetch', async () => {
  const { container, getByPlaceholderText } = render(<Autocomplete />);

  const autocomplete = container.firstChild;
  const input = getByPlaceholderText(/start typing/i);

  await act(async () => {
    enterValue(input, 'a');
    await wait(100);
    enterValue(input, 'au');
    await wait(100);
    enterValue(input, 'aus');
  });

  expect(autocomplete).toMatchSnapshot('debounce should prevent any update');

  await act(async () => {
    await wait(600);
    enterValue(input, 'aust');
  });

  expect(autocomplete).toMatchSnapshot(
    'after debouching, the loader should be visible'
  );

  await act(() => waitDropdownTimeout());

  expect(autocomplete).toMatchSnapshot(
    'the first fetch should return the matched item'
  );
});

test('second fetch', async () => {
  const { container, getByPlaceholderText } = render(<Autocomplete />);

  const autocomplete = container.firstChild;
  const input = getByPlaceholderText(/start typing/i);

  act(() => {
    enterValue(input, 'xxx');
  });

  await waitDropdownOpen(input);

  expect(autocomplete).toMatchSnapshot('should display the not found message');
});

test('item not found', async () => {
  const { container, getByPlaceholderText } = render(<Autocomplete />);

  const autocomplete = container.firstChild;
  const input = getByPlaceholderText(/start typing/i);

  act(() => {
    enterValue(input, 'rom');
  });

  await waitDropdownOpen(input);

  expect(autocomplete).toMatchSnapshot();
});

test('from a value to an empty value', async () => {
  const { container, getByPlaceholderText } = render(<Autocomplete />);

  const autocomplete = container.firstChild;
  const input = getByPlaceholderText(/start typing/i);

  await act(async () => {
    enterValue(input, 'a');
    await wait(100);
    enterValue(input, '');
    waitDropdownTimeout();
  });

  expect(autocomplete).toMatchSnapshot('empty value should not update');
});

test('value delete', async () => {
  const { container, getByPlaceholderText } = render(<Autocomplete />);

  const autocomplete = container.firstChild;
  const input = getByPlaceholderText(/start typing/i);

  await act(async () => {
    enterValue(input, 'a');
    await waitDropdownOpen(input);
    enterValue(input, '');
    await wait(1550);
  });

  expect(autocomplete).toMatchSnapshot(
    'empty value, dropdown should not be open'
  );
});

test('first fetch fails', async () => {
  const fetchMock = jest.fn().mockImplementation(url => {
    if (/countries.eu/i.test(url)) {
      throw new Error('First fetch fails!');
    }

    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 'aus',
            name: 'Austria'
          }
        ])
    });
  });

  const origFetch = global.fetch;
  global.fetch = fetchMock;

  try {
    const { container, getByPlaceholderText } = render(<Autocomplete />);

    const autocomplete = container.firstChild;
    const input = getByPlaceholderText(/start typing/i);
    const queryValue = 'a';

    await act(async () => {
      enterValue(input, queryValue);
      await waitDebounceTimeout();
    });

    expectBothFetchesToBeCalled(fetchMock, queryValue);

    expect(autocomplete).toMatchSnapshot('should show the second fetch result');
  } finally {
    global.fetch = origFetch;
  }
});

test('first fetch fails in json call', async () => {
  const fetchMock = jest.fn().mockImplementation(url => {
    if (/countries.eu/i.test(url)) {
      return Promise.resolve({
        json: () => Promise.reject(new Error('First fetch fails!'))
      });
    }

    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 'aus',
            name: 'Austria'
          }
        ])
    });
  });

  const origFetch = global.fetch;
  global.fetch = fetchMock;

  try {
    const { container, getByPlaceholderText } = render(<Autocomplete />);

    const autocomplete = container.firstChild;
    const input = getByPlaceholderText(/start typing/i);
    const queryValue = 'a';

    await act(async () => {
      enterValue(input, queryValue);
      await waitDebounceTimeout();
    });

    expectBothFetchesToBeCalled(fetchMock, queryValue);

    expect(autocomplete).toMatchSnapshot('should show the second fetch result');
  } finally {
    global.fetch = origFetch;
  }
});

test('second fetch fails', async () => {
  console.error = jest.fn();

  const fetchMock = jest.fn().mockImplementation(url => {
    if (/countries2.eu/i.test(url)) {
      throw new Error('Second fetch fails');
    }

    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 'mal',
            name: 'Malta'
          }
        ])
    });
  });

  const origFetch = global.fetch;
  global.fetch = fetchMock;

  try {
    const { container, getByPlaceholderText } = render(<Autocomplete />);

    const autocomplete = container.firstChild;
    const input = getByPlaceholderText(/start typing/i);
    const queryValue = 'm';

    await act(async () => {
      enterValue(input, queryValue);
      await waitDebounceTimeout();
    });

    expectBothFetchesToBeCalled(fetchMock, queryValue);

    expect(console.error.mock.calls.length).toBe(0);

    expect(autocomplete).toMatchSnapshot('should show the first fetch result');
  } finally {
    global.fetch = origFetch;
  }
});

test('second fetch fails in json call', async () => {
  console.error = jest.fn();

  const fetchMock = jest.fn().mockImplementation(url => {
    if (/countries2.eu/i.test(url)) {
      return Promise.resolve({
        json: () => Promise.reject(new Error('Second fetch fails'))
      });
    }

    return Promise.resolve({
      json: () =>
        Promise.resolve([
          {
            id: 'mal',
            name: 'Malta'
          }
        ])
    });
  });

  const origFetch = global.fetch;
  global.fetch = fetchMock;

  try {
    const { container, getByPlaceholderText } = render(<Autocomplete />);

    const autocomplete = container.firstChild;
    const input = getByPlaceholderText(/start typing/i);
    const queryValue = 'm';

    await act(async () => {
      enterValue(input, queryValue);
      await waitDebounceTimeout();
    });

    expectBothFetchesToBeCalled(fetchMock, queryValue);

    expect(console.error.mock.calls.length).toBe(0);

    expect(autocomplete).toMatchSnapshot('should show the first fetch result');
  } finally {
    global.fetch = origFetch;
  }
});

test('first and second fetches fail', async () => {
  console.error = jest.fn();

  const fetchMock = jest.fn().mockImplementation(url => {
    throw new Error(
      (/countries.eu/i.test(url) ? 'First' : 'Second') + ' fetch fails'
    );
  });

  const origFetch = global.fetch;
  global.fetch = fetchMock;

  try {
    const { container, getByPlaceholderText } = render(<Autocomplete />);

    const autocomplete = container.firstChild;
    const input = getByPlaceholderText(/start typing/i);
    const queryValue = 'm';

    await act(async () => {
      enterValue(input, queryValue);
      await waitDebounceTimeout();
    });

    expectBothFetchesToBeCalled(fetchMock, queryValue);

    expect(console.error.mock.calls.length).toBe(1);
    expect(console.error.mock.calls[0][0].message).toBe(
      'Error fetching countries!'
    );

    expect(autocomplete).toMatchSnapshot('should not show any result');
  } finally {
    global.fetch = origFetch;
  }
});

test('item selection', async () => {
  const onSelectHandler = jest.fn();

  const { getByPlaceholderText, findByText } = render(
    <Autocomplete onSelect={onSelectHandler} />
  );

  const input = getByPlaceholderText(/start typing/i);

  act(() => {
    enterValue(input, 'a');
  });

  const itemFound = await findByText(/austria/i);

  await act(async () => {
    fireEvent.click(itemFound);
  });

  expect(onSelectHandler.mock.calls.length).toBe(1);
  expect(onSelectHandler.mock.calls[0][0]).toBe('Austria');
});

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const waitDropdownTimeout = () => wait(FETCH_DELAY + DEBOUNCE_DELAY + 100);

const waitDebounceTimeout = () => wait(DEBOUNCE_DELAY + 100);

const waitDropdownOpen = input => waitForElement(() => input.nextSibling);

const enterValue = (input, value) =>
  fireEvent.change(input, { target: { value } });

const expectBothFetchesToBeCalled = (fetchMock, queryValue) => {
  expect(fetchMock.mock.calls.length).toBe(2);
  expect(fetchMock.mock.calls[0][0]).toBe(
    `https://countries2.eu?q=${queryValue}`,
    'fetch "countries2" without waiting the response'
  );
  expect(fetchMock.mock.calls[1][0]).toBe(
    `https://countries.eu?q=${queryValue}`,
    'fetch "countries" and wait the response'
  );
};
