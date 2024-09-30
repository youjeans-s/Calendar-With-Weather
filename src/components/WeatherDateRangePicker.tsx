import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { DateRange, WeatherData, City, cities } from './types';
import { CitySelector } from './CitySelector';
import { CalendarHeader } from './CalendarHeader';
import { Calendar } from './Calendar';
import {WEATHER_API_KEY} from '../api/api';
//화면에서 나타내고 싶을 때 <WeatherDateRangePicker />로 불러오면 됨

const WeatherDateRangePicker: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<City>(cities[0]);
  
  const API_KEY = WEATHER_API_KEY;

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast`, {
          params: {
            lat: selectedCity.lat,
            lon: selectedCity.lon,
            appid: API_KEY,
            units: 'metric',
          },
        });

        const weatherList = response.data.list
          .filter((_: any, index: number) => index % 8 === 0)
          .slice(0, 5)
          .map((item: any) => ({
            date: new Date(item.dt * 1000),
            icon: item.weather[0].icon,
            temperature: Math.round(item.main.temp),
          }));

        setWeatherData(weatherList);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeatherData();
  }, [selectedCity]);

  const handleSelect = (date: Date) => {
    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      setDateRange({ from: date, to: undefined });
    } else if (dateRange.from && !dateRange.to) {
      if (date >= dateRange.from) {
        setDateRange({ ...dateRange, to: date });
      } else {
        setDateRange({ from: date, to: undefined });
      }
    }
  };

  const handleConfirmRange = () => {
    setIsCalendarOpen(false);
  };

  return (
    <div className="wdrp-container flex flex-col space-y-4">
      <div className="wdrp-input-container flex space-x-4">
        <input
          type="text"
          placeholder="Start Date"
          value={dateRange.from ? format(dateRange.from, 'yyyy/MM/dd') : ''}
          readOnly
          className="wdrp-input px-3 py-2 border rounded"
        />
        <input
          type="text"
          placeholder="End Date"
          value={dateRange.to ? format(dateRange.to, 'yyyy/MM/dd') : ''}
          readOnly
          className="wdrp-input px-3 py-2 border rounded"
        />
        <button 
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="wdrp-calendar-button px-3 py-2 border rounded hover:bg-[#FED766] transition-colors duration-200"
        >
          <CalendarIcon className="wdrp-calendar-icon h-5 w-5" />
        </button>
      </div>

      {isCalendarOpen && (
        <div className="wdrp-modal fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="wdrp-modal-content bg-white rounded-lg p-4 shadow-lg relative" style={{ width: '700px', height: '600px' }}>
            <button 
              onClick={() => setIsCalendarOpen(false)} 
              className="wdrp-close-button absolute top-2 right-2 p-1 rounded-full hover:bg-[#FED766]"
              style={{ zIndex: 10 }}
            >
              <X className="wdrp-close-icon h-5 w-5" />
            </button>
            <CitySelector
              cities={cities}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />
            <CalendarHeader
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
            <Calendar
              currentMonth={currentMonth}
              weatherData={weatherData}
              dateRange={dateRange}
              handleSelect={handleSelect}
            />
            <div className="wdrp-confirm-container flex justify-end mt-10">
              <button 
                onClick={handleConfirmRange} 
                className="wdrp-confirm-button px-4 py-2 bg-gray-900 text-white rounded hover:bg-[#FED766] hover:text-black transition-colors duration-200"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDateRangePicker;