const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true,
};

const PARAMS = {
  shapeType: 'circ',
  size: 10,
  height: 10,
  width: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.001,
  amp: 0.2,
  frame: 0,
  animate: true,
  lineCap: 'butt',
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);

    const cols = PARAMS.width;
    const rows = PARAMS.height;
    const numCells = cols * rows;
    
    const gridw = width * 0.8;
    const gridh = height * 0.8;
    const cellw = gridw / cols;
    const cellh = gridh / rows;
    const marginX = (width - gridw) * 0.5;
    const marginY = (height - gridh) * 0.5;

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cellw;
      const y = row * cellh;

      const w = cellw * 0.8;
      const h = cellh * 0.8;

      const f = PARAMS.animate ? frame : PARAMS.frame;

      // const n = random.noise2D(x + frame * 10, y, PARAMS.freq);
      const n = random.noise3D(x, y, f * 10, PARAMS.freq);
      const m = random.noise3D(x, y, f * 4, PARAMS.freq);
      const angle = n * Math.PI * PARAMS.amp;
      const scale = math.mapRange(n, -1, 1, PARAMS.scaleMin, PARAMS.scaleMax);
      const arcAngle = math.mapRange(m, -1, 1, 0, 2 * Math.PI)
      context.save();
      context.translate(x, y);
      context.translate(marginX, marginY);
      context.translate(cellw * 0.5, cellh * 0.5);
      context.rotate(angle);

      context.lineWidth = scale;
      context.lineCap = PARAMS.lineCap;
      context.beginPath();
      if (PARAMS.shapeType === 'rect') {
        context.moveTo(w * -0.5, 0);
        context.lineTo(w * 0.5, 0);
      } else if (PARAMS.shapeType === 'circ') {
        context.arc(0 , 0, scale, 2 * Math.PI, false)
        context.lineWidth = scale * 0.2
      } else if (PARAMS.shapeType === 'arc') {
        context.arc(0 , 0, scale, arcAngle, false)
        context.lineWidth = scale * 0.2
      }
      context.stroke();

      context.restore();
    }
  };
};

const createPane = () => {
  const pane = new Tweakpane.Pane();
  let folder;

  folder = pane.addFolder({ title: 'Grid' })
  folder.addInput(PARAMS, 'shapeType', { options: {rect: 'rect', circ: 'circ', arc: 'arc'}})
  folder.addInput(PARAMS, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square'}})
  // folder.addInput(PARAMS, 'size', {min: 2, max: 500, step: 1});

  folder.addInput(PARAMS, 'width', {min: 2, max: 50, step: 1});
  folder.addInput(PARAMS, 'height', {min: 2, max: 50, step: 1});
  folder.addInput(PARAMS, 'scaleMin', {min: 1, max: 99});
  folder.addInput(PARAMS, 'scaleMax', {min: 2, max: 100});

  folder = pane.addFolder({ title: 'Noise' });
  folder.addInput(PARAMS, 'freq', { min: -0.01, max: 0.01 });
  folder.addInput(PARAMS, 'amp', { min: 0, max: 1});

  folder.addInput(PARAMS, 'animate');
  folder.addInput(PARAMS, 'frame', { min: 0, max: 999});
};

createPane();
canvasSketch(sketch, settings);
