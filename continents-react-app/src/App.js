import './App.css';
import {useEffect, useState} from 'react'

function App() {
  const [continents, setContinents] = useState();
  const [countries, setCountries] = useState();
  const [selectedContinent, SetSelectedContinent] = useState();

  useEffect(() => {
     const fetchData = async() => {
       await fetch('https://countries.trevorblades.com/', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            query: `
            query{
                continents{
                    code,
                    name
                }
            }
        `
        })
    })
    .then(res => res.json())
    .then(data => setContinents(data.data.continents))}
    
    fetchData()
  },[])

  useEffect(()=> {
    if(!selectedContinent)
    {
      return
    }
    const fetchData = async()=> {
      await fetch('https://countries.trevorblades.com/', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            query: `
              query getCountries($code: ID!){
                continent(code: $code){
                    name,
                    countries{
                        name
                    }
                }
              } 
           `,
            variables: {code: selectedContinent}
        })
    })
    .then(res => res.json())
    .then(data => setCountries(data.data.continent.countries))}
    fetchData()
  },[selectedContinent])

  const handleOnChange = (e) => {
    e.preventDefault()
    SetSelectedContinent(e.target.value)
  }
  
  return (
    <>
    <select id="continent-select" onChange={handleOnChange} defaultValue="something">
        <option value="something">Select a Continent</option>
        {continents?.map(continent => <option value={continent.code} key={continent.code}>{continent.name}</option>)}
    </select>
    <ul id="countries-list">
      {countries?.map(country => <li key={country.name}>{country.name}</li>)}
    </ul>
    </>
  );
}

export default App;
