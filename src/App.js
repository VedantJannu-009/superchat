import React, { useRef, useState } from "react";
import "./App.css";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

// firebase hooks start
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useEffect } from "react";

firebase.initializeApp({
  apiKey: "AIzaSyB4BUDMqMaTjAR5_vQrgWw0g9_2C1o7Gnw",
  authDomain: "chatapp-ab33d.firebaseapp.com",
  projectId: "chatapp-ab33d",
  storageBucket: "chatapp-ab33d.appspot.com",
  messagingSenderId: "593131250235",
  appId: "1:593131250235:web:280a39709c4f3dd9dcf21e",
  measurementId: "G-FJYGF8R66V"
});

const auth = firebase.auth();
const firestore = firebase.firestore();

const App = () => {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header>
        <h1> Salt ChatRoom</h1>
        <div className="social">
          <a href="https://github.com/VedantJannu-009" target="_blank" rel="noreferrer">
            <img
              src="superchat/images/github.png"
              alt="github/VedantJannu-009"
            />
          </a>
          <a
            href="https://www.linkedin.com/in/vedant-jannu-b85937212/"
            target=""
          >
            <img
              src="superchat/images/linkedin.png"
              alt="linkedin/VedantJannu"
            />
          </a>
        </div>
      </header>
      <header className="App-header"></header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }
  const signInWithFacebook = () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <div className="signInPage">
      <button className="sign-in" onClick={signInWithGoogle}><img src="superchat/images/google.png" alt="" /> <p>Sign in with Google</p>
      </button>
      <p>Do not violate the community guidelines or you will be banned for life!</p>
    </div>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}> <img src="superchat/images/logout.png" alt="" />
    <p>Sign Out</p></button>
  )
}

function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
      username : auth.currentUser.displayName
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />

      <button type="submit" disabled={!formValue}>🕊️</button>

    </form>
  </>)
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'superchat/images/SALT_LOGO_1612330911172_1612330921522.webp'} alt={auth.currentUser.displayName} />
      <p>{text}</p>
    </div>
  </>)
};

export default App;
