import React from "react";

const Form = ({
  handleSubmit,
  handleNameChange,
  handleNumChange,
  newName,
  newNumber,
}) => {
  return (
    <>
      <h2>Add a new</h2>
      <form onSubmit={handleSubmit}>
        <div>
          name:{" "}
          <input type="text" value={newName} onChange={handleNameChange} />
        </div>
        <div>
          Number:{" "}
          <input type="text" value={newNumber} onChange={handleNumChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default Form;
