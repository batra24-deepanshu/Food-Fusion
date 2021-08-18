import * as model from './model.js';
import searchView from './views/searchView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import receipeView from './views/receipeview.js';
import resultView from './views/resultView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
// import icons from '../img/icons.svg'  //parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if(module.hot){
//   module.hot.accept()
// }
//
// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const showRecipes = async function () {
  //loading Recipe

  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    receipeView.renderSpinner();
    resultView.update(model.getSearchResultPage());
    
    bookmarksView.update(model.state.bookmarks)
    
    await model.loadRecipe(id);
    const { recipe } = model.state;

    // 2.Rendering Recipe
    receipeView.render(model.state.recipe);

    
  } catch (err) {
    receipeView.renderError('We Could not Find that Recipe . try Another One!');
  }
};
const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.getQuery();

    if (!query) {
      return;
    }
    await model.loadSearchResult(query);

    resultView.render(model.getSearchResultPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (gotToPage) {
  resultView.render(model.getSearchResultPage(gotToPage));
  paginationView.render(model.state.search);
};
const controlServing = function (newServing) {
  //update the recipe serving (int state)
  model.updateServings(newServing);

  //update the recipe view
  receipeView.render(model.state.recipe);
};
const controlAddBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookMark(model.state.recipe.id);
  
  receipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks)
};

const controlBookMarks=function(){
  bookmarksView.render(model.state.bookmarks)
}
const controlAddRecipe=async function(newRecipe){
  try{
    addRecipeView.renderSpinner()

    await model.uploadRecipe(newRecipe);


    //Render Recipe
    receipeView.render(model.state.recipe)


    addRecipeView.renderMessage('Recipe Was Successfully Uploaded')

    bookmarksView.render(model.state.bookmarks)

    //change id in url 
    window.history.pushState(null,'',`#${model.state.recipe.id}`)

    //close Form window
    setTimeout(function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC * 1000)
  }catch(err){
    console.log(err);
    addRecipeView.renderError(err.message)
  }
}

const init = function () {
  bookmarksView.addHandlerRender(controlBookMarks)
  receipeView.addHandlerRender(showRecipes);
  receipeView.addHandlerUpdateServing(controlServing);
  receipeView.addHandlerAddBookmark(controlAddBookMark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe)
};
init();
// window.addEventListener('hashchange',showRecipes)
// window.addEventListener('load',showRecipes)
