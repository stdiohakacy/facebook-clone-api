export class ITable {
    create() {}
}

export class PlasticTable implements ITable {
    create() {
        console.log('Create plastic table');
    }
}

export class WoodTable implements ITable {
    create() {
        console.log('Create wood table');
    }
}
