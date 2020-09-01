import React, {useState}  from 'react';


export const AuthContext = React.createContext({
    isAuth : false ,
    login: () => {}
});

const AuthContextProvider = props =>{
    const [Authenticated,setIsAutnenticated] =useState(false);

    const loginHandler =() =>{
        setIsAutnenticated(true);
    };

    return(
        <AuthContext.Provider value={{login:loginHandler, isAuth: Authenticated}}>
            {props.children}
        </AuthContext.Provider>
    );
};

export default AuthContextProvider;