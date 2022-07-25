import { useState } from "react";
import React, { Component }  from "react";

export default function ModSearch(props) {
  const {mods} = props;

  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState('');


  const filter = (e) => {
    const keyword = e.target.value;

    if (keyword !== '') {
      const results = mods.filter((mod) => {
        return mod.name.toLowerCase().startsWith(keyword.toLowerCase());
        // Use the toLowerCase() method to make it case-insensitive
      });
      setSearchResult(results);
    } else {
      setSearchResult(mods);
      // If the text field is empty, show all users
    }

    setQuery(keyword);
  };

  return (
    <div className="container">
      <input
        type="search"
        onChange={filter}
        className="input"
        placeholder="Filter"
      />

      <div className="user-list">
        {searchResult && searchResult.length > 0 ? (
          searchResult.map((mod) => (
            <li key={mod.name}> 
              <span> {mod.name}</span>
            </li>
          ))
        ) : (
          <h1>No results found!</h1>
        )}
      </div>
    </div>
  );
}