class UtilityFunctions {
  public getRandomID(prefix: string='', suffix: string=''): string {
    // returns a random hex string with up to 8 hex digits
    return `${prefix}${Math.floor(Math.random() * 1000000000).toString(16)}${suffix}`;
  }

  public getValidDOMSelector(selector: string) {
    const noSpaces = selector.replace(/\s/g, '_');
    const noLeadingNumbers = noSpaces.replace(/\b[0-9]/, '_');
    return noLeadingNumbers;
  }
}

const instance = new UtilityFunctions();

export default instance;
