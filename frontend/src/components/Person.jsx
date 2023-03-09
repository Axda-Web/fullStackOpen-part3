import React from "react";

const Person = ({ id, name, number, handleDeleteClick }) => {
  return (
    <div>
      {name} {number}
      <button onClick={() => handleDeleteClick(id, name)}>delete</button>
    </div>
  );
};

export default Person;
