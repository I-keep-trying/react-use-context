import React, { useReducer, createContext } from 'react'
import countries from '../countriesList'
import regions from '../regions'

export const ContactContext = createContext()

const initialState = {
  countries: countries,
  regions: regions,
  subregions: [],
  loading: false,
  error: null,
}

const reducer = (state, action) => {
  console.log('context state', state)
  console.log('context initialState', initialState)
  switch (action.type) {
    case 'FIND_COUNTRY':
      return {
        ...initialState,
        countries: initialState.countries.filter((country) => {
          return country.name
            .toLowerCase()
            .startsWith(action.payload.name.toLowerCase())
        }),
      }
    case 'SELECT_REGION':
      console.log('SELECT_REGION action.payload', action.payload)
      console.log('SELECT_REGION state', state)

      return {
        ...initialState,
        countries: initialState.countries.filter((country) => {
          return country.region === action.payload
        }),
        subregions: initialState.regions.filter((region) => {
          return region.region === action.payload ? region.subregions : []
        }),
      }
    case 'SELECT_SUBREGION':
      return {
        ...initialState,
        countries: initialState.countries.filter((country) => {
          return country.subregion === action.payload
        }),
      }
    case 'RESET':
      return initialState
    case 'START':
      return {
        loading: true,
      }
    case 'COMPLETE':
      return {
        loading: false,
      }
    default:
      throw new Error()
  }
}

export const ContactContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ContactContext.Provider value={[state, dispatch]}>
      {props.children}
    </ContactContext.Provider>
  )
}
