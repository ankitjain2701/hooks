import React, { useState, useEffect, useRef }  from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  
  const { onLoadIngredients } =  props;
  const [enteredfilter, setEnteredFilter] = useState(''); 
  const inputRef = useRef(); 

  useEffect(()=>{
    const timer = setTimeout(() => {
      if(enteredfilter === inputRef.current.value){
          const query = enteredfilter.length === 0 
    ? ''
    : `?orderBy="title" &equalTo="${enteredfilter}"`;
    fetch('https://react-hooks-update-dcb02.firebaseio.com/ingredients.json' + query)
        .then(response => response.json())
        .then(responseData =>{
          const loadedIngredients =[];
          for( const key in responseData){
            loadedIngredients.push({
             id : key,
             title: responseData[key].title,
             amount: responseData[key].amount
           });
        }
        onLoadIngredients(loadedIngredients);
      });
      }
      
    }, 500);
    return() => {
      clearTimeout(timer);
    };
  }, [enteredfilter,onLoadIngredients,inputRef] );

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          
          <input 
          ref= {inputRef}
          type="text"  
          value = {enteredfilter} 
          onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
