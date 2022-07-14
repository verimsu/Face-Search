import {React, useState, useContext, useEffect} from "react"
import CloseIcon from '@material-ui/icons/Close';
import "./imageGrid.css"
import TextField from '@material-ui/core/TextField';
import { Style } from "@material-ui/icons";
import { imagesList, storage  } from "../../firebase/index"; //listAll, wantedImg
import { Checkmark } from 'react-checkmark';
let ImageArr=[]
export default function ImageCard(props) {

    let results= []
   const [url, setUrl] = useState("");
    const [model, setModel] = useState(false);
    const [tempimgSrc, setTempimgSrc] = useState('');
    const [TextValue, setTextValue] = useState(results);
    //const [ImageArr, setImageArr]= useState([]);
    const [style1, setStyle1] = useState("btn");
    const [chosen, setChosen] = useState(false);


    const submitValue = () => {
        const fromdetails = {
            'Return_Text' : TextValue,  
        }
        var myArray = fromdetails.Return_Text.split(",")
        //console.log(myArray)
        //query here post 
        if(myArray.length !== 0)
      { 
        const option = {
          method: "PUT",
          body: JSON.stringify(myArray),
          headers: {
              "Content-Type": "application/json"
          }
      }
      console.log(option.body)
  
    fetch(`http://localhost:3001/faces/api/v1/search/${props.image_id}`, option)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if( data === 'OK')
            {
                console.log("Updated")
            }
            else{
                console.log(data)
            }
        
          
        })
    }
    }

    function closeImageEdit()
    {
        setModel(false)
        // redirect the query back
        //props.attribute 

    }
    

    const getImg = (image) =>{
        setTempimgSrc(image);
        
        fetch(`http://localhost:3001/faces/api/v1/search/${image}`)
            .then(res => res.json())
            .then(data => {
                console.log("att list");
                console.log(data);
               
                 for (let i = 0; i< data.length; i++){
                    results[i] = data[i]
                 }

                setModel(true);
            })
        
    }

    const addImgToFlip = (image) =>{

        //setStyle1("btn2");
        setChosen(true);
        ImageArr.push(image);
        console.log("image array ",ImageArr);
        
        if(localStorage.getItem("imgstochange")=='null' && localStorage.getItem("imgstochange")!=undefined) {
            ImageArr=[];
            ImageArr.push(image);
            console.log("burada")
        } 
      
        localStorage.setItem("imgstochange", ImageArr)
        console.log( localStorage.getItem("imgstochange"))
    }

    function displayVals(imgid){
      
        return(
            
        <div class= "cont" style={{ flexDirection: "row",  justifyContent: 'center', marginTop: '0%'}}> 
        {/* <button class={style1} ></button>   */}
        {chosen && localStorage.getItem("imgstochange")!="null" ? <Checkmark size='small' />: <></>
        }
        </div>
        
        )
    }
    
     function listAll2(folder, imgid){
        const storageRef = storage.ref();
        var listRef = storageRef.child(folder);
        listRef
          .listAll()
          
            .then((res) => {
                  res.prefixes.forEach((folderRef) => {
                    // All the prefixes under listRef.
                    // You may call listAll() recursively on them.
                  });
                  res.items.forEach((itemRef) => {
                    // All the items under listRef.
                       // console.log(itemRef);
                    
                        if (itemRef.name== imgid){
                           itemRef.getDownloadURL().then((url) => {
                          
                            setUrl(url);
                          });
                        
                        }
                  // itemRef.getDownloadURL().then((url) => {
                  // 	console.log("URLL " +url);
                  // 	imagesList.push(url);
            //             });
           
                  });
             
        }).catch((error) => {
          console.log(error);
        });
      }

    return (
    
        <>
        <div className={model? "model open":"model"}>

                <div className="container">
                    <div className="row justify-content-md-center">
                        
                        <div className="col-md-auto">
                            
                            <img src={`../images/${tempimgSrc}`} style={{width: "250px", borderRadius:"5px"}}/>
                            <CloseIcon onClick={closeImageEdit}/>
                        </div>
                        
                    </div>

                    <div className="row justify-content-md-center">
                        
                        <div className="col-md-auto">
                            
                            <TextField
                            label = "Attribute List" 
                            variant="filled"
                            helperText = "Kindly Follow the Format stated above!"
                            inputProps={{style: {fontSize: 20, color:'white'}}}
                            defaultValue={results}
                            onChange={e => setTextValue(e.target.value)}
                            style={{ width: '500px', boxSizing:"border-box"}}
                            
                            />
                
                        </div>
                        
                    </div>
                    <div className="row justify-content-md-center">
                        
                        <div className="col-md-auto">
                        <button type="button" id="submit" 
                             className="btn btn-dark" 
                             style={{ width:"100px", fontSize: "15px"}}
                             onClick={submitValue}>Submit!
                        </button>
                            
                        </div>
                        
                    </div>
                    </div>

        </div>
        {/* <div className="card" className="pics" key={props.image_id} onClick={()=>getImg(props.image_id)}>
            <img src={`../images/${props.image_id}`} className="card--image" />
        </div> */}
    
       {listAll2("images/", props.image_id)} 
        <div class="card" className="pics" key={props.image_id} onClick={()=>addImgToFlip(props.image_id)}>     {/* onClick={()=>addImgToFlip(props.image_id)} */}
            <img src={url} alt="Uploaded images" className="card--image" />
            {/* {imagesList.map((url) => (
              <img src={url || ' ' } alt="Uploaded images" height = "300" width ="400"/>
         ))} */}
            {/* //*{`../images/${props.image_id}`} */ }
            {displayVals(props.image_id)}
        </div>
       
        </>
        
    )
}