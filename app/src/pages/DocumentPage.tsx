import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonIcon,
  IonModal,
  IonTextarea,
  IonInput
} from '@ionic/react';
import { add, arrowBack, arrowUpOutline } from 'ionicons/icons';
import React, { useState } from 'react';
import { useParams } from 'react-router';
import './DocumentPage.css';
import { isNullOrUndefined } from 'util';

interface Document {
  title: string;
}

interface Users_and_Labels {
    user: string;
    label: string;
}

const sampleDoc: Document[] = [
  {
    title: "first doc",

  }
]



const labels: Users_and_Labels[] = [
    {
        user: "aaaa@aucklanduni.ac.nz",
        label: "tag1",
    },
    {
        user: "bbbb@aucklanduni.ac.nz",
        label: "tag1",
    }
]

const DocumentPage: React.FC = () => {
  const { document_id } = useParams<{ document_id: string }>();
  const [showModal, setShowModal] = useState(false);
  const [labelIndex, setLabelIndex] = useState(-1);
  const [documents] = useState(sampleDoc); //TODO: get documents via project id
  const [users_and_labels] = useState(labels);

  const renderLabelModal = (i:number) => {
    setShowModal(true)
    setLabelIndex(i)
  }


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="header">
          <IonButton slot="start"><IonIcon icon={arrowBack}/></IonButton>
          <IonTitle slot="end">User</IonTitle>
          <IonButton slot="end">Log out</IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="container">
          <strong>{document_id}</strong>


          <IonList>
            {documents.map((doc, i) =>
              <IonItem key={i}>
                <IonLabel>{doc.title}</IonLabel>
              </IonItem>
            )}
          </IonList>
          <IonList>
            {labels.map((label, i) =>
              <IonItem key={i}>
                <IonLabel>{label.user}</IonLabel>
                <IonLabel>{label.label}</IonLabel>

              </IonItem>
            )}
          </IonList>
        </div>


      </IonContent>

    </IonPage>
  );
};

export default DocumentPage;
