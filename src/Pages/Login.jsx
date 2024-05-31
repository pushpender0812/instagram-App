import React, { useState } from "react";
import { useFirebase } from "../context/Firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username,setUsername] = useState("")

  const firebase = useFirebase()
  const navigate = useNavigate()
//   console.log(firebase.signupUserWithEmailAndPassword);

  const handleSubmit = async(e) => {
    e.preventDefault()
      console.log("SIngin User ....")
      await firebase.signinUserWithEmailAndPassword(email,password)
      navigate('/')
      alert("Login Successfull")
  }

  return (
    <div>
      <div className="mt-[30px]">
        <form onSubmit={handleSubmit} className="grid">
        {/* <label  className="text-left mt-20">UserName :</label>
          <input placeholder="Enter UserName" type="text" onChange={(e) => setUsername(e.target.value)} value={username} className="mt-10 h-[50px] border-2 border-black text-xl" /> */}
          <label  className="text-left mt-20">Email:</label>
          <input placeholder="Enter Email" type="email" onChange={(e) => setEmail(e.target.value)} value={email} className="mt-10 h-[50px] border-2 border-black text-xl" />
          <label  className="text-left mt-20 ">Password:</label>
          <input type="password" placeholder="Enter Passworrd" onChange={(e) => setPassword(e.target.value)} value={password} className="mt-10 h-[50px] border-s-violet-800 border-2 border-black text-xl" />
         
          <button className="mt-20 h-[50px] w-[150px] rounded-xl bg-yellow-400">Login </button>
         <br />
         <h1>OR</h1>
         <br />
          <button  onClick={firebase.signinGoogle} className="mt-20 h-[50px] w-[150px] rounded-xl bg-pink-400">Sigin With Google </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
