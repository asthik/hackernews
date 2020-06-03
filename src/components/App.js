import React from 'react';
import Storypage from './Storypage';
import { Route, Switch } from 'react-router-dom';
import { renderRoutes } from 'react-router-config';
import Routes from '../routes';

function App(props) {
  console.log('app props: ' +JSON.stringify(props));
  return (
    <div>
      <Switch>
        <Route exact path='/' 
        render={props => <Storypage {...props} />} />
        {/* {renderRoutes(Routes)} */}
      </Switch>
    </div>
  );
}

export default App;
