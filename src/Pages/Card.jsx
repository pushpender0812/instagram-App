import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { arrayRemove, doc, onSnapshot, updateDoc, } from "firebase/firestore";
import { ref,uploadBytes } from "firebase/storage";
// import Button from 'react-bootstrap/Button';
// import Card from 'react-bootstrap/Card';
// import { useFirebase } from '../context/Firebase';
import { firestore } from "../context/Firebase";
import { useFirebase, firebaseAuth } from "../context/Firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { v4 } from "uuid";
import { comment } from "postcss";
import Like from "./Like";
import Popup from "./Popup";
import { storage } from "../context/Firebase";
// import { getFirestore } from "firebase/firestore";
// import Comments from "./Comments";

const Cards = (props) => {
  // console.log(props.like);
  const firebase = useFirebase();
  const navigate = useNavigate();

  // console.log("Props ",props);

  const [url, setUrl] = useState(null);
  
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [user] = useAuthState(firebaseAuth);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [commentToEdit, setCommentToEdit] = useState(null);
  const [updatedCaption, setUpdatedCaption] = useState(props.caption);  
  const [updatedImage, setUpdatedImage] = useState(null);
  //  console.log(comment);

  useEffect(() => {
    firebase.getImageURL(props.imageURL).then((url) => setUrl(url));
  }, []);

  const handleDelete = async() => {
    await firebase.deletePost(props.id,props.imageURL)
    // await firebase.deleteDocumentBYId('books',props.id,props.name)
    alert("successfully deleted")
    window.location.reload( )
  }

 

  useEffect(() => {
    const docRef = doc(firestore, "instaApp", props.id);
    const uncomment = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setComments(snapshot.data().comments || []);
        } else {
          console.log("No such document!");
        }
      },
      (error) => {
        console.log("Error getting document:", error);
      }
    );

    return () => uncomment();
  }, [props.id]);

  const addComment = async (e) => {
    e.preventDefault();
    const trimmedComment = newComment.trim();
    if (trimmedComment) {
      if (isEditingComment) {
        // If editing a comment, call updateComment
        await updateComment(commentToEdit, trimmedComment);
      } else {
        // If not editing, add a new comment
        const comment = {
          userId: props.id,
          textId: v4(),
          text: trimmedComment,
          userName: user.displayName || user.email,
        };
        await firebase.commentPost(props.id, comment);
        setNewComment("");
        setComments([...comments, comment]); // Update local state
      }
    } else {
      alert("Please add a comment");
    }
  };
  
  const deleteComment = async (comment) => {
    try {
      await firebase.commentDelete(props.id, comment);
      setComments(comments.filter((c) => c.textId !== comment.textId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };




  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setUpdatedImage(e.target.files[0]);
    }
  };

  const handleUpdatePost = async () => {
    try {
      const docRef = doc(firestore, "instaApp", props.id);
      let updatedImageUrl = props.imageURL;

      if (updatedImage) {
        const imageRef = ref(storage, `uploads/images/${Date.now()}-${updatedImage.name}`);
        const uploadResult = await uploadBytes(imageRef, updatedImage);
        updatedImageUrl = uploadResult.ref.fullPath;
      }

      await updateDoc(docRef, {
        caption: updatedCaption,
        imageURL: updatedImageUrl,
      });

      setUrl(await firebase.getImageURL(updatedImageUrl)); // Update the displayed image URL
      togglePopup();
      alert("Post updated successfully");
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post");
    }
  };

  const startEditComment = (comment) => {
    setIsEditingComment(true);
    setNewComment(comment.text);
    setCommentToEdit(comment);
  };
  
  const updateComment = async (comment, newText) => {
    try {
      const updatedComments = comments.map((c) =>
        c.textId === comment.textId ? { ...c, text: newText } : c
      );

      const docRef = doc(firestore, "instaApp", props.id);
      await updateDoc(docRef, { comments: updatedComments });

      setComments(updatedComments); // Update local state
      setNewComment("");
      setIsEditingComment(false);
      setCommentToEdit(null);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };
  
  

 console.log(props);

  return (
    <div className=" border-gray-600 mt-10 mx-auto text-right w-3/4 lg:w-[700px]">
      <div className="grid ">
        <div className="mt-[80px] flex">
          {/* <b>UserName:</b> */}
          <h1 className="text-2xl font-semibold  mb-4">{props.dasplayName}</h1>
          <p className="text-gray-500 mt-2 ml-2">.{props.createdTime || "Waiting for created time ......."}</p>
        </div>
        {props.dasplayName === user.displayName  &&  <div className="flex">
        <p className="text-red-100 font-semibold cursor-pointer  h-[40px] w-[80px] ml-[500px]  rounded-2xl" onClick={() => handleDelete(props)} >🗑</p>
        <p className="text-red-100 font-semibold cursor-pointer  h-[40px] w-[80px]   rounded-2xl" onClick={togglePopup} >✏️</p></div>
        }
         {/* <button onClick={togglePopup}>Show Popup</button> */}
      {isOpen && (
        <Popup
          content={   <>
            <h2 className="font-bold mb-5">Edit this Post</h2>
            <p className="flex mb-5">
              <b>{props.dasplayName} @</b>
              <input
                type="text"
                value={updatedCaption}
                onChange={(e) => setUpdatedCaption(e.target.value)}
              />
            </p>
            <input type="file" onChange={handleImageChange} />
            <button
              onClick={handleUpdatePost}
              className="bg-sky-500 rounded-xl mt-5 h-10"
            >
              Update Post
            </button>
          </>}
          handleClose={togglePopup}
        />
      )}
        
        <img className=" h-[400px]" src={url} alt="" />
      </div>
      <div className="flex mb-3 mt-2">
        <Like  postId={props.id} likeCount={props.like}/>
        <div>
        <p className="text-left  cursor-pointer ml-20">🗨️   </p>
        <b className="ml-20 ">{comments.length}  Commnets</b>
        </div>
      </div>

      <div>
        <h1 className="text-left mt-3">
          <b>{props.dasplayName} @</b>
          {props.caption}
        </h1>
      </div>

      <div className="mb-5">
        <p className="text-left mt-3 cursor-pointer mb-2 text-gray-500">
        
          View all {comments.length} comments
        </p>
        {comments.map((com, index) => (
          // console.log(com)
          <div key={index} className="flex">
            <p>
              <b className="mr-4">{com.userName} :</b>
              {com.text}
            </p>

            {user.displayName === com.userName && (
              <div>
                 <button
                  className="text-red-700 text-xl ml-3"
                  onClick={() => startEditComment(com)}
                >
                  ✏️
                </button>
                <button
                  className="text-red-700 text-xl ml-3"
                  onClick={() => deleteComment(com)}
                >
                  X
                </button>
              </div>
            )}
          </div>
        ))}
        {/* {props.comments.map((comm,index) => (
          <div key={index}>
            <p ><b className="mr-4">{props.userName} :</b>{comm}</p>
          
          </div>
        ))} */}
        <div>
          {firebase.isLoggedIn && (
            <form onSubmit={addComment} className="flex">
              <input
                type="text"
                placeholder="Add a Comment..."
                className="w-[200px] mt-6 h-[40px] border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
                value={newComment}  
                onChange={(e) => setNewComment(e.target.value)}
                // onKeyUp={(e) => {handlechangeComment(e)}}
              />
              <button
                type="submit"
                className="rounded-r-lg px-3 py-1 h-[40px] mb-5 mt-6 bg-green-600 text-white shrink-0"
              >
               {isEditingComment ? "Update" : "➤"}
              </button>
              {/* <p className="cursor-pointer" onClick={() => updateLastComment(props.comments,props.id)}>Update</p> */}
            </form>
          )}
        </div>
      </div>
      <div>{/* {renderComments()} */}</div>
      <hr />
    </div>
  );
};

export default Cards;
