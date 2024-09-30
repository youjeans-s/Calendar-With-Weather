import React from 'react';
import { City } from './types';

type CitySelectorProps = {
  cities: City[];
  selectedCity: City;
  setSelectedCity: (city: City) => void;
};

export const CitySelector: React.FC<CitySelectorProps> = ({ cities, selectedCity, setSelectedCity }) => (
  <div className="wdrp-city-selector flex justify-center space-x-4 mb-4">
    {cities.map((city) => (
      <button
        key={city.name}
        onClick={() => setSelectedCity(city)}
        className={`wdrp-city-button px-4 py-2 rounded ${
          selectedCity.name === city.name
            ? 'wdrp-city-button-selected bg-[#FED766] text-gray-900'
            : 'wdrp-city-button-unselected bg-[#E6EDF0] text-gray-800'
        }`}
      >
        {city.name}
      </button>
    ))}
  </div>
);