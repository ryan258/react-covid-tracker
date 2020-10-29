import React, { useState, useEffect } from 'react'
import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox'
import Map from './Map';
import Table from './Table'
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import numeral from 'numeral'
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data)
      })
  }, [])

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch ("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ))

          const sortedData = sortData(data)
          setTableData(sortedData)
          setMapCountries(data)
          setCountries(countries)
        })
    }
    getCountriesData()
  }, [])

  const onCountryChange = async (event) => {
    const countryCode = event.target.value
    setCountry(countryCode)

    // Pull Info for selected country OR Worldwide
    // https://disease.sh/v3/covid-19/countries/[COUNTRY_CODE]
    // OR Worldwide
    // https://disease.sh/v3/covid-19/all
    const url = countryCode === 'worldwide' 
              ? 'https://disease.sh/v3/covid-19/all' 
              : `https://disease.sh/v3/covid-19/countries/${countryCode}`
    // now make the api call, get data, and do something with it
    await fetch(url)
          .then(response => response.json())
          .then(data => {
            // update the input code
            setCountry(countryCode)
            // store response of country info into a "variable"
            setCountryInfo(data);
            // center map on country that is selected
            setMapCenter([data.countryInfo.lat, data.countryInfo.long])
            setMapZoom(4)

          })
        }

    console.log('Country info > ', countryInfo)

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>

          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {/* Use a loop to output this list */}
              {countries.map(country => (
                <MenuItem value={country.value} key={country.name}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          {/* InfoBox title="Corona Virus Cases"*/}
          <InfoBox 
            title="Coronavirus Cases" 
            cases={prettyPrintStat(countryInfo.todayCases)} 
            total={numeral(countryInfo.cases).format("0.0a")} 
            onClick={e => setCasesType('cases')}
            active={casesType === "cases"}
            isRed />
          {/* InfoBox title="Corona Virus Recoveries"*/}
          <InfoBox 
            title="Recovered" 
            cases={prettyPrintStat(countryInfo.todayRecovered)} 
            total={numeral(countryInfo.recovered).format("0.0a")}
            onClick={e => setCasesType('recovered')}
            active={casesType === "recovered"} />
          {/* InfoBox title="Corona Virus Deaths"*/}
          <InfoBox 
            title="Deaths" 
            cases={prettyPrintStat(countryInfo.todayDeaths)} 
            total={numeral(countryInfo.deaths).format("0.0a")}
            onClick={e => setCasesType('deaths')}
            active={casesType === "deaths"}
            isRed />
        </div>
        {/* Map */}
        <Map 
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          {/* Table */}
          <h3>Cases by Country</h3>
          <Table countries={tableData} />
          {/* Graph */}
          <h3>Worldwide New {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
