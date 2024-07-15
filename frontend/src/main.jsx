import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux";
import store from './store/store.js';
import Routes from './routes/Routes.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    // <React.StrictMode>
        <Provider store={store}>
            <Routes />
        </Provider>
    // </React.StrictMode>,
)
