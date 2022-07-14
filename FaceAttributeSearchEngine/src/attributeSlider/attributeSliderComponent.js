import React from "react";
import "./attributeSlider.css"
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';
class CheckboxComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     // onlyCheck: true,
     check: false,
    };

  }
  
  onChangeAttribute = (op, i) => {
    // console.log(value);
    // this.setState({ check: value });
    // for(let a =1; a<=5; a++){
    //   if(a!=i){
    //     let ch = "checked" + a.toString;
    //     op.ch = false;
    //     console.log(op.ch);
    //   }
      
    //}
    //op.checked2 = false
    

  };
  render() {
    const checkboxList = this.props.checkboxList;
    //const checkboxList = this.props.onlyCheck;
    let min=parseInt(this.props.checkboxList[0].min);
    let max=parseInt(this.props.checkboxList[0].max);
    let step=parseInt(this.props.checkboxList[0].step);
    let val1= min + step;
    let val2= min + step*2;
    let val3= min + step*3;
    return (
      <>
      
      {checkboxList.map((option) => (
      
        <div className = "checkbox"  key={option.id}>
      
        <table className="table table-style" >

          <tbody>

            <tr >

              <td htmlFor={option.id} style={{marginLeft:'0px'}} class="cont_for_att">
                <h1>{option.name}</h1>
              </td>

              <td >
                <div class="content">
                <input
                className="form-check-input"
                  type="checkbox"
                  style={{ marginRight: '10.0',marginLeft: '10.0'}}
                  value={min.toString()}
                  checked1= {option.isChecked}
                  // {option.checkedone==false ? option.isChecked: false}
                  // {...option.isChecked ? option.checkedone=true : option.checkedone=false}
                  // {...this.state.onlyCheck==true ? this.state.onlyCheck= !option.isChecked : null}
                  onChange={(e) => {this.props.onChange(e,option)
                     //this.onChangeAttribute(option, 1)
                     if(option.isChecked){
                        //option.checkedone=true
                        option.checkedval= option.value;
                     }
                    //  if(!option.isChecked && option.checkedval== option.value)
                    //      option.checkedone=false
                        //this.setState({ check:  true});
                  }
                }
                />
                {val1 < max ? (
                  <input
                  className="form-check-input"
                  style={{ marginRight: '10.0',marginLeft: '10.0'}}
                    type="checkbox"
                    value={val1.toString()}
                    checked2={option.isChecked}
                    // {...this.state.onlyCheck==true ? this.state.onlyCheck= !option.isChecked : null}
                    onChange={(e) => {this.props.onChange(e,option)
                      if(option.isChecked){
                        //option.checkedone=true
                        option.checkedval= option.value;
                     }
                    //  if(!option.isChecked && option.checkedval== option.value)
                    //      option.checkedone=false
                    }}
                  />
                ) : (
                <></>
                )}
                {val2 < max ? (
                  <input
                  className="form-check-input"
                  style={{ marginRight: '10.0',marginLeft: '10.0'}}
                    type="checkbox"
                    value={val2.toString()}
                    checked3={option.isChecked}
                    onChange={(e) => this.props.onChange(e,option)}
                  />
                ) : (
                <></>
                )}
                  {val3 < max ? (
                  <input
                  className="form-check-input"
                  style={{ marginRight: '10.0',marginLeft: '10.0'}}
                    type="checkbox"
                    value={val3.toString()}
                    checked4={option.isChecked}
                    onChange={(e) => this.props.onChange(e,option)}
                  />
                ) : (
                <></>
                )}
                   <input
                className="form-check-input"
                style={{alignItems:'end'}}
                  type="checkbox"
                  value={max.toString()}
                  checked5= {option.isChecked}
                  //{option.checkedval==option.value ? option.isChecked: false}
                  
                  // {...this.state.onlyCheck==true ? this.state.onlyCheck= !option.isChecked : this.state.onlyCheck= option.isChecked}
                  onChange={(e) => {this.props.onChange(e,option)
                    if(option.isChecked){
                     // option.checkedone=true
                      option.checkedval= option.value;
                      console.log("xx "+option.checkedval)
                   }
                  //  if(!option.isChecked && option.checkedval== option.value)
                  //      option.checkedone=false
                  }}
                />
                </div>
              </td>
              </tr>

      </tbody>

      </table>

</div>
          
        ))}
    </>
    );
  }
}
export default CheckboxComponent;