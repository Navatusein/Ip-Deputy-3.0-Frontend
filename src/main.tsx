import ReactDOM from 'react-dom/client'
import MyApp from './App.tsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import {Provider} from "react-redux";
import {setupStore} from "./store/store.ts";
import {App, ConfigProvider, theme} from "antd";
import {injectStore} from "./api";
import enUS from 'antd/lib/locale/en_US';

const store = setupStore();

injectStore(store);

const { defaultAlgorithm, darkAlgorithm } = theme;

const isDarkMode = true;

const themeConfig={
  algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
  token: {

  },
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <ConfigProvider theme={themeConfig} locale={enUS} >
        <App>
          <MyApp/>
        </App>
      </ConfigProvider>
    </BrowserRouter>
  </Provider>
)
