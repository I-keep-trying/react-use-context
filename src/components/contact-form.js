import React, { useState, useContext } from 'react'
import { Segment, Form, Input, Button } from 'semantic-ui-react'
import { nanoid } from 'nanoid'
import { ContactContext } from '../context/contact-context'

export default function ContactForm() {
  const name = useFormInput('')
  const email = useFormInput('')
  const search = useFormInput('')

  const [state, dispatch] = useContext(ContactContext)
  console.log('state', state)
  const onSubmit = () => {
    dispatch({
      type: 'ADD_CONTACT',
      payload: { id: nanoid(), name: name.value, email: email.value },
    })
    // Reset Form
    name.onReset()
    email.onReset()
  }

  const onSearchSubmit = () => {
    dispatch({
      type: 'FIND_CONTACT',
      payload: { name: name.value },
    })

    search.onReset()
  }

  return (
    <Segment basic>
      <Form onSubmit={onSearchSubmit}>
        <Form.Group widths="3">
          <Form.Field width={6}>
            <Input placeholder="Enter Name" {...name} required />
          </Form.Field>

          <Form.Field width={4}>
            <Button fluid primary>
              Find Contact
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
      <Form onSubmit={onSubmit}>
        <Form.Group widths="3">
          <Form.Field width={6}>
            <Input placeholder="Enter Name" {...name} required />
          </Form.Field>
          <Form.Field width={6}>
            <Input placeholder="Enter Email" {...email} type="email" required />
          </Form.Field>
          <Form.Field width={4}>
            <Button fluid primary>
              New Contact
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
    setValue('')
  }

  return {
    value,
    onChange: handleChange,
    onReset: handleReset,
  }
}
