import React, { useState, useContext } from 'react'
import { Segment, Form, Input, Button } from 'semantic-ui-react'
import { CountriesContext } from '../context/countries-context'

export default function ContactForm() {
  const search = useFormInput('')
  const [state, dispatch] = useContext(CountriesContext)
  console.log('search-form state', state)
  const onSearchSubmit = () => {
    dispatch({
      type: 'FIND_COUNTRY',
      payload: { name: search.value },
    })

    search.onReset()
  }

  return (
    <Segment basic>
      <Form onSubmit={onSearchSubmit}>
        <Form.Group>
          <Form.Field>
            <Input placeholder="Search Country" {...search} />
          </Form.Field>

          <Form.Field>
            <Button fluid primary>
              Find Country
            </Button>
          </Form.Field>
          <Form.Field>
            <Button onClick={() => search.onReset()} fluid primary>
              Reset
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    </Segment>
  )
}

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)

  const handleChange = (e) => {
    setValue(e.target.value)
  }

  const handleReset = () => {
    setValue(initialValue)
  }

  return {
    value,
    onChange: handleChange,
    onReset: handleReset,
  }
}
