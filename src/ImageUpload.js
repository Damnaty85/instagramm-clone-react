import React, {useState} from 'react';
import './ImageUpload.css';
import firebase from "firebase";
import {storage, db} from "./firebase";
import Button from "@material-ui/core/Button";

function ImageUpload({username}) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');

    const handleChange = (evt) => {
        if (evt.target.files[0]) {
            setImage(evt.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                alert(error.message);
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            userName: username
                        });

                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        )
    };

    return (
        <div className="app__image-upload">
            <div className="image-upload__container">
                <progress value={progress} max="100"/>
                <input type="text" placeholder="Enter a caption..." onChange={evt => setCaption(evt.target.value)} value={caption}/>
                <input type="file" onChange={handleChange}/>
                <Button onClick={handleUpload}>
                    Upload
                </Button>
            </div>
        </div>
    )
}

export default ImageUpload;
