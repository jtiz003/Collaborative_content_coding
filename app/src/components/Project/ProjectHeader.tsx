import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { ellipse, square, triangle } from 'ionicons/icons';
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
            {project.owner + "/" + project.name}
            <IonTabBar>
                <IonTabButton tab="tab1" href={`/project/${id}/labelling`}>
                    <IonIcon icon={triangle} />
                    <IonLabel>Labelling</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href={`/project/${id}/insight`}>
                    <IonIcon icon={ellipse} />
                    <IonLabel>Insight</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href={`/project/${id}/setting`}>
                    <IonIcon icon={square} />
                    <IonLabel>Settings</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default ProjectHeader;
