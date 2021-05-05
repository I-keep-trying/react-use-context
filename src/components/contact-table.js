import React, { useState, useContext } from 'react'
import { Segment, Table, Menu, Form, Button, Input } from 'semantic-ui-react'
import { ContactContext } from '../context/contact-context'
import ContactForm from '../components/contact-form'

export default function ContactTable() {
  const search = useFormInput('')
  const [state, dispatch] = useContext(ContactContext)
  const [selectedId, setSelectedId] = useState('All')
  const [subregion, setSubregion] = useState('')

  const onSearchSubmit = () => {
    dispatch({
      type: 'FIND_COUNTRY',
      payload: { name: search.value },
    })

    search.onReset()
  }

  const selectRegion = (id) => {
    search.onReset()

    console.log('selectRegion id', id)
    // setSelectedId(null)
    setSelectedId(id)
    dispatch({
      type: 'SELECT_REGION',
      payload: id,
    })
  }

  const selectSubregion = (id) => {
    search.onReset()

    console.log('selectSubregion id', id)
    setSubregion('')
    setSubregion(id)
    dispatch({
      type: 'SELECT_SUBREGION',
      payload: id,
    })
  }

  const rows = state.countries.map((contact) => (
    <Table.Row
      key={contact.id}
      onClick={() => selectRegion(contact.region)}
      active={contact.region === selectedId}
    >
      <Table.Cell>{contact.id}</Table.Cell>
      <Table.Cell>{contact.name}</Table.Cell>
      <Table.Cell>{contact.region}</Table.Cell>
      <Table.Cell>{contact.subregion}</Table.Cell>
    </Table.Row>
  ))

  const regions = state.regions.map((c) => (
    <>
      <Menu.Item
        key={c.id}
        name={c.region}
        onClick={() => selectRegion(c.region)}
        active={c.region === selectedId}
      >
        {c.region}
      </Menu.Item>
    </>
  ))

  const subregions = state.regions.map((c) => {
    return c.region === selectedId ? (
      <>
        {c.subregions.map((sub) => (
          <Menu.Item
            key={sub}
            name={sub}
            onClick={() => selectSubregion(sub)}
            active={sub === subregion}
          >
            {sub}
          </Menu.Item>
        ))}
      </>
    ) : (
      <></>
    )
  })

  return (
    <>
      <Menu fixed="top" style={{ marginTop: 0 }}>
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
      </Menu>

      <Segment>
        <Menu fixed="top" style={{ marginTop: 55 }} widths={8}>
          {regions}
        </Menu>
        <Menu fixed="top" style={{ marginTop: 95 }} widths={8}>
          {subregions}
        </Menu>
        <Table celled striped selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Id</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Region</Table.HeaderCell>
              <Table.HeaderCell>SubRegion</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </Segment>
    </>
  )
}

function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue)
  const [state, dispatch] = useContext(ContactContext)

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
}
