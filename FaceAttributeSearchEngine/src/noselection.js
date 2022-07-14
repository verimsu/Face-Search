import React from 'react';
import img from './noselect.png'


function Noselection(){


   

        return(
            <div class="card mb-3" >
            <img src={img} class="card-img-top" alt="..."/>
            <div class="card-body">
                <h5 class="card-title">USER HAS NOT SELECTED A DATASET!</h5>
            </div>
            </div>

        );
    
}

export default Noselection;