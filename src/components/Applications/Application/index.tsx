import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { ConfirmProvider } from 'material-ui-confirm'
import { StoreProvider, makeStore } from './store'
import CssBaseline from '@mui/material/CssBaseline'
import { Client } from '../../../client'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface ApplicationProps {
  client: Client
}

export default function Application(props: ApplicationProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <ConfirmProvider>
          <CssBaseline />
          <Layout />
        </ConfirmProvider>
      </StoreProvider>
    </ThemeProvider>
  )
}
