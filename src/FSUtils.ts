import * as mkdirp from 'mkdirp';
import * as fs from 'mz/fs';
import * as path from 'path';

export class FSUtils {
    static mkdirp(dir: string): Promise<undefined> {
        return new Promise((res, rej) => {
            mkdirp(dir, err => {
                if (err) {
                    rej(err);
                } else {
                    res();
                }
            })
        });
    }

    static readDirs = (location: string) => {
        return fs.readdir(location)
            .then(files => Promise.all(files.map(file => fs.stat(path.resolve(location, file)).then(stat => ({ file, stat }))))
                .then(files => files.filter(f => f.stat.isDirectory()).map(f => f.file)));
    }

    static readAllNodeDirs = (location: string): Promise<string []> => {
        return FSUtils.readDirectoriesRecursive(location, location);
    }

    static readDirectoriesRecursive = (folder: string, root: string = '') => {
        return Promise.all([FSUtils.isFileExists(path.join(folder, 'package.json')), FSUtils.readSubDirectoriesRecursive(folder)]).then(results => (
            results[1].concat((results[0] && folder !== root) ? [folder] : [])
        ));
    }

    static readSubDirectoriesRecursive = (folder: string): Promise<string []> => {
        return FSUtils.subFolders(folder).then((subFolders: string[]) => (
            Promise.all(subFolders.map(subFolder => FSUtils.readDirectoriesRecursive(subFolder))).then(subDirectories => (
                [].concat.apply([], subDirectories)
            ))
        ))
    }

    static subFolders = (folder: string): Promise<string[]> => {
        return fs.readdir(folder).then(subFolders => (
            Promise.all(subFolders.map(subFolder => fs.stat(path.resolve(folder, subFolder)).then(stat => ({name: subFolder, stat})))).then(subFolders => (
                subFolders.filter(subFolder => subFolder.stat.isDirectory() && subFolder.name !== 'node_modules' && !(/^\./.test(subFolder.name)))
                .map(subFolder => path.join(folder, subFolder.name))
            ))
        ))
    }

    static isFileExists = (filePath: string): Promise<boolean> => {
        return new Promise((reslove) => {
            fs.access(filePath, fs.constants.F_OK, error => {
                reslove(!error);
            })
        })
    }
};