import React from 'react';
import {Switch, Route} from 'react-router-dom';
import Tracker from '../components/content/TrackerPage';

const base = "";

const Main = () => {
    return (
      <main style={{"marginBottom": "50px"}}>
        <Switch>
          <Route exact path={base+"/:uid?"} component={Tracker}/>
        </Switch>
      </main>
     )
   }

export default(
     <Main/>
);
