import { FileSystemNode } from '../interfaces/file-system-node.interface';

export class File implements FileSystemNode {
    constructor(private name: string) {}

    getName(): string {
        return this.name;
    }
}

export class Directory implements FileSystemNode {
    private readonly children: FileSystemNode[] = [];

    constructor(private readonly name: string) {}

    getName(): string {
        return this.name;
    }

    add(node: FileSystemNode): void {
        this.children.push(node);
    }

    remove(node: FileSystemNode): void {
        const index = this.children.indexOf(node);
        if (index > -1) {
            this.children.splice(index, 1);
        }
    }

    getChildren(): FileSystemNode[] {
        return this.children;
    }
}
