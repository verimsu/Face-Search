import React, { Component } from "react";
import NavBar from './components/navBar/navBar.js';
import DatabaseSelection from './DatabaseSelection';
import './App.css';

class Demo1 extends Component {
  constructor() {
    super();
    this.state = {
      name: "React"
    };
  }

  render() {
    return (
        <section>
         <div class="main-content-hidden">
          
         <h3 className='text'>Please upload the arff file of dataset</h3>
         
         <br/>
          
         <DatabaseSelection 
         
              pCallback = {this.handleDatabaseSelection}
              newCall = {this.eraseList}
              
         />
         </div>
         </section>
     
     );
  }
}

export default Demo1;