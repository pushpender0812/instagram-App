import React,{useState,useEffect} from 'react'
import { useAuthState } from 'react-firebase-hooks/auth';
import { firebaseAuth } from '../context/Firebase';
import { useFirebase } from '../context/Firebase';
import { firestore } from '../context/Firebase';

function Like({postId,likeCount}) {
    const [like, setLike] = useState( likeCount || []);
    const [liked, setLiked] = useState(false);
    const firebase = useFirebase()

    const [user] = useAuthState(firebaseAuth)

    // console.log("DAta",user.uid);
    // console.log(props)

    // console.log(firebase)
    // console.log("Props",props)
    // console.log("user",user);


    useEffect(() => {
      if (user) {
        setLiked(like.includes(user.uid));
      }
    }, [user, like]);

    const increaselike = async () => {
        if (liked) {
          await firebase.likePost(props.postId, -1);
          setLike(like - 1);
        } else {
          await firebase.likePost(props.postId, 1);
          setLike(like + 1);
        }
        setLiked(!liked);
      };

    
      
    const handleLike = async() => {

      try {
        await firebase.likePost(postId,user.uid,liked)
        console.log(postId)
        if (liked) {
          setLike(like.filter(uid => uid !== user.uid))
        } else {
          setLike([...like,user.uid]);
        }
        setLiked(!liked)
      } catch (error) {
        console.log("Error Linking Post",error);
      }
       
    
      
       
        
    }

    const handleDislike = () => {
        
        // if (props.id === user.id) {
        //     setLiked(true)
        // }  else {
        //     setLiked(false)
        // }
    }

  return (
    <>
      <div >
      <p className="text-left ml-2 cursor-pointer flex" onClick={handleLike}>
          {liked ? "❤️": "🤍"}</p>
          <p>   <b className='ml-1'>{like.length}  likes</b></p>
        
        </div>
    </>
  )
}

export default Like
