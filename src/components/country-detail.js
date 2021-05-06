import React, { useState, useEffect, useContext } from 'react'
import { isMobile } from 'react-device-detect'
import {
  Divider,
  Menu,
  Container,
  Icon,
  Image,
  Button,
  Card,
  Popup,
  Grid,
  Header,
  Item,
  Breadcrumb,
} from 'semantic-ui-react'
import axios from 'axios'
import Weather from '../components/Weather'
import '../assets/css/owm-right.css'
import { CountriesContext } from '../context/countries-context'

export default function CountryDetail() {
  const [state, dispatch] = useContext(CountriesContext)
  const [country, setCountry] = useState({})
  const [activeTab, setActiveTab] = useState('Flag')
  const [isLoading, setIsLoading] = useState(true)
  const [location, setLocation] = useState({})
  const [locationLoading, setLocationLoading] = useState(true)
  const [isWeatherLoading, setIsWeatherLoading] = useState(true)
  console.log('country-detail state', state)
  useEffect(() => {
    axios
      .get(`https://restcountries.eu/rest/v2/name/${state.countries[0].name}`)
      .then((result) => {
        setCountry(result.data[0])
        setIsLoading(false)
      })
  }, [])

  useEffect(() => {
    // Get location coords of country capital, to use for weather
    if (!isLoading) {
      axios
        .get(
          `https://geocode.search.hereapi.com/v1/geocode?q=${country.capital},${country.name}&apiKey=${process.env.REACT_APP_HERE_KEY}`
        )
        .then((res) => {
          setLocation(res.data.items[0].position)
          setLocationLoading(false)
        })
    }
  }, [country, isLoading])

  const handleItemClick = (e, { name }) => {
    setActiveTab(name)
  }

  const getTimeZones = (country) => {
    const tzEnd = country.timezones.length - 1
    return country.timezones.length > 1 ? (
      <Grid.Row style={{ padding: 0 }}>
        {country.timezones[0]} - {country.timezones[tzEnd]}
      </Grid.Row>
    ) : (
      <>{country.timezones[0]}</>
    )
  }

  useEffect(() => {
    if (!locationLoading) {
      const url = `https://api.openweathermap.org/data/2.5/onecall?lat=${location.lat}&lon=${location.lng}&exclude=minutely,hourly&appid=${process.env.REACT_APP_OPENWEATHER_KEY}&units=${state.unit}`

      axios.get(url).then((response) => {
        dispatch({
          type: 'SET_WEATHER',
          payload: response.data,
        })
        setIsWeatherLoading(false)
      })
    }
  }, [location, locationLoading, state.unit])

  const handleUnitButtonClick = (e) => {
      console.log('state.unit',state.unit)
    dispatch({
      type: 'SET_UNIT',
      payload: state.unit === 'metric' ? 'metric' : 'imperial',
    })
  }

  return (
    <Container fluid>
      <Menu
        secondary
        style={{
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 0,
          paddingBottom: 10,
          marginBottom: 0,
        }}
      >
        <Breadcrumb
          size={isMobile ? 'mini' : 'small'}
          style={
            isMobile
              ? { paddingLeft: 3, paddingTop: 4 }
              : { marginLeft: 10, paddingTop: 4 }
          }
        >
          <Breadcrumb.Section
            key="All"
            style={{ cursor: 'pointer' }}
            link
            //  onClick={reset}
          >
            All
          </Breadcrumb.Section>
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section
            key={country.region}
            style={{ cursor: 'pointer' }}
            link
            // onClick={regionLink}
          >
            {country.region}
          </Breadcrumb.Section>
          {country.subregion !== '' ? (
            <>
              <Breadcrumb.Divider icon="right chevron" />
              <Breadcrumb.Section
                key={country.subregion}
                style={{ cursor: 'pointer' }}
                link
                //  onClick={subregionLink}
              >
                {country.subregion}
              </Breadcrumb.Section>
            </>
          ) : (
            <></>
          )}
          <Breadcrumb.Divider icon="right chevron" />
          <Breadcrumb.Section key={country.name} active>
            {country.name}
          </Breadcrumb.Section>
        </Breadcrumb>
        <Menu.Item
          position="right"
          style={{
            padding: 0,
          }}
        >
          <Button.Group attached="bottom">
            <Button
              size={isMobile ? `mini` : `medium`}
              basic={state.unit === 'metric' ? false : true}
              color="black"
              onClick={handleUnitButtonClick}
              style={{ padding: 4 }}
            >
              Metric
            </Button>
            <Button
              size={isMobile ? `mini` : `medium`}
              basic={state.unit === 'metric' ? true : false}
              color="black"
              onClick={handleUnitButtonClick}
              style={{ padding: 4 }}
            >
              Imperial
            </Button>
          </Button.Group>
        </Menu.Item>
      </Menu>
      <Menu pointing secondary>
        <Menu.Item
          //  active
          name="Flag"
          active={activeTab === 'Flag'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="Details"
          active={activeTab === 'Details'}
          onClick={handleItemClick}
        />
        <Menu.Item
          name="Weather"
          active={activeTab === 'Weather'}
          onClick={handleItemClick}
        />
      </Menu>
      {activeTab === 'Flag' && !isLoading ? (
        <Card fluid>
          <Image src={country.flag} alt="country flag" />
        </Card>
      ) : (
        <></>
      )}
      {activeTab === 'Details' && !isLoading ? (
        <Card fluid style={{ margin: 0 }}>
          <Grid style={{ margin: 0 }} columns={isMobile ? 2 : 4}>
            <Grid.Row>
              <Grid.Column style={{ paddingRight: 4 }}>
                <Item.Group relaxed>
                  <Item style={{ margin: 0 }}>
                    <Item.Content>
                      <Popup
                        style={{
                          borderRadius: 0,
                          padding: '2em',
                        }}
                        hoverable
                        inverted
                        aria-label="An endonym (also known as autonym) is a common, internal name for a geographical place, group of people, or a language/dialect, that is used only inside that particular place, group, or linguistic community."
                        trigger={<Item.Header>Endonym</Item.Header>}
                      >
                        <Popup.Content>
                          <>
                            An endonym (also known as autonym) is a common,
                            internal name for a geographical place, group of
                            people, or a language/dialect, that is used only
                            inside that particular place, group, or linguistic
                            community.
                            <a href="https://en.wikipedia.org/wiki/Endonym_and_exonym">
                              <Icon name="external" />
                            </a>
                          </>
                        </Popup.Content>
                      </Popup>

                      <Item.Description>{country.nativeName}</Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Grid.Column>

              <Grid.Column style={{ paddingLeft: 0 }}>
                <Item.Group relaxed>
                  <Item style={{ margin: 0 }}>
                    <Item.Content>
                      <Item.Header as="a">Capital</Item.Header>
                      <Item.Description>{country.capital}</Item.Description>
                    </Item.Content>
                  </Item>
                </Item.Group>
              </Grid.Column>

              {isMobile ? (
                <></>
              ) : (
                <>
                  <Grid.Column style={{ paddingRight: 4 }}>
                    <Item.Group relaxed>
                      <Item style={{ margin: 0 }}>
                        <Item.Content>
                          <Item.Header>Size</Item.Header>
                          {country.area !== null ? (
                            <Item.Description>
                              {state.unit === 'metric'
                                ? ` ${country.area.toLocaleString()} km²`
                                : ` ${Math.round(
                                    country.area * 1.609
                                  ).toLocaleString()} mi²`}
                            </Item.Description>
                          ) : (
                            <Item.Description>Not provided.</Item.Description>
                          )}
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Grid.Column>

                  <Grid.Column>
                    <Item.Group relaxed>
                      <Item style={{ margin: 0 }}>
                        <Item.Content>
                          <Item.Header>Population</Item.Header>
                          <Item.Description>
                            {country.population.toLocaleString()}
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Grid.Column>
                </>
              )}
            </Grid.Row>
            {isMobile ? (
              <>
                <Divider style={{ margin: 0 }} />
                <Grid.Row>
                  <Grid.Column style={{ paddingRight: 4 }}>
                    <Item.Group relaxed>
                      <Item style={{ margin: 0 }}>
                        <Item.Content>
                          <Item.Header>Size</Item.Header>
                          {country.area !== null ? (
                            <Item.Description>
                              {state.unit === 'metric'
                                ? ` ${country.area.toLocaleString()} km²`
                                : ` ${Math.round(
                                    country.area * 1.609
                                  ).toLocaleString()} mi²`}
                            </Item.Description>
                          ) : (
                            <Item.Description>Not provided.</Item.Description>
                          )}
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Grid.Column>

                  <Grid.Column style={{ paddingLeft: 0 }}>
                    <Item.Group relaxed>
                      <Item style={{ margin: 0 }}>
                        <Item.Content>
                          <Item.Header>Population</Item.Header>
                          <Item.Description>
                            {country.population.toLocaleString()}
                          </Item.Description>
                        </Item.Content>
                      </Item>
                    </Item.Group>
                  </Grid.Column>
                </Grid.Row>
              </>
            ) : (
              <></>
            )}
          </Grid>

          <Divider style={{ margin: 0 }} />
          <Grid style={{ margin: 0 }} columns={2}>
            <Grid.Column style={{ paddingRight: 4 }}>
              <Item.Group relaxed>
                <Item style={{ margin: 0 }}>
                  <Item.Content>
                    <Item.Header>Languages</Item.Header>
                    <Item.Description>
                      {country.languages.map((lang) => (
                        <Grid.Row style={{ padding: 0 }} key={lang.name}>
                          {lang.name}
                        </Grid.Row>
                      ))}
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column style={{ paddingLeft: 0 }}>
              <Item.Group relaxed>
                <Item style={{ margin: 0 }}>
                  <Item.Content>
                    <Item.Header>Time Zones</Item.Header>
                    <Item.Description>{getTimeZones(country)}</Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid>
          <Divider style={{ margin: 0 }} />
          <Grid style={{ margin: 0 }} columns={3}>
            <Grid.Row style={{ paddingLeft: 14, paddingBottom: 0 }}>
              <Header>Currencies</Header>
            </Grid.Row>

            <Grid.Column style={{ paddingRight: 4 }}>
              <Item.Group>
                <Item style={isMobile ? { margin: 0 } : {}}>
                  <Item.Content>
                    <Item.Header> Symbol</Item.Header>
                    <Item.Description>
                      {country.currencies.map((curr) => (
                        <Grid.Row
                          columns={3}
                          style={{ padding: 0 }}
                          key={curr.symbol}
                        >
                          {curr.symbol}
                        </Grid.Row>
                      ))}
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Item.Group>
                <Item style={isMobile ? { margin: 0 } : {}}>
                  <Item.Content>
                    <Item.Header> Code</Item.Header>
                    <Item.Description>
                      {country.currencies.map((curr) => (
                        <Grid.Row
                          columns={3}
                          style={{ padding: 0 }}
                          key={curr.code}
                        >
                          {curr.code}
                        </Grid.Row>
                      ))}
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
            <Grid.Column style={{ paddingLeft: 0 }}>
              <Item.Group>
                <Item style={isMobile ? { margin: 0 } : {}}>
                  <Item.Content>
                    <Item.Header>Name</Item.Header>
                    <Item.Description>
                      {country.currencies.map((curr) => (
                        <Grid.Row
                          columns={3}
                          style={{ padding: 0 }}
                          key={curr.name}
                        >
                          {curr.name}
                        </Grid.Row>
                      ))}
                    </Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </Grid.Column>
          </Grid>
        </Card>
      ) : (
        <></>
      )}
      {activeTab === 'Weather' && !isLoading ? (
        <>
          {!isWeatherLoading && !isLoading ? (
            <Card fluid style={{ margin: 0 }}>
              <Weather
                unit={state.unit}
                activeTab={activeTab}
                country={country}
              />
            </Card>
          ) : (
            <Icon loading name="spinner" />
          )}
        </>
      ) : (
        <></>
      )}
    </Container>
  )
}

/*   if (
        state.unit === 'metric' &&
        window.localStorage.getItem(`${country.name} weather in metric`) ===
          null
      ) {
        axios.get(url).then((response) => {
          setWeather(response.data)
          setIsWeatherLoading(false)
          setIsLoading(false)
          window.localStorage.setItem(
            `${country.name} weather in metric`,
            JSON.stringify(response.data)
          )
        })

        setIsWeatherLoading(true)
        setWeather(
          JSON.parse(
            window.localStorage.getItem(`${country.name} weather in metric`)
          )
        )
        setIsWeatherLoading(false)
        setIsLoading(false)
      } else if (
        state.unit === 'metric' &&
        window.localStorage.getItem(`${country.name} weather in imperial`) !==
          null
      ) {
        setWeather(
          JSON.parse(
            window.localStorage.getItem(`${country.name} weather in imperial`)
          )
        )
        setIsWeatherLoading(false)
        setIsLoading(false)
      } else if (
        state.unit !== 'metric' &&
        window.localStorage.getItem(`${country.name} weather in imperial`) ===
          null
      ) {
        dispatch({
          type: 'SET_UNIT',
          payload: 'imperial',
        })
        console.log('state.unit', state.unit)
        axios.get(url).then((response) => {
          setWeather(response.data)
          setIsWeatherLoading(false)
          setIsLoading(false)
          window.localStorage.setItem(
            `${country.name} weather in ${state.unit}`,
            JSON.stringify(response.data)
          )
        })
        setIsWeatherLoading(true)
        setWeather(
          JSON.parse(
            window.localStorage.getItem(`${country.name} weather in imperial`)
          )
        )
        setIsWeatherLoading(false)
        setIsLoading(false)
      } else {
        setWeather(
          JSON.parse(
            window.localStorage.getItem(`${country.name} weather in imperial`)
          )
        )
        setIsWeatherLoading(false)
        setIsLoading(false)
      } */
