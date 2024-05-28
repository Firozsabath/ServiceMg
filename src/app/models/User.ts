export class User{
    public id: string;
    public email :string;
    public username :string;
    public role :string;
    public password :string;
    /**
     *
     */
    constructor(init? : Partial<User>) {
        Object.assign(this,init);
    }
}