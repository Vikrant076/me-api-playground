import React, { useState } from 'react';
import { profileAPI } from '../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await profileAPI.search(query);
      setResults(response.data);
    } catch (err) {
      setError('Failed to search');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search">
      <h1>Search</h1>
      
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Search skills, projects, experience..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      <div className="search-results">
        {results.map((result, index) => (
          <div key={index} className="search-result">
            <h3>{result.title}</h3>
            <p>Type: {result.type}</p>
            {result.description && <p>{result.description}</p>}
            {result.relevance && <p>Proficiency: {result.relevance}/10</p>}
          </div>
        ))}
        
        {results.length === 0 && query && !loading && (
          <p>No results found for "{query}"</p>
        )}
      </div>
    </div>
  );
};

export default Search;
