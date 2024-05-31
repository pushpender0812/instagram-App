import { arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect,useState } from 'react'
import { firebaseAuth, useFirebase } from '../context/Firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { v4 as uuidv4 } from 'uuid';
import { firestore } from '../context/Firebase';

function Comments({id}) {


    const firebase = useFirebase()
  const commonRef = doc(firestore,"instaApp",id)

  const [currentlyLogedinUser] = useAuthState(firebaseAuth)
    const [comments, setComments] = useState( []);
    const [newComment, setNewComment] = useState("");
  
   

    

    useEffect(() => {
        const docRef = doc(firestore,'instaApp',id)
        onSnapshot(docRef,(snapshot) => {
           setComments(snapshot.data().comments)
        })
    },[])
    

    const handlechangeComment = (e) => {
        if (e.key === "Enter") {
            updateDoc(commonRef,{
             comments:arrayUnion({
                user:currentlyLogedinUser.uid,
                userName:currentlyLogedinUser.displayName,
                comment:newComment,
                createdAt: new Date(),
                commentId:uuidv4()

             })
            }).then(() => (
                setComments("")
            ))
        }
    }

    const handleDelete = (comment) => {

    }

    const addComment = async (e) => {
        e.preventDefault();
        const trimmedComment = newComment.trim();
        if (trimmedComment) {
          const comment = {
            userId:props.id, 
            text: trimmedComment,
            userName: props.displayName || "Anonyms"
            // timestamp: Timestamp.now(),
          };
          console.log("userNAme",comment.userName);
          // console.log('Adding comment :',comment);
          // console.log(props.id);
          await firebase.commentPost(props.id, comment);
          setComments([...comments, comment]);
          setNewComment("");
        } else {
          alert("Please add a comment");
        }
      }
      // console.log()
  return (
    <div>
        <div>
          
            {comments !== null && 
            comments.map((comment) => (
              // console.log(comment)
                <div >
                     <div>
                        <div>
                            <span></span>{comment}
                        </div>
                        <div>
                            {/* <button onClick={() => handleDelete(comment)}>❌</button> */}
                        </div>
                     </div>
                </div>
            ))}
        </div>
        {firebase.isLoggedIn  &&   
        
        <form   className="flex">
        <input
          type="text"
          placeholder="Add a Comment..."
          className="w-[200px] mt-6 h-[40px] border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyUp={(e) => {handlechangeComment(e)}}
        />
        <button
          type="submit"
          className="rounded-r-lg px-3 py-1 h-[40px] mb-5 mt-6 bg-green-600 text-white shrink-0"
        >
          ➤
        </button>
      </form>
        
        }
      
    </div>
  )
}

export default Comments
