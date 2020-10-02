import {
  IonButton,
  IonLabel,
  IonAlert,
  IonIcon
} from '@ionic/react';
import React, { useState, useRef, useEffect } from 'react';
import { eyeOutline, peopleOutline, buildOutline} from 'ionicons/icons';
import { Tooltip, TableRow, TableCell } from '@material-ui/core';
import { projectServices } from '../services/ProjectServices'
import { userService } from '../services/UserServices';

interface ContainerProps {
  project: string;
  user: string;
  isContributor: boolean;
  isAdmin: boolean;
  canEdit: boolean;
  firebase:any
}


const SettingsUser: React.FC<ContainerProps> = ({ project, user, isContributor, isAdmin, canEdit, firebase }) => {

  const [showPermissions, setShowPermissions] = useState(false);
  const [showError, setShowError] = useState(false);
  const [localIsContributor, setLocalIsContributor] = useState(isContributor);
  const [localIsAdmin, setLocalIsAdmin] = useState(isAdmin);
  const refContributor = useRef(localIsContributor)
  const refAdmin = useRef(localIsAdmin)
  const [currentDisplayName,setCurrentDisplayName] = useState("");

  useEffect(() => {
    setLocalIsContributor(isContributor)
  }, [isContributor])

  useEffect(() => {
    setLocalIsAdmin(isAdmin)
  }, [isAdmin])

  useEffect(() => {
    try{
      userService.getCurrentUser(user, firebase)
      .then(data => {
        console.log(data)
        setCurrentDisplayName(data.username)
      })
    } catch (e) {
      console.log(e)
    }
  }, [user])
  
  const alert = 
  <IonAlert
    isOpen={showPermissions}
    onDidDismiss={() => setShowPermissions(false)}
    header={'Assign Privileges:'}
    message={''}
    inputs={[
      {
        type: 'checkbox',
        label: 'Contributor',
        value: 'Contributor',
        checked: refContributor.current
      },
      {
        type: 'checkbox',
        label: 'Admin',
        value: 'Admin',
        checked: refAdmin.current
      }
    ]}
    buttons={[
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Confirm',
        handler: (data) => {
          if (data.includes("Contributor")) {
            setLocalIsContributor(true);
            refContributor.current = true
            console.log("trying to make contributor")
          } else {
            setLocalIsContributor(false);
            refContributor.current = false
            console.log("trying to set contributor to false")
          }
          if (data.includes("Admin")) {
            setLocalIsAdmin(true);
            refAdmin.current = true
            console.log("trying to make admin")
          } else {
            setLocalIsAdmin(false);
            refAdmin.current = false
            console.log("trying to set admin to false")
          }
          projectServices.setUserPermissions(project, user, refAdmin.current, refContributor.current, firebase)
            .catch(e => {
            setLocalIsContributor(isContributor)
            setLocalIsAdmin(isAdmin)
            setShowError(true)
          })

        }
      }
    ]}
  />

  const errorAlert = 
    <IonAlert 
    isOpen={showError}
    onDidDismiss={() => setShowError(false)}
    message={'You can only add 2 contributors'}
    buttons={[
        {
          text: 'OK',
          role: 'cancel'
        }
    ]}
    />

  return (
    <TableRow>
      <TableCell><IonLabel>{currentDisplayName}</IonLabel></TableCell>
      <TableCell><IonLabel>{user}</IonLabel></TableCell>
      <TableCell align="center" style={ {width: '16px'} }>
        <Tooltip title="User has administrative permissions">
          <IonIcon icon={buildOutline} hidden={!localIsAdmin}></IonIcon>
        </Tooltip>
      </TableCell>
      <TableCell align="center" style={ {width: '16px'} }>
          <Tooltip title="User has collaborator permissions">
            <IonIcon icon={peopleOutline} hidden={!localIsContributor}></IonIcon>
          </Tooltip>
      </TableCell>
      <TableCell align="center" style={ {width: '16px'} }>
          <Tooltip title="User has observer permissions">
            <IonIcon icon={eyeOutline}></IonIcon>
          </Tooltip>
      </TableCell>
      <TableCell align="right" style={ {width: '60px'} }>
        <IonButton fill="clear" onClick={() => setShowPermissions(true)} disabled={!canEdit}>
          Edit
        </IonButton>
      </TableCell>
      {alert}
      {errorAlert}
    </TableRow>

  );
}

export default SettingsUser;