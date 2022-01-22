import * as firebase from 'firebase/app'
import 'firebase/auth' 

const firebaseConfig = {
  apiKey: "AIzaSyBPz4Zxfm4yzfSVDCBkduXwJ1rkc_Ijofo",
  authDomain: "look-at-me-ad51b.firebaseapp.com",
  databaseURL: "https://look-at-me-ad51b-default-rtdb.firebaseio.com",
  projectId: "look-at-me-ad51b",
  storageBucket: "look-at-me-ad51b.appspot.com",
  messagingSenderId: "351256565139",
  appId: "1:351256565139:web:c64aefbca0298e0467c466",
  measurementId: "G-0K3XC5WBM1"
};

let app = null;

if (!firebase.app.length) {
  app = firebase.initializeApp(firebaseConfig);
}

export default firebase;
