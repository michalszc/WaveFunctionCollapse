import p5 from "p5";

class Cell {
    public x: number;
    public y: number;
    public patterns: number[]; // possible patterns of the tile
    public isCollapsed: boolean; // whether the tile has been collapsed
    public value: number | null; // the pattern that has been collapsed to, or null if not yet collapsed
  
    constructor(patterns: number[], x: number, y: number) {
        this.x = x;
        this.y = y;
        this.patterns = patterns.slice();
        this.isCollapsed = false;
        this.value = null;
    }
  
    // collapse the tile to a random pattern
    public collapse(p: p5): boolean {
        this.value = p.random(this.patterns);
        if (this.value === undefined) {
            return false;
        }
        this.patterns = [this.value!];
        this.isCollapsed = true;

        return true;
    }
}

export default Cell;
