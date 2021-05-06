import React from 'react'
import { Segment } from 'semantic-ui-react'
import CountriesTable from '../components/countries-table'
import { CountriesContextProvider } from '../context/countries-context'

export default function Countries() {
  return (
    <CountriesContextProvider>
      <Segment basic>
        <CountriesTable />
      </Segment>
    </CountriesContextProvider>
  )
}
