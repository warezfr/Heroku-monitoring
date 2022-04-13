import {render} from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserLogin from './components/login';
import Company from './components/company';
import DeviceDatagrid from './components/device-datagrid';

const rootElement =   document.getElementById('root')

render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> 
          <Route path="deviceslist" element={<Company/>} />
          <Route path="login" element={<UserLogin/>} />
          <Route path="deviceshistorial/:id" element={<DeviceDatagrid/>} />
        </Route>
      </Routes>
    </BrowserRouter>,
    rootElement
);
