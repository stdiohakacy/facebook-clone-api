export interface IChair {
    create();
}

export class PlasticChair implements IChair {
    create() {
        console.log('Create plastic chair');
    }
}

export class WoodChair implements IChair {
    create() {
        console.log('Create wood chair');
    }
}
