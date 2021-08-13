import React, { useState } from 'react';
import axios from 'axios';
import { Image } from 'cloudinary-react';


    // The current image store will be following the publicId
    // currently there's no set way to differentiate the image url at the upload point
    // more time is needed to figure that part out.


function Cloudinary() {
    const [img, setImg] = useState("")

    const uploadImage = () =>{
        const formData = new FormData()
        formData.append('file', img)
        formData.append('upload_preset', "sjypqrxk")

        axios.post('https://api.cloudinary.com/v1_1/josiahpjy/image/upload', formData)
            .then((res)=>{

            })
    };



    return (
        <div>
            <input type="file" onChange={e=> setImg(e.target.files[0])} />
            <button onClick={uploadImage}>Upload Image</button>
            <div>
                <Image style={{width: 200}} cloudName="josiahpjy" publicId="https://res.cloudinary.com/josiahpjy/image/upload/v1624088830/ijvmxadniqezptvk9qtb.png"/>
            </div>
        </div>
    )
}

export default Cloudinary
