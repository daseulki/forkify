import axios from 'axios';
import {key, appid} from '../config.js'

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {         
        try {
            //http://api.yummly.com/v1/api/recipe/Pasta-Carbonara-2547880?_app_id=23f43a3d&_app_key=f38c22a3fe38749dbc74d6ede1f1da7c
            const res = await axios(`http://api.yummly.com/v1/api/recipe/${this.id}?_app_id=${appid}&_app_key=${key}`);
            this.name = res.data.name; //레시피 이름 (title이나 author 쓰는데 다 이거 썼음..)
            this.source = res.data.source.sourceDisplayName; //소스.. 갖고는 왔는데 필요 없는듯 
            this.img = res.data.images[0].hostedLargeUrl;   //이미지 접근
            this.ingredient = res.data.ingredientLines;     //ingredient로 해놔서.. 안헷갈리게 잘해야됨..
            this.cookTime = parseInt(res.data.totalTimeInSeconds)/60;  //분으로 계산 
            this.numberOfServings = res.data.numberOfServings;  
            this.url = res.data.source.sourceSiteUrl;
            // console.log(res)
            // console.log(this.cookTime)
        } catch (error) {
            console.log(error)
        }
    }

    calcTime() {

    }
    calcServings() {
        
    }

    parseIngredients() {
        //console.log(`1. ${this.ingredient}`)
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g', 'can','ml'];

        const newIngredients = this.ingredient.map(el => {

            let ingredient = el.toLowerCase();

            //console.log(`2. ${ingredient}`);
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);
            });

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' '); //정규표현식 띄어쓰기 
        
            const arrIng = ingredient.split(' ');
            //console.log(arrIng)
            const unitIndex = arrIng.findIndex(el => units.includes(el));
            //indexOf는 작동 안함.. 누가 뭐 갖고있는지 모르니까 

            let objIng;
            
            if (unitIndex > -1) {   //unit이 있을때 
                const arrCount = arrIng.slice(0, unitIndex); 
                let count;
            
                if (arrCount.length === 1) {
                    arrIng[0] = arrIng[0].replace('half','+0.5');
                    arrIng[0] = arrIng[0].replace('¼','+0.25');
                    arrIng[0] = arrIng[0].replace('½','+0.5');
                    arrIng[0] = arrIng[0].replace('¾','+0.75');
                    arrIng[0] = arrIng[0].replace(' - ','+');
                    count = eval(arrIng[0].replace('-', '+'));
                    
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));

                }
                
                count = Math.round(count*1000)/1000;

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' '),
                };

            } else if (parseInt(arrIng[0], 10)) {   //unit은 없는데 요소가 숫자일때.. 
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }
            } else if (unitIndex === -1) { //unit도 없고 맨첨에 숫자도 없어.. 
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient,
                }
            }
            //console.log(objIng);

            return objIng;
        });
        this.ingredient = newIngredients;
        //console.log(this.ingredient)
        
    }

    updateServings (type) {
        const newServings = type === 'dec' ? this.numberOfServings - 1 : this.numberOfServings + 1;

        this.ingredient.forEach(ing => {
            ing.count *= (newServings/this.numberOfServings);
            ing.count = Math.round(ing.count*1000)/1000;
        });

        this.numberOfServings = newServings;
    }    
}