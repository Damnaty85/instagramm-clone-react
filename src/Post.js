import React, {useEffect, useState} from 'react';
import Avatar from "@material-ui/core/Avatar";
import {db} from "./firebase";
import firebase from "firebase";
import './Post.css';

function Post({postId, user, userName, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe;
        if (postId){
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection('comments')
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()))
                })
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (evt) => {
        evt.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    };

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={userName}
                    src=""
                />
                <h3>{userName}</h3>
            </div>
            <img src={imageUrl} alt="" className="post__image"/>
            <div className="post__text"><strong>{userName} </strong>{caption}</div>
            <div className="post-comments__wrapper">
                {
                    comments.map((comment) => (
                        <p>
                            <b>{comment.username} </b>{comment.text}
                        </p>
                    ))
                }
            </div>

            {user && (
                <form className="post-comment__container">
                    <input
                        className="post-comment__input"
                        type="text"
                        placeholder="Add comment..."
                        value={comment}
                        onChange={(evt) => setComment(evt.target.value)}
                    />
                    <button
                        className="post-comment__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post comment
                    </button>
                </form>
                )}

        </div>
    )
}

export default Post;

