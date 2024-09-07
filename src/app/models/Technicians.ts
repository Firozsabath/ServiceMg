export class Technicians{ 
    public id:number;   
    public name:any;
    public position:any;
    public email:any;
    public imgUrl:any;
    public createdTime?:Date;
    public updateTime?:Date;
    constructor(
        id:number,
        name:any,
        position:any,
        email:any,
        imgUrl:any,       
        createdTime?:Date,
        updateTime?:Date,        
    ){}
}

