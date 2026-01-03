import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import PersonForm from "./components/PersonForm";
import personService from "./services/persons";
import Notification from "./components/Notification";

const App = () => {
  const [allPersons, setAllPersons] = useState([]);
  const [filterStr, setFilterStr] = useState("");
  const [newPerson, setNewPerson] = useState({ name: "", number: "" });
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((newPersons) => setAllPersons(newPersons));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = allPersons.find(
      (person) => person.name === newPerson.name.trim()
    );
    if (!result) {
      personService.create(newPerson).then((person) => {
        setAllPersons((prevPersons) => prevPersons.concat(person));
        setNewPerson({ name: "", number: "" });
        setSuccessMessage(`Added ${newPerson.name} successfully`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
    } else {
      alert(
        `${newPerson.name} is already added to phonebook, replace the old number with a new one?`
      );
    }
  };

  const handleRemove = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name}?`)) {
      personService.remove(id).then((removedPerson) => {
        setAllPersons(
          allPersons.filter((person) => person.id !== removedPerson.id)
        );
      });
    }
  };

  // should really be called handleInputChange
  const handleFormChange = ({ target: { name, value } }) => {
    setNewPerson((newPerson) => ({
      ...newPerson,
      [name]: value,
    }));
  };

  const handleChangeFilter = (event) => {
    setFilterStr(event.target.value);
  };

  return (
    <>
      <h2>Phonebook</h2>
      <Notification message={successMessage} />
      <Filter filterStr={filterStr} handleChangeFilter={handleChangeFilter} />
      <h3>add a new</h3>
      <PersonForm
        newPerson={newPerson}
        handleSubmit={handleSubmit}
        handleFormChange={handleFormChange}
      />
      <h3>Numbers</h3>
      <Persons
        filterStr={filterStr}
        allPersons={allPersons}
        handleRemove={handleRemove}
      />
    </>
  );
};

export default App;
