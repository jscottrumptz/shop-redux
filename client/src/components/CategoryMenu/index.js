import React, { useEffect } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";

import { idbPromise } from '../../utils/helpers';

import { useStoreContext } from "../../utils/GlobalState";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';

function CategoryMenu() {
  // const categories = categoryData?.categories || [];

  // we immediately call upon the useStoreContext() Hook to retrieve the current state from the global
  // state object and the dispatch() method to update state.
  const [state, dispatch] = useStoreContext();
  // Because we only need the categories array out of our global state, we simply destructure it out of
  // state so we can use it to provide to our returning JSX.
  const { categories } = state;

  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // when this component loads and the response from the useQuery() Hook returns, the useEffect() Hook
  // notices that categoryData is not undefined anymore and runs the dispatch() function, setting our
  // category data to the global state!
  useEffect(() => {
    // if categoryData exists or has changed from the response of useQuery, then run dispatch()
    if (categoryData) {
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    } else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
  }, [categoryData, loading, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
