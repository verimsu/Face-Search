import React, { useRef, useState } from 'react';


export const GlobalContext = React.createContext();

const GlobalProvider = props => {

    const [ImageArr, setImageArr]= useState([]);
    const [Values, setValues]= useState([]);
    return (
        <GlobalContext.Provider value={{
            ImageArr, setImageArr,
            Values, setValues,
        }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;