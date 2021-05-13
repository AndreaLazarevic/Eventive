export class UserProfile {

    constructor(public id: string,
                public firstName: string,
                public lastName: string,
                public role: string,
                public notifications: boolean,
                public interestedIn?: any,
                public savedEvents?: any,
    ){

    }
}

/*export interface UserProfile {
    firstName: string;
    lastName: string;
    role: string;
    notifications: boolean;
    interestedIn?: string;
}*/
