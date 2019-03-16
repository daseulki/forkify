import {elements} from './base'

export const getInput = () => elements.searchInput.value;
export const clearInput= () => {
    elements.searchInput.value='';
}
export const clearResults = () => {
    elements.searchResList.innerHTML='';
    elements.searchResPages.innerHTML = '';
}


export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

    const renderRecipe = recipe => {        
        const markup = `
        <li>
            <a class="results__link" href="#${recipe.id}">
                <figure class="results__fig">
                    <img src="${recipe.smallImageUrls}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.recipeName}</h4>
                    <p class="results__author"> ${recipe.sourceDisplayName}</p>
                </div>
            </a>
        </li>`;
        elements.searchResList.insertAdjacentHTML('beforeend',markup);
    }; 

//type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page -1 : page + 1}>
        <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        //Only button to go to next page
        button = createButton(page, 'next');
    }else if (page < pages) {
        // Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    }
     else if (page === pages) {
        //Only button to go to prev page
        button = createButton(page, 'prev');
    }    
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //console.log(recipes.matches.length)
    
    if(recipes.matches.length == 0) {
        alert('no Results!')        
    } else {
        const start = (page - 1) * resPerPage;
        const end = page * resPerPage;

        recipes.matches.slice(start, end).forEach(renderRecipe);
        
        renderButtons(page, recipes.matches.length, resPerPage);
    }
}