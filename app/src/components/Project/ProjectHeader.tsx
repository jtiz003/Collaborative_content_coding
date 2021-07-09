import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { ellipse, square, triangle } from 'ionicons/icons';
import React, { useEffect } from 'react';
import { Route, useRouteMatch, Switch, useParams } from 'react-router';
import ProjectInsight from './ProjectInsight';
import ProjectLabelling from './ProjectLabelling';
import ProjectSettings from './ProjectSettings';

interface ProjectHeaderProps {
    firebase: any
}

const ProjectHeader: React.FC<ProjectHeaderProps> = (props: ProjectHeaderProps) => {

    const { name } = useParams<{ name: string }>();

    return (
        <div>
            Hello this is project header
            <IonTabBar>
                <IonTabButton tab="tab1" href={`/project/${name}/labelling`}>
                    <IonIcon icon={triangle} />
                    <IonLabel>Labelling</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab2" href={`/project/${name}/insight`}>
                    <IonIcon icon={ellipse} />
                    <IonLabel>Insight</IonLabel>
                </IonTabButton>
                <IonTabButton tab="tab3" href={`/project/${name}/setting`}>
                    <IonIcon icon={square} />
                    <IonLabel>Settings</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </div>
    );
};

export default ProjectHeader;
