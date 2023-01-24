import { shuffle } from 'lodash';

export const FETCH_DELAY = 1000;

const euCountries = [
  'Austria',
  'Belgium',
  'Bulgaria',
  'Croatia',
  'Cyprus',
  'Czechia',
  'Denmark',
  'Estonia',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'Ireland',
  'Italy',
  'Kingdom',
  'Latvia',
  'Lithuania',
  'Luxembourg'
  // "Malta",
  // "Netherlands",
  // "Poland",
  // "Portugal",
  // "Romania",
  // "Slovakia",
  // "Slovenia",
  // "Spain",
  // "Sweden",
  // "United"
];

const euCountries2 = [
  // "Austria",
  // "Belgium",
  // "Bulgaria",
  // "Croatia",
  // "Cyprus",
  // "Czechia",
  // "Denmark",
  // "Estonia",
  // "Finland",
  // "France",
  'Germany',
  'Greece',
  'Hungary',
  'Ireland',
  'Italy',
  'Kingdom',
  'Latvia',
  'Lithuania',
  'Luxembourg',
  'Malta',
  'Netherlands',
  'Poland',
  'Portugal',
  'Romania',
  'Slovakia',
  'Slovenia',
  'Spain',
  'Sweden',
  'United'
];

global.fetch = url => {
  const [baseUrl, query] = url.split('?q=');

  if (!query) {
    return response(shuffle(euCountries));
  }

  const searchText = query.trim().toLowerCase();

  switch (baseUrl) {
    case 'https://countries.eu':
      if (searchText === 'p') {
        return Promise.reject('Oops! Something went wrong!');
      }
      return response(filter(searchText, euCountries));

    case 'https://countries2.eu':
      const data = filter(searchText, euCountries2);
      return response([...data, ...data]);

    default:
      return response(null, 'Invalid URL!');
  }
};

const response = (data, error) =>
  error
    ? Promise.reject(error)
    : new Promise(resolve =>
        setTimeout(() => {
          resolve({
            json: () => Promise.resolve(data)
          });
        }, FETCH_DELAY)
      );

const filter = (searchText, countries) =>
  Object.values(
    countries.reduce((acc, country) => {
      const countryLower = country.toLowerCase();
      if (countryLower.startsWith(searchText)) {
        acc[country] = {
          id: countryLower.substr(0, 3),
          name: country
        };
      }
      return acc;
    }, {})
  );
