import React, {useEffect, useState} from 'react';
import './App.css';
import Post from "./Post";
import ImageUpload from "./ImageUpload";
import { db, auth } from "./firebase"
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core/styles";
import {Button, Input} from "@material-ui/core";

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [openSignIn, setOpenSignIn] = useState(false);

    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                console.log(authUser);
                setUser(authUser);
            } else {
                setUser(null);
            }
        });
        return () => {
            unsubscribe();
        }
    }, [user, username]);

    useEffect(() => {
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            //каждый раз когда добавляется пост
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data(),
            })))
        });
    }, []);

    const signUp = (evt) => {
        evt.preventDefault();
        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                 return  authUser.user.updateProfile({
                    displayName: username,
                });
            })
            .catch((error) => alert(error.message));
        setOpen(false);
    };

    const signIn = (evt) => {
        evt.preventDefault();
        auth.signInWithEmailAndPassword(email, password)
            .catch((error) => alert(error.message));
        setOpenSignIn(false);
    };

  return (
    <div className="app">
        <Modal
            open={open}
            onClose={() => setOpen(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <h2 className="app__form-title">Sign Up</h2>
                <form action="" className="app__form">
                    <Input
                        placeholder="User name"
                        type="text"
                        value={username}
                        onChange={(evt) => setUsername(evt.target.value)}
                    />
                    <Input
                        placeholder="Email"
                        type="text"
                        value={email}
                        onChange={(evt) => setEmail(evt.target.value)}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                    />
                    <Button type="submit" onClick={signUp}>Sign Up</Button>
                </form>
            </div>
        </Modal>

        <Modal
            open={openSignIn}
            onClose={() => setOpenSignIn(false)}
        >
            <div style={modalStyle} className={classes.paper}>
                <h2 className="app__form-title">Sign Up</h2>
                <form action="" className="app__form">
                    <Input
                        placeholder="Email"
                        type="text"
                        value={email}
                        onChange={(evt) => setEmail(evt.target.value)}
                    />
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(evt) => setPassword(evt.target.value)}
                    />
                    <Button type="submit" onClick={signIn}>Sign In</Button>
                </form>
            </div>
        </Modal>


        <header className="app__header">
            <img
                src="/1200px-Instagram_logo.svg.webp"
                alt=""
                className="app__img"/>
                <span>CLONE</span>
            {user ?
                (<Button className="app__sign-up" onClick={() => auth.signOut()}>Logout</Button>) :
                (<div className="app__signin-container">
                    <Button className="app__sign-up" onClick={() => setOpenSignIn(true)}>Sign In</Button>
                    <Button className="app__sign-up" onClick={() => setOpen(true)}>Sign Up</Button>
                </div>)
            }
        </header>

        {
            posts.map(({id, post}) => (
                <Post key={id} postId={id} user={user} userName = {post.userName} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
        }

        {user?.displayName ? (<ImageUpload username={user.displayName}/>) : (<h3>Login to upload</h3>)}

    </div>
  );
}

export default App;
