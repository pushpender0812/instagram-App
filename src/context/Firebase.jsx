import { initializeApp } from "firebase/app";
import { createContext,useContext, useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword,
    GoogleAuthProvider,signInWithPopup,onAuthStateChanged,signOut,
    updateProfile,
 } from "firebase/auth";
import { addDoc, collection,  getDocs,
   getFirestore,updateDoc,increment, doc,
    arrayUnion,arrayRemove,
  deleteDoc, runTransaction,
  getDoc} from "firebase/firestore";
import { getDownloadURL, getStorage,ref, uploadBytes ,deleteObject

} from "firebase/storage";
import { useAuthState } from "react-firebase-hooks/auth";

const FirebaseContext = createContext(null);

const firebaseConfig = {
    apiKey: "AIzaSyBp2GO-zmQQV-QMGEd0M0caIPPgKy33JU4",
    authDomain: "insta-app-def79.firebaseapp.com",
    projectId: "insta-app-def79",
    storageBucket: "insta-app-def79.appspot.com",
    messagingSenderId: "869406993793",
    appId: "1:869406993793:web:247bd8a969aa5bc7328c80"
  };

 const googleProvider = new GoogleAuthProvider()

  const firebaseApp = initializeApp(firebaseConfig);
 export const firebaseAuth = getAuth(firebaseApp)
 export const firestore = getFirestore(firebaseApp)
 export const storage = getStorage(firebaseApp)
    
  


  export const useFirebase = () => useContext(FirebaseContext)

  export const FirebaseProvider = (props) => {

    const[user,setUser] = useState(null)

    useEffect(() => {
        onAuthStateChanged(firebaseAuth,user => {
            if(user) setUser(user)
                else setUser(null)
        })
    },[])

    // console.log(firebaseAuth.currentUser);

  const signupUserWithEmailAndPassword = async(email,password,username) =>{
      // console.log(username)
      try {
      
        const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        
        await updateProfile(userCredential.user, { displayName: username });
      console.log(userCredential)
        return userCredential;
      } catch (error) {
      
        console.error("Error signing up:", error);
        throw error;
      }
              
  }
  const signinUserWithEmailAndPassword = (email,password) => {
    return signInWithEmailAndPassword(firebaseAuth,email,password  )
  }

  const handleCreatenewList = async(image,caption,like,comment) => {
        const imageRef = ref(storage,`uploads/images/${Date.now()}-${image.name}`)
        const uploadResult = await uploadBytes(imageRef,image)
        // console.log(user);
        // const [user] = useAuthState(firebaseAuth)
        return await addDoc(collection(firestore,'instaApp'),{
            caption,
            // username,
            like:[
              
            ],
            comments:  [
              
                //  comment:{
                //   userId:1, 
                //   text: '',
                //   userName: ''
                //  }
            ],
            createdBy:user.displayName, 
            createdTime:new Date().toLocaleTimeString(),
            imageURL:uploadResult.ref.fullPath,
            userId:user.uid,
            dasplayName:user.displayName || user.email,
            photoUrl:user.photoURL,
        })
  }

  const signinGoogle = () => signInWithPopup(firebaseAuth,googleProvider)

  const isLoggedIn  = user ? true : false

  const listPosts = () => {
    return getDocs(collection(firestore,"instaApp"))
  }

 

  const getImageURL = (path) => {
    return getDownloadURL(ref(storage,path))
  }

  const userLogOut = async() => {
    const outlog = await signOut(firebaseAuth)
    return outlog
  }

  const likePost = async (postId, userId, isLiked) => {
    if (!postId || !userId) {
      console.error("Post ID or User ID is missing");
      return;
    }

    const docRef = doc(firestore, 'instaApp', postId);
    if (isLiked) {
      await updateDoc(docRef, {
        like: arrayRemove(userId)
      })
    } else {
      await updateDoc(docRef, {
        like: arrayUnion(userId)
      })
    }
  }

  // console.log(user);

    const commentPost = async(id,comment) => {
      // console.log(comment);
      const docRef = doc(firestore,'instaApp',id);
      const postcomment = await updateDoc(docRef,{
        comments:arrayUnion(comment),
        // console.log();
        // userName:arrayUnion(comment.userName)
      })
      return postcomment
    }


    const commentUpdate = async (postId, commentId, updatedText) => {
      try {
        if (!postId || !commentId || !updatedText) {
          console.error("Invalid parameters:", { postId, commentId, updatedText });
          return;
        }
    
        const postRef = doc(firestore, "instaApp", postId);
    
        await runTransaction(firestore, async (transaction) => {
          const postDoc = await transaction.get(postRef);
    
          if (!postDoc.exists()) {
            throw new Error("Document does not exist!");
          }
    
          const postData = postDoc.data();
          const comments = postData.comments || [];
    
          const updatedComments = comments.map((comment) =>
            comment.textId === commentId ? { ...comment, text: updatedText } : comment
          );
    
          transaction.update(postRef, { comments: updatedComments });
        });
    
        console.log("Comment updated successfully!");
      } catch (error) {
        console.error("Error updating comment: ", error);
      }
    };

    const commentDelete = async(id,comment) => {
      //  console.log("deletd",id);
      const postRef = doc(firestore,"instaApp",id);
      await updateDoc(postRef,{
        comments:arrayRemove(comment)
      })
    }

    

    const deletePost = async (postId, imagePath) => {
      const postRef = doc(firestore, "instaApp", postId);
      await deleteDoc(postRef);
  
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
    };

    return <FirebaseContext.Provider value={{signupUserWithEmailAndPassword,signinUserWithEmailAndPassword,signinGoogle,isLoggedIn,userLogOut,handleCreatenewList,listPosts,getImageURL,likePost,commentPost,commentDelete,deletePost,commentUpdate}}>
        {props.children}
    </FirebaseContext.Provider>
  }