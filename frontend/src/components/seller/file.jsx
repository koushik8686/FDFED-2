import React, { useState } from 'react'
import axios from 'axios';

export default function File() {
    const seller = "koushik"
    const [file , setfile] = useState()
    function submitform () {
      console.log("submiting");
      const formdata = new FormData()
    formdata.append('image', file)
    formdata.append('name', seller )
    formdata.append('nam', seller )
    formdata.append('ne', seller )
    console.log(formdata, "formdata");
    console.log(file);
    axios.post(`${process.env.REACT_APP_BACKENDURL}/create/66b89cb7441d1d67cc4a0296`, formdata)
      .then()
      .catch((err) => {
        console.log(err);
      })
    }
  return (
    <div>
      <form action="">
        <input onChange={(e)=>{setfile(e.target.files[0])}} type="file" name="" id="" placeholder='image' />
        <button type='button' onClick={submitform} >Submit</button>
      </form>
    </div>
  )
}
