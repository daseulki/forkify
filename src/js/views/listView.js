import { elements } from './base';

export const clearList = () => {

    elements.shopping.innerHTML = '';
}

export const renderItem = item => {

    const markup =`
    <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>${item.unit}</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <svg>
                <use href="img/icons.svg#icon-circle-with-cross"></use>
            </svg>
        </button>
    </li>
    `;
    //console.log(markup)
    elements.shopping.insertAdjacentHTML('beforeend', markup);
}
export const deleteItem = id => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    console.log(item.parentElement)
    if (item) item.parentElement.removeChild(item); //자신 없애려면 부모로 접근해서 removeChild

}

export const deleteAll = () => {
    document.querySelectorAll(".shopping__list li").forEach(e => e.parentElement.removeChild(e));
}