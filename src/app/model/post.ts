
export class Post {

    constructor(private content :string ,  
        private audienceCriteria:{age: { min: Number, max: Number }}, 
         private targetFollowers:any[],
          private notifyFollowers :boolean,
          private imageLink: string){};
          
    }

