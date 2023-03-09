import { useState, useEffect } from "react";
import personService from "./services/persons";
import Search from "./components/Search";
import Form from "./components/Form";
import People from "./components/People";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((initialNumbers) => {
      setPersons(initialNumbers);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const existingPerson = persons.find(({ name }) => name === newName);

    if (existingPerson) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const changedPersonId = existingPerson.id;
        const changedPerson = { ...existingPerson, number: newNumber };
        personService
          .update(changedPersonId, changedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== changedPersonId ? person : returnedPerson
              )
            );
          })
          .catch((error) => {
            setErrorMessage(
              `Information of '${existingPerson.name}' has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(
              persons.filter((person) => person.id !== existingPerson.id)
            );
          });

        setSuccessMessage(`Updated ${existingPerson.name}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);

        setNewName("");
        setNewNumber("");
        return;
      } else {
        setNewName("");
        setNewNumber("");
        return;
      }
    }

    personService
      .create({
        name: newName,
        number: newNumber,
      })
      .then((returnedNumber) => {
        setPersons((prevState) => [...prevState, returnedNumber]);
      });

    setSuccessMessage(`Added ${newName}`);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);

    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    const { value } = event.target;
    setNewName(value);
  };

  const handleNumChange = (event) => {
    const { value } = event.target;
    setNewNumber(value);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearchInput(value);
    setSearchResults(
      persons.filter(({ name }) =>
        name.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleDeleteClick = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.remove(id).then(() => {
        setPersons((prevState) => [
          ...prevState.filter((person) => person.id !== id),
        ]);
      });
    } else {
      return;
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification
        message={successMessage}
        classes="notification notification--success"
      />
      <Notification
        message={errorMessage}
        classes="notification notification--error"
      />
      <Search newName={newName} handleSearchChange={handleSearchChange} />
      <Form
        handleSubmit={handleSubmit}
        handleNameChange={handleNameChange}
        handleNumChange={handleNumChange}
        newName={newName}
        newNumber={newNumber}
      />
      <People
        persons={persons}
        searchResults={searchResults}
        searchInput={searchInput}
        handleDeleteClick={handleDeleteClick}
      />
    </div>
  );
};

export default App;
