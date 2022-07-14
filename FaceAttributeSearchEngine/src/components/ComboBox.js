import { colors } from "@material-ui/core";
import React, { useState } from "react";
import ComboBox from "react-responsive-combo-box";
import "react-responsive-combo-box/dist/index.css";
import DatabaseSelection from '../DatabaseSelection';
import "./styles.css";

export default function Combobox(props) {

  const [selectedOption, setSelectedOption] = useState("");
  const [highlightedOption, setHighlightedOption] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [highlightedValue, setHighlightedValue] = useState("");
  console.log(localStorage.getItem('attributeList'));
  let arr;
  //if(localStorage.getItem('attributeList')!=null){
  let att= localStorage.getItem('attributeList');
  arr= att.split(",");
//}

  const options = [];
  let attributes=localStorage.getItem("wantedAttributeList");
  let attArr;
  if(localStorage.getItem("wantedAttributeList")!=null){
    attArr= attributes.split(",")
    for(var i=0;i< attArr.length; i++){
      let arr1=attArr[i].split("=");
      options.push(arr1[0])
    }   
  }
  else{
    for(var i=0;i< arr.length; i++)
      options.push(arr[i])
  }

  const handleAttributeChange = ()=>{
     if( localStorage.getItem("imgstochange")=="null")
      alert("Not selected any image for change");
     else if(selectedOption.length==0)
      alert("You must select attribute for change");
     else if(selectedValue.length==0)
      alert("You must select attribute value for change");
     else if(selectedOption.length>0 &&  localStorage.getItem("imgstochange")!="null" && selectedValue.length>0)
     {
        console.log("here", selectedOption)
        let imgs= localStorage.getItem("imgstochange");
        let imgArr = imgs.split(",");
        let finArr=[];
        //for(var i=0; i<attArr.length; i++){
        //  var selected;
        // for(var j=0; j<attArr.length; j++){
        //   let arr=attArr[j].split("=");
        //   if(arr[0]==selectedOption){
        //     selected=arr[0];
        //   }
        // }
        // for(var i=0; i<imgArr.length; i++){
        //   //let arr2=imgArr[i].split("=");
        
        //   let att= selectedOption + "=" + selectedValue;
        //   finArr.push(att); 
          
        // }
        let att= []
        att.push(selectedOption + "=" + selectedValue);
        //console.log("finarr  ",finArr);
        let a =0;
        for(var i=0; i< imgArr.length; i++){
            //console.log("finarr ii ", finArr[i])
           
            // let imgarr=imgArr[i].split("=");
            // console.log("img 0 ", imgarr[0])
            // console.log("fin "+finArr)
            // let ar=[];
            // ar.push(finArr[i]);
            const option = {
              method: "PUT",
              body: JSON.stringify(att),  //ar
              headers: {
                  "Content-Type": "application/json"
              }
            }
          console.log(option.body)
        
          fetch(`http://localhost:3001/faces/api/v1/search/${imgArr[i]}`, option) //imgarr[0]
              .then(res => res.json())
              .then(data => {
                  console.log(data)
                  if( data === 'OK')
                  {
                      console.log("Updated")
                      localStorage.setItem("imgstochange", null)
                      if(a==0)
                      alert("Attribute of all images you selected updated");
                      a++;
                  }
                  else{
                      console.log(data)
                  }
              
                
              })
       }
     }

  }


  return (
    <div className="Combobox" style={{marginLeft:'78%'}}>
      <div style={{marginLeft:'5%'}}>
      <ol>
        <li>Select images</li>
        <li>Select the attribute you want to change</li>
        <li>Select the target value</li>
        <li>Click Change button</li>
      </ol>
        {/* <h4>1. Select images</h4>
        <h4>2. Select the attribute you want to change</h4>
        <h4>3. Select the target value</h4>
        <h4>4. Click Change button </h4> */}
       
      </div>
      <ComboBox
        options={options}
        placeholder="select attribute"
        defaultIndex={4}
        optionsListMaxHeight={300}
        style={{
          width: "270px",
          margin: "0 auto",
          marginTop: "25px"
        }}
        focusColor="#20C374"
        renderOptions={(option) => (
          <div className="comboBoxOption">{option}</div>
        )}
        onSelect={(option) => setSelectedOption(option)}
        onChange={(event) => console.log(event.target.value)}
        enableAutocomplete
        onOptionsChange={(option) => setHighlightedOption(option)}
      />
      <ComboBox
        options={props.vals}
        placeholder="select target value"
        defaultIndex={4}
        optionsListMaxHeight={300}
        style={{
          width: "270px",
          margin: "0 auto",
          marginTop: "20px",
        }}
        focusColor="#20C374"
        renderOptions={(option) => (
          <div className="comboBoxOption">{option}</div>
        )}
        onSelect={(option) => setSelectedValue(option)}
        onChange={(event) => console.log(event.target.value)}
        enableAutocomplete
        onOptionsChange={(option) => setHighlightedValue(option)}
      />
      <div class="row">
      <div class="col" style={{marginLeft:'35%', fontSize:'30px', marginTop:'5%'}}>
      <button className="button" type="change" onClick={()=>handleAttributeChange()}>
        Change
      </button>
      </div>
      </div>
    </div>

     
  );
}