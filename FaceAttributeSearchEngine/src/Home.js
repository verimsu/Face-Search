import React from 'react';
import NavBar from './components/navBar/navBar.js';
import './App.css';
import DatabaseSelection from './DatabaseSelection';
import AttributeSelection from './attributeSlider/attributeSlider.js';



class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {
        data: null,
        databaseAttributes: null,
        isAttributeListPassed: false
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
                  value: ''
                };
        })
        

       
        this.setState({
          databaseAttributes: attributes
        })
        this.setState({
          isAttributeListPassed: true
        })

      }
     
    }

  render(){

    const {data} = this.state;
    return (
      
      <div>
         <NavBar/>
         <DatabaseSelection 
              pCallback = {this.handleDatabaseSelection}
        />
        {this.state.isAttributeListPassed ? 
              <AttributeSelection 
                parentCallback = {this.handleCallback}
                attributeList = {this.state.databaseAttributes}
              /> :
              <p>nopee losers</p>
        }
         <div className="main--container">
           
            <div className='cont'>
              <div className='img-grid'>
                {data}
              </div>
  
         </div>
           </div>
         
      </div>
     
    );

  }
  
}
export default Home;

/*  */
