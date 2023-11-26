import { Injectable } from '@nestjs/common';
import { Directory, File } from '../concentrates/file.concentrate';

@Injectable()
export class DirectoryService {
    private rootDirectory: Directory = new Directory('root');

    constructor() {
        const subDirectory1 = new Directory('subdir1');
        const subDirectory2 = new Directory('subdir2');

        const file1 = new File('file-01.txt');
        const file2 = new File('file-02.txt');

        this.rootDirectory.add(subDirectory1);
        this.rootDirectory.add(subDirectory2);
        this.rootDirectory.add(file1);
        subDirectory1.add(file2);
    }

    getRootDirectory(): Directory {
        return this.rootDirectory;
    }
}
