export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, name, source, img) {
        const like = { id, name, source, img}
        this.likes.push(like);

        return like;
    }
    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index,1) //수정해야됨 
    }
    isLiked(id){
        return this.likes.findIndex(el => el.id === id ) !== -1;

    }
    getNumLikes(){
        return this.likes.length;
    }

    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
    }
}