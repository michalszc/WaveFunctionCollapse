import p5 from "p5";
import { Model } from "./model";

const sampleSelect = document.getElementById('sample') as HTMLSelectElement;
const dimensionInput = document.getElementById('dimension') as HTMLInputElement;
const redrawButton = document.getElementById('redraw') as HTMLButtonElement;

const sketch = (p: p5) => {
    const model = new Model(dimensionInput.valueAsNumber, sampleSelect.value);

    p.preload = () => {
        model.preload(p);
    };

    p.setup = () => {
        p.createCanvas(400, 400);
        model.setup(p);
    };

    p.draw = () => {
        model.draw(p);
    };
};

let instance: p5;

window.onload = () => instance = new p5(sketch);

const redraw = () => {
    instance.remove();
    instance = new p5(sketch);
}

sampleSelect.addEventListener('change', redraw);
dimensionInput.addEventListener('change', redraw);
redrawButton.addEventListener('click', redraw);
