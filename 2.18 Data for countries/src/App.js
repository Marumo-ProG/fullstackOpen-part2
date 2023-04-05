import { useState } from 'react';
import { useEffect } from 'react';
import axios from "axios";

const Search = (props) => {
  return (
    <>
      <p>Search a Country</p><input type="text" onChange={props.handleSearch} />
    </>
  )
}

const Searched = (props) => {
  let view;
  let count = 0;
  if (props.countries !== null) {
    view = props.countries.map(country => {
      if (country.name.common.toLowerCase().includes(props.search.toLowerCase())) {
        count++;
        return <p key={country.altSpellings[0]}>{country.name.common}</p>
      }
    })
  } else {
    view = <p>{"Data not availble yet ..."}</p>
  }
  if (count > 10 && props.search.length > 0) {
    view = <p>{"Too many matches, be more specific"}</p>
  } else if (props.search.length == 0) {
    view = <p>{"Search something"}</p>
  }
  if (count === 1) {
    let country = props.countries.find(country => country.name.common.toLowerCase().includes(props.search));
    if (country) {
      let lng = Object.keys(country.languages);
      const lngView = lng.map(l =>{
        return <p>{country.languages[l]}</p>
      })
      view = <div>
        <h2>{country.name.common}</h2>
        <p>Capital: {country.capital[0]}</p>
        <p>area: {country.area}</p>
        <h4>Languages</h4>
        {lngView}

        <img src={country.flags.png} alt="contry" />
        <h4>Find weather information below</h4>

        {
          // calling the weather api for the country and displaying its weather information
        }
      </div>

    }
  }

  return (
    <>
      {view}
    </>
  )
}

const App = () => {
  // setting up the state
  const [search, setSearch] = useState("");
  const [countries, setCountries] = useState(null);

  useEffect(() => {
    // setting the state using the api
    axios
      .get("https://restcountries.com/v3.1/all")
      .then(promise => {
        setCountries(promise.data);
      })
      .catch(error => {
        console.log(error);
      })

  }, [])

  const handleSearch = (e) => {
    setSearch(e.target.value);
  }
  return (
    <div>
      <Search handleSearch={handleSearch} />
      <Searched search={search} countries={countries} />
    </div>
  )
}

export default App