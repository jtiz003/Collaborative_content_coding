import { userService } from './UserServices';

export const EncryptionServices = {
  getUserKeys,
  getEncryptedEntryKey,
}

async function getUserKeys(email:any, firebase: any) {
  const user = await userService.getCurrentUser(localStorage.getItem("email"), firebase)
  console.log(user)
  return user.key
}

async function getEncryptedEntryKey(project_id: any, firebase: any) {
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json',
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With" },
  };

  //await handleAuthorization(firebase);
  const token = localStorage.getItem('user-token');
  if(firebase.auth.currentUser != null){
    firebase.auth.currentUser.getIdToken().then((idToken: string) =>{
      if(token !== idToken){
        localStorage.setItem('user-token',idToken)
      }
    })
  } else {
    window.location.href = '/auth';
  }

  return fetch(process.env.REACT_APP_API_URL + '/projects/' + project_id
    + '/en_entry_key?id_token=' + localStorage.getItem('user-token'), requestOptions) // TODO:config.apiUrl
    .then(handleResponse)
    .then(data => {
      console.log(data)
      return data
    })
}

function handleResponse(response: { text: () => Promise<any>; ok: any; status: number; statusText: any; }) {
  return response.text().then((text: string) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }

    return data;
  });
}