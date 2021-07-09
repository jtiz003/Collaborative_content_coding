import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { analytics, ellipse, folderOpen, pricetags, settings, square, triangle } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { Route, useRouteMatch, Switch, useParams } from 'react-router';
import { projectServices } from '../../services/ProjectServices';
import ProjectInsight from './ProjectInsight';
import ProjectLabelling from './ProjectLabelling';
import ProjectSettings from './ProjectSettings';

interface ProjectHeaderProps {
    firebase: any
}

const ProjectHeader: React.FC<ProjectHeaderProps> = (props: ProjectHeaderProps) => {

    const { id } = useParams<{ id: string }>();
    const { firebase } = props;
    const [project, setProject] = useState({
        '_id': '',
        'owner': '',
        'name': '',
        'state': '',
        'encryption_state': ''
    });

    useEffect(() => {
        try {
            projectServices.getDescriptionOfAProject(firebase, id)
                .then(data => {
                    setProject(data);
                })
        } catch (e) { 
            console.log(e);
        }
    }, [])
    
    return (
        <div>
            <div>
                <IonIcon icon={folderOpen} />
                {project.owner + "/" + project.name}
            </div>

            <IonTabBar>
                <IonTabButton tab="tab1" href={`/project/${id}/labelling`}>
                    <IonIcon icon={pricetags} />
                    <IonLabel>Labelling</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href={`/project/${id}/insight`}>
                    <IonIcon icon={analytics} />
                    <IonLabel>Insight</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href={`/project/${id}/setting`}>
                    <IonIcon icon={settings} />
                    <IonLabel>Settings</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default ProjectHeader;
