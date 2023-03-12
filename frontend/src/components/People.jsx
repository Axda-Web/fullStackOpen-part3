import React from "react";
import Person from "./Person";

const People = ({ people, searchResults, searchInput, handleDeleteClick }) => {
  const displayResults = searchInput.length ? searchResults : people;
  return (
    <div>
      <h2>Numbers</h2>
      {displayResults?.map(({ name, number, id }) => (
        <Person
          key={id}
          id={id}
          name={name}
          number={number}
          handleDeleteClick={handleDeleteClick}
        />
      ))}
    </div>
  );
};

export default People;
