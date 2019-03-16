//global._babelPolyfill = false; //bable instance global 호출 안되게 막음.. 

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likeView';

import { elements,renderLoader,clearLoader } from './views/base';


/*****************************  
    search object
    current recipe object
    shopping list object
    liked recipes
******************************/

const state = {};
/////////// SEARCH CONTROLLER ////////////////
const controlSearch = async () => {
    const query = searchView.getInput();
    //console.log(query);

    if(query){
        state.search = new Search(query);
       
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        await state.search.getResults();
        
        clearLoader();
        searchView.renderResults(state.search.result);
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();    
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults()
        searchView.renderResults(state.search.result, goToPage);
    }    
})

////////////////// RECIPE CONTROLLER //////////////////

const controlRecipe = async () => {    
    const id = window.location.hash.replace("#",'');

    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);

        state.recipe = new Recipe(id);

        try {
            await state.recipe.getRecipe();   

            state.recipe.calcTime();
            state.recipe.parseIngredients();
            
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        } catch(error) {
            console.error(error);

        }        
    } 
}

//window.addEventListener('hashchange',controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/////////////////////// LIST CONTROLLER ////////////////

const controlList = () => {
    //console.log('controlList')
    if (!state.list) state.list = new List();
    //console.log(state.recipe.ingredient)
    state.recipe.ingredient.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}
 
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        console.log(id);
        console.log(listView);
        state.list.deleteItem(id);
        listView.deleteItem(id);

    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);

    } //else if(e.target.matches('.shopping__delete ')) {} 
});


//////////////////////// LIKE CONTROLLER ///////////////////////

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {  // 레시피 좋아요 하기 전..
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.name,
            state.recipe.source,
            state.recipe.img
        );
        likesView.toggleLikeBtn(true);
        likesView.renderLike(newLike);

    } else {
        state.likes.deleteLike(currentID);
        likesView.toggleLikeBtn(false);
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load', () => {
    state.likes = new Likes();  
    //state.likes.readStorage();

    //likesView.toggleLikeMenu(state.likes.getNumLikes());

    //state.likes.likes.forEach(like => likesView.renderLike(like));
});

elements.recipe.addEventListener('click' , e => {
    if(e.target.matches(".btn-decrease, .btn-decrease *")){
        if(state.recipe.numberOfServings > 1 ){
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);

        }

    } else if(e.target.matches(".btn-increase, .btn-increase *")){
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    }
    
});
