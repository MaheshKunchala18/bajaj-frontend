import React, { useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import './App.css';

const App = () => {
  const [inputData, setInputData] = useState('');
  const [error, setError] = useState('');
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [filteredResponse, setFilteredResponse] = useState('');

  const options = [
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'numbers', label: 'Numbers' },
    { value: 'highest_lowercase', label: 'Highest lowercase alphabet' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);
    setFilteredResponse('');

    try {
      const parsedData = JSON.parse(inputData);

      if (!parsedData.data) {
        setError('Invalid JSON: missing "data" field');
        return;
      }

    const result = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/bfhl`, parsedData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

      setResponse(result.data);
    } catch (err) {
      console.error('Error:', err);
      setError('Invalid JSON format or backend error');
    }
  };


  const handleFilterChange = (selected) => {
    setSelectedFilters(selected);
    console.log(selectedFilters);

    if (!response) return;

    let filteredData = '';

    selected.forEach((filter) => {
      if (filter.value === 'alphabets' && response.alphabets.length > 0) {
        filteredData += `Alphabets: ${response.alphabets.join(', ')}\n`;
      }
      if (filter.value === 'numbers' && response.numbers.length > 0) {
        filteredData += `Numbers: ${response.numbers.join(', ')}\n`;
      }
      if (filter.value === 'highest_lowercase' && response.highest_lowercase_alphabet.length > 0) {
        filteredData += `Highest Lowercase Alphabet: ${response.highest_lowercase_alphabet.join(', ')}\n`;
      }
    });

    setFilteredResponse(filteredData);
  };

  return (
    <div className="App">
      <h1>API Input</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          placeholder='{"data": ["A", "1", "B", "2", "c"]}'
          rows="5"
          cols="50"
        />
        <br />
        <button type="submit">Submit</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <>
          <h2>Multi Filter</h2>
          <Select
            isMulti
            options={options}
            onChange={handleFilterChange}
          />
          <h3>Filtered Response</h3>
          <pre>{filteredResponse}</pre>
        </>
      )}
    </div>
  );
};

export default App;
