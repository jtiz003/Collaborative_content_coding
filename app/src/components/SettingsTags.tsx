import {
    IonButton,
    IonAlert,
  } from '@ionic/react';
  import React, { useState, useEffect } from 'react';
  import { projectServices } from '../services/ProjectServices'
import './SettingsTags.css';

interface ContainerProps {
  project: string;
}

const SettingsTags: React.FC<ContainerProps> = ({ project }) => {
    const [showNewTag, setShowNewTag] = useState(false);

  const initialTags = [
    { _id: 0, name: '' }
  ]

  const [tags, setTags] = useState(initialTags);
  useEffect(() => {
    try {
      projectServices.getProjectTags(project)
      .then(data => {
        setTags(data)
      })
    } catch (e) {
      
    }
  }, [])

  function addTag(tag: any) {
    projectServices.setProjectTags(project, tag);
  }

  return (
    <div className="container">
      <h2>Tags</h2>
      {tags.map((tag) => {
        if (tag.name.length != 0) {
          return (
            <IonButton key={tag.name} fill="outline" size="small">{tag.name}</IonButton>
          );
        }
      })}

        <IonButton size="small" fill="clear" onClick={() => setShowNewTag(true)}>
            + Add new tag
        </IonButton>

        <IonAlert 
        isOpen={showNewTag}
        onDidDismiss={() => setShowNewTag(false)}
        header={'Enter new name:'}
        message={''}
        inputs={[
            { 
            name: 'newTag',
            type: 'text',
            id: 'tagName',
            placeholder: 'New Tag' }
        ]}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: (alertData) => {
              if (alertData.newTag.length > 0
                || !tags.some(check => check.name === alertData.newTag)) {
                addTag(alertData.newTag);
              } else {
                alert('Name is invalid');
                return false;
              }
            }
          }
        ]}
        />
    </div>
  );
};

export default SettingsTags;
