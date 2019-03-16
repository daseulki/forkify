import axios from 'axios';
import {key, appid} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }
    //X-Yummly-App-ID:app-id
    //X-Yummly-App-Key:app-key
    
    async getResults(){
        //const proxy = 'https://cors-anywhere.herokuapp.com/';
        //const key = '9cc3a8a2c0af22f7822f92e3c3e9913a';        
        try{
            //const result = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            const result = await axios(`http://api.yummly.com/v1/api/recipes?_app_id=${appid}&_app_key=${key}&q=${this.query}&maxResult=30`);
        
            this.result = result.data;
            //this.result = result.data.recipes;
            //console.log(result.data)
        
        }catch(error){
            console.error(error);
        }   
    }
}
