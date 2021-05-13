export class EventModel {

    constructor(public id: string,
                public name: string,
                public startingDate: Date,
                public endingDate: Date,
                public location: string,
                public description: string,
                public imageUrl: string,
                public category: string,
                public moreDetails: string,
                public valid: boolean,
                public userId: string){

    }
}
