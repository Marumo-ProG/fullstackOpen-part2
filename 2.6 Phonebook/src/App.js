import { useState } from 'react';
import { useEffect } from 'react';
import personService from './services/persons';

const Search = (props) => {
  const handleSearch = (e) => {
    // the search functionality will go here
    props.handleSearch(e);
  }
  return (
    <>
      <form>
        <div>
          filter shown with <input onChange={handleSearch} type="text" />
        </div>
      </form>
    </>
  )
}

const PersonForm = (props) => {
  return (
    <form>
      <div>
        name: <input onChange={props.handleNameInput} />
      </div>
      <div>
        number: <input onChange={props.handleNumberInput} />
      </div>
      <div>
        <button onClick={props.addPerson} type="submit">add</button>
      </div>
    </form>
  );
}

const Persons = (props) => {
  const handleDelete = (e) => {
    props.handleDelete(e.target.id);
  }
  let peopleView;

  if (props.search.length > 0) {
    peopleView = props.persons.map(person => {
      let name = person.name.toLowerCase();
      let sValue = props.search.toLowerCase();

      if (name.includes(sValue)) {
        return <><p key={person.id}>{person.name}: {person.number} </p> <button key={Math.random * 999} id={person.id} onClick={handleDelete}>delete</button></>
      }
      return;
    })
  } else {
    peopleView = props.persons.map(person => {
      return <><p key={person.id}>{person.name}: {person.number}</p> <button key={Math.random * 999} id={person.id} onClick={handleDelete}>delete</button></>

    })
  }

  return peopleView;
}

const Notification = (props) => {
  const style = {
    color: props.color,
    textAlign: "center",
    border: "2px solid",
    fontFamily: "sans-serif",
    marginBottom: "10px"
  }
  return (
    <div style={style} className="notification">
      <h4>{props.message}</h4>
    </div>
  )
}



const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNumber] = useState("");
  const [notification, setNotification] = useState("Nothing to Notify ...");
  const [color,setColor] = useState("red");
  const [search, setSearch] = useState("");

  useEffect(() => {
    personService
      .getAll("http://localhost:3001/persons")
      .then(promise => {
        setPersons(promise.data);
      })

  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  const handleNameInput = (e) => {
    setNewName(e.target.value);
  }
  const handleNumberInput = (e) => {
    setNumber(e.target.value);
  }

  const addPerson = (e) => {
    e.preventDefault();
    let people = [...persons];

    // checking if the name already exists
    for (let i = 0; i < people.length; i++) {
      if (people[i].name === newName) {

        // checking if the number is different or the same
        if (people[i].number !== newNumber) {
          if (window.confirm(newName+" this name is the database, do you want to change the number?")) {
            let person = people.find(n => n.name === newName);
            let promise = personService.updateNumber(people[i].id, { ...person, number: newNumber })
              .then(promise => {
                // updating the state component
                setPersons(people.map(person => person.name === newName ? promise.data : person));
                console.log("user has been updated successfully");
                handleChangeNotification(`Person: ${promise.data.name} updated successfully`);
                setColor("green");
              })
              .catch(error => {
                console.log("error updating user information ", error);
                setColor("red");
                setNotification("Person has been removed from the server")
                setPersons(persons); // to re-render the display
              })
            return promise;
          }
        } else
          return alert(`This name ${newName}  already in the state`)
      }
    }

    people.push({ name: newName, number: newNumber });
    setPersons(people);
    // adding the person to the json file
    personService
      .addPerson({ name: newName, number: newNumber})
      .then(promise => {
        console.log("user posted in the server");
        handleChangeNotification(`Person: ${newName} added to the server successfully`);
        setColor("green");
      })
      .catch(error => {
        console.log(error);
      })
  }
  const handleDelete = (id) => {
    if (window.confirm(" are you sure you want to delete this person? ")) {
      personService.delUser(id)
        .then(done => {
          
          // changing the color
          setColor("red");
          handleChangeNotification("Person with id: "+id+" has been deleted successfuly");
          // changing the state
          personService.getAll()
            .then(promise => {
              setPersons(promise.data);
            })
        })
        .catch(error => {
          console.log("Error deleting the user ", error);
        })

      // updating the state
      personService.getAll()
        .then(done => {
          console.log('data fetched successfully');
          setPersons(done.data);
        })

        
    }
  }
  const handleChangeNotification = (message) =>{
    setNotification(message);
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification color={color} message={notification} />
      <Search handleSearch={handleSearch} />
      <br />
      <PersonForm handleNameInput={handleNameInput} handleNumberInput={handleNumberInput} addPerson={addPerson} />
      <br />
      <h2>Numbers</h2>
      <Persons search={search} persons={persons} handleDelete={handleDelete} />
    </div>
  )
}

export default App