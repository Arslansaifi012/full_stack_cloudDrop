
import { useState } from 'react';
import './section.css' ;

import car7 from "../../assets/car7.jpeg";
import { Container, InputGroup, Form, Button } from 'react-bootstrap';


const Section = () =>{

  const [file, setfile] = useState(null) ;
   const [downloadUrl, setdownloadUrl] = useState(null) ;
   const [fileName, setfileName] = useState(null) ;
   const [prevShow, setprevShow] = useState(false) ;
   const [failed, setfailed]  = useState(null) ;
   const [animation, setAnimation] =  useState(null) ;


  const uploadFile = async(e) =>{
    setAnimation(true) ;

    const formData = new FormData() ;
    formData.append("myfile", file)

    try {

       const respons = await fetch('http://localhost:8000/api/upload',{
        method:'POST',
        body:formData
        
       })

       const data = await respons.json() ;
       console.log(data) ;
  
       if (data?.url?.secure_url) {
        setAnimation(false) ;
        setprevShow(true) ;
        const cloudinaryUrl = data?.url?.secure_url; 
         const forcedDownloadUrl = cloudinaryUrl.replace("/upload/", "/upload/fl_attachment/");
        setdownloadUrl(forcedDownloadUrl) ;
        setfileName(data.url.original_filename)
        setfile(' ')
        
       }  else if ("File not found in request" === data.message){
          setfailed("❌", data.message)
       }
      
    } catch (error) {
      console.log(error)
    }
   
  }

  const showDate = () =>{
    const date = new Date() ;

    const formateDate = date.toLocaleString().slice(0,10) ;

        return formateDate ;
  }


  const downloadFile = (url, fileName) =>{

    const anchor = document.createElement("a");
    anchor.href = url ;
    anchor.download = fileName || "download-file" ;
    anchor.target = "_blank" ;
    anchor.rel = 'noopener noreferrer' ;
    document.body.appendChild(anchor) ;
    anchor.click() ;
    document.body.removeChild(anchor) ;


  }


    return <div>

        <Container style={{height:"100vh"}} className='d-flex align-items-center justify-content-center' >

          <main className='main-section p-5'>
             <div className="app-heading">
              <h1> 🌩️ Cloud Drop</h1>
            <p>Secure File Upload App</p>
          </div>

             <InputGroup className="mb-3">
      
         <Form.Control
    type="file"
    name="myfile" 
    onChange={(e)=>setfile(e.target.files[0])}
  />
      </InputGroup>

                  <Button variant="success" className={animation?"loading-btn w-100 mt-2":"fade-slide-in w-100 mt-2"} type='submit' onClick={uploadFile}>Upload File</Button>

                       <div className='prev' style={{display:prevShow ? "block" : "none"}}>

            <div className="message fs-5 mt-3 p-2 text-center alert alert-success">
              <p className='m-0'> {prevShow?"✅ file upload successfully": failed}</p>
            </div>

            <div className='prev-image mt-4'><img src={downloadUrl} alt="img"  style={{width:"150px" , borderRadius:"15px"}}/></div>

            <div className="img-details mt-3">
             <p> <strong className='fs-5'>File : </strong>  <span>{fileName}</span></p>
                
           <p>  <strong className='fs-5'> UplodedAt : </strong>{showDate()}</p>
            </div>

           <div className="download-button">
            <button onClick={()=>{downloadFile(downloadUrl, fileName)}} className='btn btn-outline-success btn-sm download-btn'>Download</button>
           </div>



          </div>
  
          </main>

     
        </Container>

    </div>
}

export default Section ;