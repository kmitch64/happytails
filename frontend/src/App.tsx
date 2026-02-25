/* import React from 'react'; */ // importing full React to access React.JSX.Element type
import type { JSX } from 'react'; // importing only JSX type for better performance and to avoid importing the entire React library
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Link } from 'react-router-dom';

import Home from "./pages/Home/Home";
import Adopt from './pages/Adopt/Adopt';
import AdoptableProfile from './pages/Adopt/AdoptableProfile';
import BrowseAdoptables from './pages/Adopt/BrowseAdoptables';

// export default function App(): React.JSX.Element {
  export default function App(): JSX.Element {
  return (

        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path='/adopt' element={<Adopt />} />
            <Route path='/adopt/profile' element={<AdoptableProfile />} />
            <Route path='/adopt/browse' element={<BrowseAdoptables />} />
          </Routes>
        </BrowserRouter>

  );
};
