import React from "react";

const Search = ({ searchInput, handleSearchChange }) => {
  return (
    <div>
      filter shown with:{" "}
      <input type="text" value={searchInput} onChange={handleSearchChange} />
    </div>
  );
};

export default Search;
