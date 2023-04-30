import p5 from "p5";

class Tile {
    public img: p5.Image | p5.Graphics;
    public edges: string[];
    public up: number[]; // indices of tiles
    public right: number[]; // indices of tiles
    public down: number[]; // indices of tiles
    public left: number[]; // indices of tiles

    constructor(img: p5.Image | p5.Graphics, edges: string[]) {
      // Image
      this.img = img;
      // Edges
      this.edges = edges;
      // Valid neighbors
      this.up = [];
      this.right = [];
      this.down = [];
      this.left = [];
    }
    
    private static compareEdge(edge1: string, edge2: string): boolean {
        return edge1 === edge2.split('').reverse().join('');
    }

    // Find the valid neighbors
    analyze(tiles: Tile[]) {
      for (let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        // UP
        if (Tile.compareEdge(tile.edges[2], this.edges[0])) {
          this.up.push(i);
        }
        // RIGHT
        if (Tile.compareEdge(tile.edges[3], this.edges[1])) {
          this.right.push(i);
        }
        // DOWN
        if (Tile.compareEdge(tile.edges[0], this.edges[2])) {
          this.down.push(i);
        }
        // LEFT
        if (Tile.compareEdge(tile.edges[1], this.edges[3])) {
          this.left.push(i);
        }
      }
    }
    
    // Rotate a tile and its edges to create a new one
    rotate(p: p5, side: number) {
      // Draw new tile
      const w = this.img.width;
      const h = this.img.height;
      const newImg = p.createGraphics(w, h);
      newImg.imageMode(p.CENTER);
      newImg.translate(w / 2, h / 2);
      newImg.rotate(p.HALF_PI * side);
      newImg.image(this.img, 0, 0);
      
      // Rotate edges
      const newEdges = [];
      const len = this.edges.length;
      for (let i = 0; i < len; i++) {
        newEdges[i] = this.edges[(i - side + len) % len];
      }
      return new Tile(newImg, newEdges);
    }
}

export default Tile;
