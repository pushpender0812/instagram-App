import React, { useState } from "react";
import { useFirebase } from "../context/Firebase";

function AddPost() {

    const firebase = useFirebase()

    const [image,setImage] = useState('')
    const [caption,setCaption] = useState('')
    const [like,setLike] = useState([])
    const [comment,setComment] = useState({})

  const handleSubmit = async(e) => {
    e.preventDefault()
    await firebase.handleCreatenewList(image,caption,like,comment)
    alert('Image Uploaded Successfullly')
  }

 


  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h1 className="mt-[150px] text-center font-bold text-4xl text-red-700">
          Add New Post
        </h1>
      </div>
      <div className="flex">
        <h1 className="mt-[100px] text-centre text-2xl font-extrabold">
          Upload Photo :
        </h1>
        <input type="file" required onChange={(e) => setImage(e.target.files[0])} className="mt-[100px] ml-[50px]" />
      </div>
   <h1>{() => setLike(like)}</h1>
   <h1>{() => setComment(comment)}</h1>

      <div className="flex">
        <h1 className="mt-[100px] text-centre text-2xl font-extrabold">
      
          Add caption :
        </h1>
        <input
          type="text"
          value={caption}
          required
          onChange={(e) => setCaption(e.target.value)}
          className="mt-[100px] border-2 border-black ml-[50px] h-[200px] w-[500px] text-2xl text-start"
          placeholder="Write Something About The Post "
          name=""
          id=""
        />
      </div>

      <button className="mt-[50px] h-[50px] w-[100px] bg-gray-500 rounded-2xl">
        Upload Post
      </button>
    </form>
  );
}

export default AddPost;
