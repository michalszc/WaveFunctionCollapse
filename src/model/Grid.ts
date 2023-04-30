import p5 from "p5";
import { Cell, Tile } from ".";

class Grid {
    private width: number;
    private height: number;
    private tiles: Tile[];
    private calcEntropy: (neighbors: Cell[]) => void;
    public cells: Cell[][]; // 2D array of cells

    constructor(tiles: Tile[], width: number, height: number) {
      this.tiles = tiles;
      this.calcEntropy = this.calculateEntropy.bind(this, tiles);
      this.width = width;
      this.height = height;
      this.cells = new Array(this.height);
      for (let y = 0; y < this.height; y++) {
        this.cells[y] = new Array(this.width);
      }
    }

    public initialize() {
      const patterns = new Array(this.tiles.length).fill(0).map((x, i) => i);
      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          this.cells[y][x] = new Cell(patterns, x, y);
        }
      }
    }

    // check if the grid is fully collapsed
    public isCollapsed(): boolean {
      for (const row of this.cells) {
        for (const cell of row) {
          if (!cell.isCollapsed) {
            return false;
          }
        }
      }

      return true;
    }
    
    // perform the wave function collapse algorithm
    public collapse(p: p5) {
      if (!this.isCollapsed()) {
        // Pick a cell with least entropy
        const minCount = Math.min(
            ...this.cells
            .flat()
            .filter(v => !v.isCollapsed)
            .map(v => v.patterns.length)
        );
        const minCells = [...this.cells]
          .flat()
          .filter(v => !v.isCollapsed && v.patterns.length === minCount); 
        const minCell = p.random(minCells);

        if (minCell === null || minCell === undefined) {
          // there is no cell that can be collapsed, so the algorithm has failed
          throw new Error("Wave function collapse failed");
        }
        
        // collapse the cell to a random pattern
        if (!minCell.collapse(p)) {
          this.initialize();
        }

        this.calcEntropy(this.getNeighbors(minCell.x, minCell.y));
      } else {
        p.noLoop();
      }
    }

    // get a list of all neighboring tiles of a given tile
    private getNeighbors(x: number, y: number): Cell[] {
      const neighbors: Cell[] = [];
      if (x > 0) {
        neighbors.push(this.cells[y][x - 1]);
      }
      if (x < this.cells[0].length - 1) {
        neighbors.push(this.cells[y][x + 1]);
      }
      if (y > 0) {
        neighbors.push(this.cells[y - 1][x]);
      }
      if (y < this.cells.length - 1) {
        neighbors.push(this.cells[y + 1][x]);
      }
      return neighbors;
    }

    private calculateEntropy(tiles: Tile[], neighbors: Cell[]) {
      const cells = [...this.cells].map(arr => arr.slice()); 
      for (const neighbor of neighbors) {
        const {x, y} = neighbor;
        if (!cells[y][x].isCollapsed) {
          let patterns = new Array(tiles.length).fill(0).map((x, i) => i);
          
          // Look up
          if (y > 0) {
            const up = cells[y-1][x];
            const validPatterns = up.patterns.map(pattern => tiles[pattern].down).flat();
            patterns = patterns.filter(pattern => validPatterns.includes(pattern));
          }

          // Look right
          if (x < this.width - 1) {
            const right = cells[y][x+1];
            const validPatterns = right.patterns.map(pattern => tiles[pattern].left).flat();
            patterns = patterns.filter(pattern => validPatterns.includes(pattern));
          }

          // Look down
          if (y < this.height - 1) {
            const down = cells[y+1][x];
            const validPatterns = down.patterns.map(pattern => tiles[pattern].up).flat();
            patterns = patterns.filter(pattern => validPatterns.includes(pattern));
          }

          // Look left
          if (x > 0) {
            const left = cells[y][x-1];
            const validPatterns = left.patterns.map(pattern => tiles[pattern].right).flat();
            patterns = patterns.filter(pattern => validPatterns.includes(pattern));
          }

          this.cells[y][x].patterns = patterns.slice();
        }
      }
    }
}

export default Grid;
