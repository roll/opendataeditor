import * as React from 'react'
import { assert } from 'ts-essentials'
import InputBase from '@mui/material/InputBase'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Columns from '../../Library/Columns'
import HeadingBox from '../../Library/Groups/HeadingBox'
import HeadingButton from '../../Library/Groups/HeadingButton'
import HeadingSelector from '../../Library/Groups/HeadingSelector'
import Constraints from '../Elements/Constraints'
import ForeignKeys from '../Elements/ForeignKeys'
import ForeignKey from '../Elements/ForeignKey'
import Fields from '../Elements/Fields'
import Field from '../Elements/Field'
import { useStore, selectors } from '../store'

export default function Element() {
  return (
    <Box>
      <Header />
      <Content />
    </Box>
  )
}

function Header() {
  const elementIndex = useStore((state) => state.elementIndex)
  return elementIndex === undefined ? <ListingHeader /> : <ItemHeader />
}

function ListingHeader() {
  return (
    <HeadingBox>
      <Columns spacing={1} layout={[3, 6, 3]}>
        <TypeSelect />
        <Box>
          <AddButton />
          <GridButton />
        </Box>
        <SearchInput />
      </Columns>
    </HeadingBox>
  )
}

function ItemHeader() {
  return (
    <HeadingBox variant="h6">
      <Columns spacing={3}>
        <Columns spacing={1}>
          <BackButton />
          <ItemSelect />
        </Columns>
        <Box>
          <RemoveButton />
          <ModeButton />
        </Box>
      </Columns>
    </HeadingBox>
  )
}

function TypeSelect() {
  const elementType = useStore((state) => state.elementType)
  const setElementType = useStore((state) => state.setElementType)
  const setElementIndex = useStore((state) => state.setElementIndex)
  return (
    <HeadingSelector
      select
      fullWidth
      label="Select"
      margin="none"
      value={elementType}
      onChange={(ev) => {
        setElementType(ev.target.value as typeof elementType)
        setElementIndex()
      }}
    >
      {Object.values(ELEMENTS).map((element) => (
        <MenuItem key={element.type} value={element.type}>
          {element.label}s
        </MenuItem>
      ))}
    </HeadingSelector>
  )
}

function AddButton() {
  const elementType = useStore((state) => state.elementType)
  const addElement = useStore((state) => state.addElement)
  const ELEMENT = ELEMENTS[elementType]
  return (
    <Button
      color="info"
      title={`Add a new ${ELEMENT.label.toLowerCase()}`}
      onClick={() => addElement()}
    >
      Add {ELEMENT.label}
    </Button>
  )
}

function GridButton() {
  const isElementGrid = useStore((state) => state.isElementGrid)
  const toggleIsElementGrid = useStore((state) => state.toggleIsElementGrid)
  return (
    <Button
      color={isElementGrid ? 'warning' : 'info'}
      onClick={() => toggleIsElementGrid()}
      title="Toggle grid view"
    >
      Grid View
    </Button>
  )
}

function BackButton() {
  const elementType = useStore((state) => state.elementType)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const ELEMENT = ELEMENTS[elementType]
  return (
    <HeadingButton
      fullWidth
      color="info"
      variant="outlined"
      onClick={() => setElementIndex()}
      title="Return to listing"
    >
      {ELEMENT.label}s
    </HeadingButton>
  )
}

export function ItemSelect() {
  const elementType = useStore((state) => state.elementType)
  const elementIndex = useStore((state) => state.elementIndex)
  const setElementIndex = useStore((state) => state.setElementIndex)
  const ELEMENT = ELEMENTS[elementType]
  const names = useStore(ELEMENT.names)
  assert(elementIndex !== undefined)
  return (
    <HeadingSelector
      select
      fullWidth
      label="Select"
      type="number"
      value={elementIndex}
      onChange={(ev) => setElementIndex(parseInt(ev.target.value))}
    >
      {names.map((name, index) => (
        <MenuItem key={index} value={index}>
          {name}
        </MenuItem>
      ))}
    </HeadingSelector>
  )
}

function RemoveButton() {
  const elementType = useStore((state) => state.elementType)
  const removeElement = useStore((state) => state.removeElement)
  const ELEMENT = ELEMENTS[elementType]
  return (
    <Button
      title={`Remove ${ELEMENT.label.toLowerCase()}`}
      color="info"
      onClick={() => removeElement()}
    >
      Remove {ELEMENT.label}
    </Button>
  )
}

function ModeButton() {
  const elementType = useStore((state) => state.elementType)
  const isElementExtra = useStore((state) => state.isElementExtra)
  const toggleIsElementExtra = useStore((state) => state.toggleIsElementExtra)
  const ELEMENT = ELEMENTS[elementType]
  if (!ELEMENT.extra) return null
  return (
    <Button
      color={isElementExtra ? 'warning' : 'info'}
      onClick={() => toggleIsElementExtra()}
      title="Toggle constraints view"
    >
      Constraints
    </Button>
  )
}

// TODO: rebase on TextField (move to Library/Groups?)
function SearchInput() {
  const elementQuery = useStore((state) => state.elementQuery)
  const setElementQuery = useStore((state) => state.setElementQuery)
  return (
    <InputBase
      type="text"
      placeholder="Search..."
      value={elementQuery || ''}
      onChange={(ev) => setElementQuery(ev.target.value)}
      sx={{
        height: '100%',
        paddingLeft: 1,
        paddingRight: 1,
        borderRadius: '4px',
        border: 'solid 1px #ccc',
        '&:focus': {
          outline: 'none',
        },
      }}
    />
  )
}

function Content() {
  const elementType = useStore((state) => state.elementType)
  const elementIndex = useStore((state) => state.elementIndex)
  const isElementExtra = useStore((state) => state.isElementExtra)
  const ELEMENT = ELEMENTS[elementType]
  let Component = ELEMENT.item
  if (elementIndex === undefined) Component = ELEMENT.list
  if (isElementExtra && ELEMENT.extra) Component = ELEMENT.extra
  return <Component />
}

const ELEMENTS = {
  field: {
    type: 'field',
    label: 'Field',
    item: Field,
    list: Fields,
    extra: Constraints,
    names: selectors.fieldNames,
  },
  foreignKey: {
    type: 'foreignKey',
    label: 'Foreign Key',
    item: ForeignKey,
    list: ForeignKeys,
    extra: null,
    names: selectors.foreignKeyNames,
  },
}
