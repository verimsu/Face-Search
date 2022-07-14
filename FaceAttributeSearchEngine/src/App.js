import React from 'react';
import NavBar from './components/navBar/navBar.js';
import './App.css';
import DatabaseSelection from './DatabaseSelection';
import AttributeSelection from './attributeSlider/attributeSlider.js';
import {Routes, Route} from 'react-router-dom'
import Noselection from './noselection'
import axios from 'axios';
import {Progress} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Combobox from './components/ComboBox.js';
import { storage } from "./firebase/index";
import { render } from "react-dom";
import "./global.css";
import Demo1 from './hidden';
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        data: null,
        databaseAttributes: null,
        valueList: null,
        isAttributeListPassed: false,
        uploaded: false,
    }

  }
    
    //grid
    handleCallback = (childData) =>{
    this.setState({data: childData})}

    //attributeslider 
    handleDatabaseSelection = (databaseSelect) =>{

      console.log(databaseSelect)

      if( databaseSelect !== null)
      {
        console.log("Initial value of bool")
        console.log(this.state.isAttributeListPassed)
        let attributesD = databaseSelect[0];
        console.log("att ddd "+attributesD)
        attributesD = attributesD.slice(1,attributesD.length);
        let min = databaseSelect[1][0];
        let max = databaseSelect[1][(databaseSelect[1].length)-1];
        let step = 0;
        let len = databaseSelect[1].length;
        if((max - min)=== len ){
          step = 2
        }
        else{
          step = 1
        }

        let attributes  = attributesD.map((item,index)=>
          {
            return {
                  id: index,
                  name: item,
                  val: max + 1 ,
                  min: min,
                  max: max,
                  step: step,
                  value: '',
                  checkedone: false,
                  checkedval: 0,
                };
        })
        

       
        this.setState({
          databaseAttributes: attributes
        })
        this.setState({
          isAttributeListPassed: true
        })
        this.setState({
          valueList: databaseSelect[1]
        })

      }
     
    }
    
    eraseList = (childData) =>{
      this.setState({isAttributeListPassed: childData})
      this.setState({uploaded: childData})
      this.setState({data: null})
    }

  



  render(){
    const {data} = this.state;
    return (
      
      <div >

       

        <section>
        <NavBar/>
         <br/>
         <header class="main-header"></header>
         {/* <div class="main-content"> */}
          
         {/* <h3 className='text'>Please upload the arff file of dataset</h3> */}
         
         <br/>
          
         <DatabaseSelection 
         
              pCallback = {this.handleDatabaseSelection}
              newCall = {this.eraseList}
              
         />
         {/* </div> */}
         </section>
      
        
        <section>
          
     
  
         {/* {this.state.isAttributeListPassed ? 
         
              <Combobox />: null
         } */}
         {this.state.isAttributeListPassed && this.state.valueList!=null? 
              <Combobox vals={this.state.valueList}
              />: null
         }

        {/* <Combobox /> */}
        {this.state.isAttributeListPassed ? 
        <h4 style={{ fontSize:'15px', maxWidth:'20%'}}> </h4>
        :
        <></>}
        <table>
         <td> 
        <div className='main--checkbox'>
        {this.state.isAttributeListPassed ? 
              <> 
              <AttributeSelection 
                parentCallback = {this.handleCallback}
                attributeList = {this.state.databaseAttributes}
                valueList = {this.state.valueList}
              /></> : <p></p>
        }
        </div>
       </td>
       <td>
       {/* {data!=null ? */}
        <div className="main--container">
              
              
   
              <div className='img-grid'>
                {data}
              </div>
        

        </div>
         {/* :     
         <></>
        }    */}
        {data!=null && data.length==0 && this.state.isAttributeListPassed ?  
            <div class="container" style={{ marginTop: '70%', marginLeft: '270%', fontSize:'20px', maxWidth:'100%', borderRadius:'20px'}}> 
              <h4 >No images to show</h4>
            </div>:
             <></>}
       </td>
     </table>
     </section>
     </div>
    
      
        
     
    );

  }
  
}
export default App;

/*  */
