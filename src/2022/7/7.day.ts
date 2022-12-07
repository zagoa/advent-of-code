import {parseListString} from "../../utils/parse-input";
import {Dir, readFileSync} from "fs";

class FileInfo {
    size: number;
    name: string;

    constructor(name: string, size: number) {
        this.size = size;
        this.name = name;
    }
}

class DirectoryInfo {
    name: string;
    path: string;
    dirs: Array<string> = new Array<string>();
    size: number;
    files: Array<FileInfo> = new Array<FileInfo>();
    totalSize: number;

    constructor(name?: string) {
        this.name = name;
    }
}

export default class Day7 {

    constructor() {
        this.total_size_of_those_directories();
        this.find_directory_to_delete();
    }

    total_size_of_those_directories() {
        const mapOfDirectory = this.generateMapOfDirectory()
        this.computeTotalSizeOfDirectories(mapOfDirectory);
        // console.log('Map of directory', mapOfDirectory)
        console.log('DAY 7 => total size of directories under 100000', this.computeGlobalSizeUnder(mapOfDirectory, 100000));
    }

    /**
     * The total disk space available to the filesystem is 70000000. To run the update, you need unused space of at least 30000000. You need to find a directory you can delete that will free up enough space to run the update.
     *
     * In the example above, the total size of the outermost directory (and thus the total amount of used space) is 48381165; this means that the size of the unused space must currently be 21618835, which isn't quite the 30000000 required by the update. Therefore, the update still requires a directory with total size of at least 8381165 to be deleted before it can run.
     *
     * To achieve this, you have the following options:
     *
     * Delete directory e, which would increase unused space by 584.
     * Delete directory a, which would increase unused space by 94853.
     * Delete directory d, which would increase unused space by 24933642.
     * Delete directory /, which would increase unused space by 48381165.
     * Directories e and a are both too small; deleting them would not free up enough space. However, directories d and / are both big enough! Between these, choose the smallest: d, increasing unused space by 24933642.
     *
     * Find the smallest directory that, if deleted, would free up enough space on the filesystem to run the update. What is the total size of that directory?
     */
    find_directory_to_delete() {
        const DISK_SPACE = 70000000;
        const SPACE_TO_FREE = 30000000;

        const mapOfDirectory = this.generateMapOfDirectory()
        this.computeTotalSizeOfDirectories(mapOfDirectory);
        let diskValue = 0;
        mapOfDirectory.forEach(value => {
            diskValue += value.size;
        });
        const spaceToFree = SPACE_TO_FREE - (DISK_SPACE - diskValue);
        console.log(`DAY 7 => to free ${spaceToFree} you need to delete`, this.getMinFolderToFreeEnoughSpace(spaceToFree, mapOfDirectory).totalSize);
    }

    private generateMapOfDirectory() {
        const data = parseListString(__dirname + '/DAY_7_INPUTS');
        const directoryMap = new Map<string, DirectoryInfo>()
        let currentDir = new DirectoryInfo();
        let currentPath = '';

        for (let item of data) {
            const lineSplit = item.split(' ');
            if (item.startsWith('$')) {
                if (lineSplit[1] === 'cd') {
                    if (lineSplit[2].includes('..')) {
                        currentPath = this.getPreviousPath(currentPath);
                        currentDir = directoryMap.get(currentPath);
                    } else {
                        const newDir = new DirectoryInfo();
                        newDir.name = lineSplit[2];
                        currentPath = this.buildNewPath(currentPath, newDir.name)
                        newDir.path = currentPath;


                        currentDir = newDir;
                        directoryMap.set(currentPath, currentDir);
                    }
                }
            } else if (item.startsWith('dir')) {
                currentDir.dirs.push(lineSplit[1]);
            } else {
                currentDir.files.push(new FileInfo(lineSplit[1], parseInt(lineSplit[0])));
            }
            currentDir.size = this.computeSizeOfCurrentDirectory(currentDir);
        }
        return directoryMap;
    }

    private computeSizeOfCurrentDirectory(directory: DirectoryInfo): number {
        return directory.files.reduce((total, file) => total + file.size, 0);
    }

    private computeTotalSizeOfDirectories(mapOfDirectory: Map<string, DirectoryInfo>) {
        mapOfDirectory.forEach((directory, key) => {
            directory.totalSize = this.recursivelyComputeSize(directory, mapOfDirectory);
        })
    }

    private recursivelyComputeSize(directoryInfo: DirectoryInfo, mapOfDirectory: Map<string, DirectoryInfo>, previousSize: number = 0): number {
        previousSize += directoryInfo.size;
        directoryInfo.dirs.forEach((dir) => {
            if (mapOfDirectory.has(this.buildNewPath(directoryInfo.path, dir))) {
                const directory = mapOfDirectory.get(this.buildNewPath(directoryInfo.path, dir));
                previousSize = this.recursivelyComputeSize(directory, mapOfDirectory, previousSize)
            }
        })
        return previousSize;
    }

    private computeGlobalSizeUnder(mapOfDirectory: Map<string, DirectoryInfo>, limit: number) {
        let globalSize = 0;
        mapOfDirectory.forEach((value) => {
            if (value.totalSize <= limit) {
                globalSize += value.totalSize;
            }
        })
        return globalSize;
    }

    private getMinFolderToFreeEnoughSpace(spaceToFree: number, mapOfDirectory: Map<string, DirectoryInfo>): DirectoryInfo {
        let bestCandidate = new DirectoryInfo();
        mapOfDirectory.forEach((value) => {
            if (value.totalSize >= spaceToFree && (!bestCandidate.totalSize || value.totalSize < bestCandidate.totalSize)) {
                bestCandidate = value;
            }
        })
        return bestCandidate;
    }

    private getPreviousPath(path: string) {
        const splitPath = path.split('/');
        return '/' + splitPath.filter(value => !!value).slice(0, splitPath.length - 2).join('/');
    }

    private buildNewPath(currentPath: string, newDirName: string) {
        if (currentPath) {
            if (currentPath.length > 1) {
                return currentPath + '/' + newDirName;

            } else {
                return currentPath + newDirName;

            }
        } else {
            return newDirName;
        }
    }
}
