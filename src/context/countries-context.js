import React, { useReducer, createContext } from 'react'
import countries from '../countriesList'
import regions from '../regions'

export const CountriesContext = createContext()

const initialState = {
  countries: countries,
  regions: regions,
  subregions: [],
  unit: 'metric',
  weather: {},
  loading: false,
  error: null,
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'FIND_COUNTRY':
      return {
        ...initialState,
        countries: initialState.countries.filter((country) => {
          return country.id === action.payload
        }),
      }
    case 'SELECT_REGION':
      return action.payload === 'All'
        ? { ...initialState }
        : {
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
    case 'SET_UNIT':
      return {
        ...initialState,
        unit: action.payload === 'metric' ? 'metric' : 'imperial',
      }
    case 'SET_WEATHER':
      return {
        ...state,
        weather: action.payload,
      }
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

export const CountriesContextProvider = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <CountriesContext.Provider value={[state, dispatch]}>
      {props.children}
    </CountriesContext.Provider>
  )
}
