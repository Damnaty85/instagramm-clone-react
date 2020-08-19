import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyB6fqZO5G5Qb4Kl7GNxQVc9q9AWDKBpfBU",
    authDomain: "instagram-clone-react-6e18b.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-6e18b.firebaseio.com",
    projectId: "instagram-clone-react-6e18b",
    storageBucket: "instagram-clone-react-6e18b.appspot.com",
    messagingSenderId: "342231610058",
    appId: "1:342231610058:web:1c79dcebbccbbd9a23ba33"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage};

