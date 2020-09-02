import ProjectPage from './pages/ProjectPage';
import SettingsPage from './pages/SettingsPage';
import MainPage from './pages/MainPage';
import React from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route } from 'react-router-dom';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route path="/project/:name" component={ProjectPage} exact />
            <Route path="/auth" component={LoginPage} exact />
            <Route path="/mainpage" component={MainPage} exact />
            <Redirect from="/" to="/page/Inbox" exact />

            <Route path="/page/Settings" component={SettingsPage} exact />
          </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
