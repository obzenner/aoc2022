import { readFileSync } from 'fs';
import path from 'path';

export default async function loadFile(fileName: string) {    
    const p = path.join(__dirname, '..', `inputs/${fileName}`);
    return readFileSync(p, 'utf-8');
}