export class Regex {
  static buildSimilar(d: string, withOptions?: string[]): RegExp {
    d = d.trim();
    let options: string[] = [];
    let regex = '^(';

    let lastOption = '';
    for (let i = 0; i < d.length; i++) {
      let copy = Array.from(d);
      lastOption += copy[i] + '+';
      copy[i] = '.';
      options.push(copy.join(''));
      copy.splice(i, 1);
      options.push(copy.join(''));
    }
    options.push(lastOption);
    if (withOptions) {
      options.push(...withOptions);
    }

    regex += options.join('|');
    regex += ')';

    return new RegExp(regex, 'igm');
  }
}
