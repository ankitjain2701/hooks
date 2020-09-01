import React, { useReducer, useState, useEffect, useCallback, useMemo} from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from  '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (currentIngredients , action) => {
  switch (action.type) {
    case 'SET':
        return action.ingredients;
    case 'ADD':
        return [...currentIngredients, action.ingredient];
    case 'DELETE':
        return currentIngredients.filter( ing => ing.id !== action.id  )
    default:
      throw new Error('Should not get there!');    
  }
};

const httpsReducer = (curHttpState, action) => { 
  switch(action.type){
    case 'SEND':
      return {loading:true, error: null};
    case 'RESPONSE':
      return {...curHttpState , loading: false };
    case 'ERROR':
      return{loading: false, error: action.errorMessage };
    case 'CLEAR':
      return{...curHttpState, error: null};  
    default:
     throw new Error('Should not be reached!');
  }
};

const Ingredients = () => {
   const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
   const [httpState, dispatchHttp] = useReducer(httpsReducer,{ loading: false, error: null });
 // const [userIngredients, setUserIngredients] = useState([]);
  //const [isLoading, setIsLoading] =useState(false);
  //const [error, setError]= useState();

  // useEffect(()=>{
  //   fetch('https://react-hooks-update-dcb02.firebaseio.com/ingredients.json')
  //       .then(response => response.json())
  //       .then(responseData =>{
  //         const loadedIngredients =[];
  //         for( const key in 
  //         responseData){
  //           loadedIngredients.push({
  //            id : key,
  //            title: responseData[key].title,
  //            amount: responseData[key].amount
  //          });
  //       }
  //       //setUserIngredients(loadedIngredients);
  //     });
  // }, 
  // []);
    
  useEffect(()=>{
    console.log('RENDERING INGREDIENTS',userIngredients);
  }, [userIngredients]);

  const  filterIngredientsHandler = useCallback(filteredIngredients =>{
    //setUserIngredients(filteredIngredients);
    dispatch({type:'SET', ingredients: filteredIngredients});
  },[]);

  const addIngredientHandler = useCallback (ingredient => {
   // setIsLoading(true);
    dispatchHttp({type:'SEND'});
    fetch('https://react-hooks-update-dcb02.firebaseio.com/ingredients.json',{
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type' : 'application/json'}
    })
    .then(response=>{
      //setIsLoading(false);
      dispatchHttp({type:'RESPONSE'});
      return response.json()
    })
    .then(responseData =>{
    //   setUserIngredients(prevIngredients =>[
    //   ...prevIngredients, 
    //   {id: responseData.name, ...ingredient}
    // ]);
    dispatch({
      type:'ADD',
      ingredient:{ id: responseData.name, ...ingredient}
      });
    }); 
   
  },[]);

  const removeIngredientHandler = useCallback((id) =>{
    //setIsLoading(true);
    dispatchHttp({type:'SEND'});
     fetch(`https://react-hooks-update-dcb02.firebaseio.com/ingredients/${id}.json`,{
      method: 'DELETE'
    }).then(response => {
        //setIsLoading(false);
        dispatchHttp({type:'RESPONSE'});
    //     setUserIngredients(prev=> 
    //     prev.filter(item=> item.id!==id)
    //  );
    dispatch({type:'DELETE',id: id});
    }).catch(error =>{
        dispatchHttp({type:'ERROR', errorMessage:'Something went wrong!'});
        //setError('something went wrong!');
    });
  },[]);
  
  const  clearError =useCallback(() =>{
   // setError(null); 
    //setIsLoading(false);
    dispatchHttp({type:'CLEAR'});
  },[]);

 const ingredientList = useMemo(() =>{
    return(
      <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={(removeIngredientHandler)}
      />
    );
 },[userIngredients,removeIngredientHandler]);

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>} 
      
      <IngredientForm  
        onAddIngredient={addIngredientHandler} 
        loading ={httpState.loading}
      />

      <section>
        <Search onLoadIngredients={filterIngredientsHandler }/>
          {ingredientList}     
      </section>
    </div>
  );
}

export default Ingredients;
