import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import CheckboxComponent from "./attributeSliderComponent.js";
import ImageCard from '../components/imageGrid/ImageCard';
import "../global.css";

class AttributeSelection extends React.Component {

  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.state = {
      checkboxList: props.attributeList,
      finalAttributeList: null,
      valueList: props.valueList
    };

    console.log(this.state.checkboxList)
  }


  onChange = (event) => {
    console.log(event);
    this.setState({ selectedValue: event.target.value });
  };

  handleOnChange(event,option) {
    let checkboxList = this.state.checkboxList;
    checkboxList.forEach(chkItem=>{
      if(chkItem === option){
        chkItem.value = event.target.value;
        chkItem.isChecked =  event.target.checked; 
      }
    })
    
    let names = []

    for (let i = 0; i < checkboxList.length; i++) {
      //if (checkboxList[i].value !== ''){
      if (checkboxList[i].value !== '' && checkboxList[i].isChecked){
        names.push(checkboxList[i].name + "=" + checkboxList[i].value)
      }
    }
    //console.log(names);
    this.setState({
      finalAttributeList: names
    });

    if(names.length == 0){
      this.setState({
        finalAttributeList: null
      });
    }
    
  }

  handleOnSubmit(){
    console.log("fin attlist ", this.state.finalAttributeList);
    localStorage.setItem("imgstochange", null)
    if(this.state.finalAttributeList !== null)
    { 
        localStorage.setItem("wantedAttributeList", this.state.finalAttributeList)
        const options = {
          method: "POST",
          body: JSON.stringify(this.state.finalAttributeList),
          headers: {
              "Content-Type": "application/json"
          }
      }
      console.log(options.body)

    fetch("http://localhost:3001/faces/api/v1/search", options)
        .then(res => res.json())
        .then(data => {
          this.props.parentCallback(null);
          let results = data.map((img) =>{
            return (
                <ImageCard key={img.image_id} image_id = {img.image_id} vals = {this.props.valueList}/>
            )
          })
          this.props.parentCallback(results);
          
        })
    }
    else{
        //Display a UI such that the user knows no selecion is made
    }

  }

  attColNames(){
    console.log("list ",this.state.checkboxList[0].min);
    let rows=[];
    let min=parseInt(this.state.checkboxList[0].min);
    let max=parseInt(this.state.checkboxList[0].max);
    let step=parseInt(this.state.checkboxList[0].step);
    
    let val1= min + step;
    let val2= min + step*2;
    // for(i; i<=max; i+=step){
    //   rows.push(1);
    // }
    console.log("rows  ", rows)
    
     return( <tr>
     <th scope="col">Attribute</th>
      <th scope="col">{min}</th> 
       {val1 < max ? (
         <th scope="col">{val1}</th> 
      ) : (
       <></>
      )}
      {val2 < max ? (
         <th scope="col">{val2}</th> 
      ) : (
       <></>
      )}
      <th scope="col">{max}</th> 
      </tr> )  
  }

  
  render() {
    return (
      
              <div className = "table-container">
              <div>
              <div className = "checkbox">
      
              <table className="table table-style" >

                <thead className="thead-dark">
               
                  {this.attColNames()}
            
                </thead>
                </table >
                  <CheckboxComponent 
                  checkboxList={this.state.checkboxList}  
                  onChange={this.handleOnChange}
                  />
                </div>
              </div>

              <button className = "button"  style={{width:'100%', marginTop:'0', fontSize:'20px', textAlign: 'center'}} onClick={()=>this.handleOnSubmit()}>Submit</button>
            </div>
          
       
      
      
    );
  }
}
export default AttributeSelection;