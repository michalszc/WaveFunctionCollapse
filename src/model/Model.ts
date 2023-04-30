import p5 from "p5";
import { Grid, Tile } from ".";

class Model {
    private dimension: number;
    private tiles: Tile[];
    private tile: string;
    private grid: Grid;

    constructor(dimension: number, tile: string) {
        this.dimension = dimension;
        this.tiles = [];
        this.tile = tile;
        this.grid = new Grid(this.tiles, dimension, dimension);
    }

    private gotConfig(p: p5, tile: string, data: object) {
        for(const [img, edges] of Object.entries(data)) {
            this.tiles.push(
                new Tile(p.loadImage(`${tile}/${img}.png`), edges)
            );
        }
    }

    public preload(p: p5) {
        p.loadJSON(`${this.tile}/config.json`, this.gotConfig.bind(this, p, this.tile));
    }

    public setup(p: p5) {
        // Rotate tiles
        const len = this.tiles.length;
        for (let i = 0; i < len; i++) {
            for (let j = 1; j < 4; j++) {
                const tile = this.tiles[i].rotate(p, j);
                if (tile !== null) {
                    this.tiles.push(tile);
                }
            }
        }

        // Generate the adjacency rules based on edges
        for (const tile of this.tiles) {
            tile.analyze(this.tiles);
        }

        this.grid.initialize();
    }

    public draw(p: p5) {
        p.background(0);
        this.grid.collapse(p);

        // Draw the grid
        const w = p.width / this.dimension;
        const h = p.height / this.dimension;
        for (let y = 0; y < this.dimension; y++) {
            for (let x = 0; x < this.dimension; x++) {
                const cell = this.grid.cells[y][x];
                if (cell.isCollapsed) {
                    p.image(this.tiles[cell.value!].img, x * w, y * h, w, h);
                } else {
                    p.fill(0);
                    p.stroke(100);
                    p.rect(x * w, y * h, w, h);
                }
            }   
        }
    }
}

export default Model;
