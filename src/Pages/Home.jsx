import React,{useState,useEffect} from 'react'
import { useFirebase } from '../context/Firebase'
import Cards from './Card'

function Home() {

    const firebase = useFirebase()

    const [image,setImage] = useState([])

  

    useEffect(() => {
        firebase.listPosts().then((image) => setImage(image.docs))
    },[])
    
    

    if (firebase.isLoggedIn) {
        return (
            <div>
              {image.map(image => 
               <Cards key={image.id} id={image.id} {...image.data()}/>
              )}
            </div>
          )
    }

    return <h1 className='text-[50px] mt-20 text-slate-800'>Please Login to See Posts </h1>
  
 
}

export default Home
