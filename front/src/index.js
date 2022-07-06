import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App';
import { ThemeProvider } from 'styled-components'
import theme from './styles/theme'

import store from './redux/store'
import { Provider } from "react-redux"

ReactDOM.render(
  
  <Provider store = {store}>
  <ThemeProvider theme={theme}>
   
  <App />
  </ThemeProvider>
  </Provider>
  
,
  
  document.getElementById('root')
);

