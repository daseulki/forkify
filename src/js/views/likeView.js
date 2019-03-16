import { elements } from './base';

export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
    //elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
    const iconString = numLikes > 0 ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.likes__icon use').setAttribute('href', `img/icons.svg#${iconString}`);
};

export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.name}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${like.name}</h4>
                    <p class="likes__author">${like.source}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}