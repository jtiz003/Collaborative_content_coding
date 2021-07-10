import {
  IonPage} from '@ionic/react';
import React, {useEffect, useState, } from 'react';
import { Route, Switch, useParams } from 'react-router';
import './ProjectPage.css';
import Header from '../components/Header'
import { userService } from "../services/UserServices";
import ProjectHeader from '../components/Project/ProjectHeader'
import ProjectInsight from '../components/Project/ProjectInsight';
import ProjectLabelling from '../components/Project/ProjectLabelling';
import ProjectSettings from '../components/Project/ProjectSettings';

interface ProjectPageProps {
  firebase: any
}

const ProjectPage: React.FC<ProjectPageProps> = (props: ProjectPageProps) => {
  const { name } = useParams<{ name: string }>();
  const [currentDisplayName,setCurrentDisplayName] = useState("");

  const {
    firebase
  } = props;

  useEffect(() => {
    try{
      userService.getCurrentUser(localStorage.getItem("email"), firebase)
      .then(data => {
        setCurrentDisplayName(data.username)
      })
    } catch (e) {
    }
  }, [])

  return (
    <IonPage class='ion-page-project-display'>
      <Header routerLink={"/"} name={currentDisplayName} />
      <ProjectHeader firebase={firebase}/>
      <Switch>
        <Route exact path={`/project/${name}/labelling`}>
          <ProjectLabelling firebase={firebase} />
        </Route>
        <Route exact path={`/project/${name}/insight`}>
          <ProjectInsight />
        </Route>
        <Route exact path={`/project/${name}/setting`}>
          <ProjectSettings />
        </Route>
      </Switch>
    </IonPage>
  );
};

export default ProjectPage;
