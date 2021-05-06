import React, { useState, useContext } from 'react'
import { Segment, Table, Menu, Image } from 'semantic-ui-react'
import { CountriesContext } from '../context/countries-context'
import CountryDetail from './country-detail'

export default function CountriesTable() {
  const [state, dispatch] = useContext(CountriesContext)
  const [selectedId, setSelectedId] = useState('All')
  const [subregion, setSubregion] = useState('')
  // const [country, setCountry] = useState('')

  const selectCountry = (id) => {
    dispatch({
      type: 'FIND_COUNTRY',
      payload: id,
    })
    //  setCountry(id)
  }

  const selectRegion = (id) => {
    //  console.log('id', id)
    if (id === 'All') {
      dispatch({
        type: 'SELECT_REGION',
        payload: 'All',
      })
    }
    setSelectedId(id)
    dispatch({
      type: 'SELECT_REGION',
      payload: id,
    })
  }

  const selectSubregion = (id) => {
    setSubregion('')
    setSubregion(id)
    dispatch({
      type: 'SELECT_SUBREGION',
      payload: id,
    })
  }

  const rows = state.countries.map((country) => (
    <Table.Row
      key={country.id}
      onClick={() => selectCountry(country.id)}
      active={country.id === country}
    >
      <Table.Cell>
        <Image bordered size="mini" src={country.flag} alt="country flag" />
      </Table.Cell>
      <Table.Cell>{country.name}</Table.Cell>
    </Table.Row>
  ))
  // console.log('state.regions', state.regions)
  const regions = state.regions.map((c) => (
    <Menu.Item
      key={c.id}
      name={c.region}
      onClick={() => selectRegion(c.region)}
      active={c.region === selectedId}
    >
      {c.region}
    </Menu.Item>
  ))

  const getSubregions = state.regions.filter((c) => c.region === selectedId)

  const subregions =
    getSubregions[0].subregions.length > 0 ? (
      getSubregions[0].subregions.map((s) => {
        // console.log('s', s)
        return (
          <Menu.Item
            key={s}
            name={s}
            onClick={() => selectSubregion(s)}
            active={s === subregion}
          >
            {s}
          </Menu.Item>
        )
      })
    ) : (
      <></>
    )

  return (
    <>
      <Segment>
        {state.countries.length === 1 ? (
          <CountryDetail />
        ) : (
          <>
            <Menu fixed="top" style={{ marginTop: 55 }} widths={8}>
              {regions}
            </Menu>
            <Menu fixed="top" style={{ marginTop: 95 }} widths={8}>
              {subregions}
            </Menu>
            <Table unstackable celled striped selectable>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Id</Table.HeaderCell>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{rows}</Table.Body>
            </Table>
          </>
        )}
      </Segment>
    </>
  )
}

/* function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  const [state, dispatch] = useContext(CountriesContext)

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleReset = () => {
    dispatch({
      type: 'RESET',
    })
    setValue('')
  }

  return {
    value,
    onChange: handleChange,
    onReset: handleReset,
  }
} */
