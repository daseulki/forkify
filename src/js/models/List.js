import uniqid from 'uniqid' //자동으로 유니크아이디 생성해줌..

export default class List {
    constructor () {
        this.items = [];
    }
    addItem (count,unit,ingredient) {
        console.log(uniqid())
        const item = {
            id : uniqid(),
            count,
            unit,
            ingredient
        }
        this.items.push(item);
        return item;
    }

    deleteItem (id) {
        const index =  this.items.findIndex(el => el.id === id);
        return this.items.splice(index, 1);    //원래 array 변형시킴 slice는 변형 없음
    }

    updateCount (id,newCount){
        this.items.find(el => el.id === id).count = newCount;

    }
}