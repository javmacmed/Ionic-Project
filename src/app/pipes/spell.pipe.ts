import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'spell'
})
export class SpellPipe implements PipeTransform {
    transform(word: string, args: any[]): string[] | boolean {
        if (word === null) {
            console.log('SpellPipe: palabra nula');
            return false;
        }
        const charactersArray: string[] = [];
        for (let i = 0; i < word.length; i++) {
            // const words = value[i].split(' ');
            charactersArray.push(word[i]);
        }
        return charactersArray;
    }
}
