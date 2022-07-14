import React, { Component, useCallback} from "react";
import './App.css'
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./global.css";
import { storage, listAll } from "./firebase/index";
import {useDropzone} from 'react-dropzone'
import Dropzone from 'react-dropzone';
import { Oval } from  'react-loader-spinner'
import Grid from "@material-ui/core/Grid";

class DatabaseSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      images: [],
      urls: [],
      arff_uploaded: false,
      files: [],
      imgs_uploaded: false,
      form_submitted: false,
    };
    this.onValueChange = this.onValueChange.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  onValueChange(event) {
    this.setState({
      selectedOption: event.target.value
    });
  }

  onChangeHandler=event=>{
    if(this.checkFileType(event)){
      this.setState({
        selectedFile: event.target.files[0],
        loaded: 0,
      })
    }
    else  alert("File is not in supported format, it should have .arff extension");
  }

  checkFileType=(event)=>{
    //getting file object
    let file = event.target.files[0]

    let filearr = file.name.split('.');   
    if(filearr[1]== "arff"){
      return true;
    }
    else {
      event.target.value = null // discard selected file
      return false; 
    }
  
  }
  // onChangeHandler=event=>{
  //   var files = event.target.files
  //   //if(this.maxSelectFile(event) && this.checkMimeType(event) && this.checkFileSize(event)){ 
  //   // if return true allow to setState
  //      this.setState({
  //      selectedFile: files
  //   })
  //  // }
  // }
   deleteFromFirebase = () => {
     //db yeni yüklendikten sonra img sil, alttaki dropboxtaki img gitsin 0 yazsın
    const ref = storage.ref("images/");
    ref.listAll()
      .then(dir => {
        dir.items.forEach(fileRef => this.deleteFile(ref.fullPath, fileRef.name));
        dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
      })
      .catch(error => console.log(error));
    // for(let i=0; i<urls.length; i++){
    //   let pictureRef = storage.refFromURL(urls[i]);
    
    //   pictureRef.delete()
    //     .then(() => {
         
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // }
  };
  deleteFile(pathToFile, fileName) {
    const ref = storage.ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete()
  }

  formSubmit(event) {
    event.preventDefault();
    this.props.newCall(false);
    console.log(this.state.selectedOption);
    this.setState({
      arff_uploaded: false});
    /***** */
    const data = new FormData()
    // for(var x = 0; x<this.state.selectedFile.length; x++) {
    //     data.append('file', this.state.selectedFile[x])
    // }
    if(this.state.selectedFile!=null){

  
    data.append('file', this.state.selectedFile)
    // const headers = {
    //      "Content-Type": "application/json"
    //   }
    // let dbdata="delete previous database"
    // axios.post("http://localhost:3001/faces/api/v1/delete", dbdata)
    // .then(res =>{
     // this.deleteFromFirebase(this.state.urls) 
        axios.post("http://localhost:3001/faces/api/v1/upload", data, {
              onUploadProgress: ProgressEvent => {
                this.setState({
                  loaded: (ProgressEvent.loaded / ProgressEvent.total*100),
              })
          },
        })
        .then(res => { // then print response status
        this.setState({
              arff_uploaded: true});
        this.setState({
          files: [],
          images: [],
          urls: [],
          imgs_uploaded: false,
        });
      
        localStorage.setItem("wantedAttributeList", null)
        toast.success('upload success')
        //this.state.uploaded=true;
        console.log("ress "+res);
        //   const options = {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "application/json"
        //   }
        // }
        // //setTimeout(() => {  console.log("sleep"); }, 8000);
        //   fetch("http://localhost:3001/faces/api/v1", options)
        //   .then(res => res.json())
        //   .then(data => {     
        //       localStorage.setItem('attributeList', data[0]);
        //       this.props.pCallback(data);
        //   })


      this.deleteFromFirebase()  
        })
        .catch(err => { 
          toast.error('upload fail')
        })
  //   }
  //  ).catch(err => { 
  //      console.log("couldnt delete prev db")
  // })

    /***** */
    /*var selection= this.state.selectedOption
    var opt= []
    opt.push(selection);
    const options = {
        method: "POST",
        body: JSON.stringify(opt),
        headers: {
          "Content-Type": "application/json"
      }
    }
   console.log(JSON.stringify(opt));*/
    // fetch("http://localhost:3001/faces/api/v1", options)
    //     .then(res => res.json())
    //     .then(data => {     
    //         this.props.pCallback(data);
    //     })
  }
  }

  maxSelectFile=(files)=>{
  
    //let files = event.target.files // create file object
        if (files.length > 5000) { 
           const msg = 'Only 5000 images can be uploaded at a time'
          // event.target.value = null // discard selected file
           console.log(msg)
          return false;
 
      }
    return true;
 
 }

  //for images
  handleChange = (e) => {
    if(this.maxSelectFile(e)){ 
     
      for (let i = 0; i < e.target.files.length; i++) {
        const newImage = e.target.files[i];
        newImage["id"] = Math.random();
    
        this.setState(prevState => ({
          images: [...prevState.images, newImage]
        }))
      }
   }
   else
   alert("you can upload up to 5000 files")
  };
   handleUpload = () => {
    const promises = [];
    //console.log("imgs  ",this.state.images)
    this.state.images.map((image) => {
      const uploadTask = storage.ref(`images/${image.name}`).put(image);
      promises.push(uploadTask);
      uploadTask.on(
        "state_changed",
       
        (error) => {
          console.log(error);
        },
        async () => {
          await storage
            .ref("images")
            .child(image.name)
            .getDownloadURL()
            .then((urls) => {
              this.setState(prevState => ({
                urls: [...prevState.urls, urls]
              }))
            });
        }
      );
    });
    this.setState({
      imgs_uploaded: true});
    Promise.all(promises)
      .then(() => {
        alert("All images uploaded")
        this.setState({
          form_submitted: true});
     
      /*** */
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
      }
    }
    //setTimeout(() => {  console.log("sleep"); }, 8000);
      fetch("http://localhost:3001/faces/api/v1", options)
      .then(res => res.json())
      .then(data => {   
          this.setState({
          imgs_uploaded: false});  
          localStorage.setItem('attributeList', data[0]);
          this.props.pCallback(data);
      
      }) /**** */
    })
      .catch((err) => console.log(err));
  };

 

  // func = (acceptedFiles, getRootProps, getInputProps) => useDropzone({
  //   getFilesFromEvent: event => myCustomFileGetter(event)
  // });

  // files = ()=>acceptedFiles.map(f => (
  //   <li key={f.name}>
  //     {f.name} has <strong>myProps</strong>: {f.myProp === true ? 'YES' : ''}
  //   </li>
  // ));

  render() {
    return (
      <>
      {this.state.form_submitted==false ? <>
        <h3 className='text'>Please upload the arff file of dataset</h3>
      <form onSubmit={this.formSubmit}>
{/* //backgroundColor:'#ffcccc', */}
      <div class="container" style={{ fontSize:'20px', maxWidth:'50%', borderRadius:'20px'}}> 
        <div class="row">
        <input type="file" class="form-control" name="file" onChange={this.onChangeHandler}/>
        {/* <input type="file" class="form-control" multiple onChange={this.onChangeHandler}/> */}
         <div class="form-group">
         <Progress max="100" color="success" value={this.state.loaded} >{Math.round(this.state.loaded,2) }%</Progress>
         </div>
         {/* <button type="submit" class="btn btn-success btn-block" >Upload</button>  */}
         {/* <div class="form-group">
          <ToastContainer />
          </div> */}
          {/* <div class="col" style={{marginLeft:'150px'}}>
          <label >
            <input
              type="radio"
              value= "CelebA"
              checked={this.state.selectedOption === "CelebA"}
              onChange={this.onValueChange}
            />
            CelebA
          </label>
          </div>
          <div class="col">
          <label>
            <input 
              type="radio"
              value= 'LFWA'
              checked={this.state.selectedOption === 'LFWA'}
              onChange={this.onValueChange}
            />
            LFWA
          </label>
          </div> */}
        </div>

        <div class="row">
          <div class="col" style={{marginLeft:'45%', fontSize:'30px'}}>
           
          <button class="button" type="submit">
          Upload
        </button>
        </div> 
          
        </div>

   
 
      </div>
      </form>

      {this.state.arff_uploaded ?  
      <div class="container" style={{ fontSize:'20px', maxWidth:'50%', borderRadius:'20px'}}> 
      <div class="row">
      {/* <h4 className='text2'>Upload the images</h4> */}
      {/* <input type="file" class="form-control" multiple onChange={this.handleChange} /> */}
      {/* <div {...getRootProps()}>
      <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
      </div> */}
      <Dropzone  class= "dropzone" accept='image/*' onDrop={acceptedFiles => { 
        if(this.maxSelectFile(acceptedFiles)){
        this.setState(({
          files: 
          <li>
            <h4>{acceptedFiles.length} files loaded </h4>
          </li>
        }))
        this.setState(({
        images: acceptedFiles}))
        }
        else 
          alert("you can upload up to 5000 files")
        }}>
        {({getRootProps, getInputProps}) => (
          <section>
           
            <div {...getRootProps()} directory="" webkitdirectory="" type="file">
            <input {...getInputProps()} directory="" webkitdirectory="" type="file" />
            <br/>
            <div class="drag-area">
            <div class="icon"><i class="fas fa-cloud-upload-alt"></i></div>
              <header>Drag and drop image folder here, or click to select image files</header>
              
              </div>
            </div>
            
            <aside>
              {/* <h4>Files</h4> */}
              {/* {this.state.files.length!=0 ? <ul>{this.state.files}</ul> : <ul> <li><h4> </h4></li></ul>} */}
            </aside>
          </section>
          
        )}
      </Dropzone>
      {/* <section className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside>
        <h4>Files</h4>
        <ul>{files}</ul>
      </aside>
    </section> */}
      <div class="row">
      <div class="col" style={{marginLeft:'46%', fontSize:'30px'}}>
      <button className= 'button' onClick={this.handleUpload}>Upload</button>
     
      </div></div>
      </div>
      </div> 
       : <></>}
       <Grid container justify="center" marginTop="10%">
       {this.state.imgs_uploaded && this.state.images.length>0 ? <Oval color="#00BFFF" height={60} width={60} marginLeft='400%'/>: <></>}
       </Grid>
      </>
      : <></>}
      </>
    );
   
  }
}

export default DatabaseSelection ;

// 
/* <div>
Selected option is : {this.state.selectedOption}
</div> */