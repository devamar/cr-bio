var global_comp = []

function setup() {
  //P5 Init
  noCanvas();
  frameRate(30);
  var svg_width = 600
  var svg_height = 600
  var centerx = 250
  var centery = 250

  //D3 Init
  var container = d3.select('body');
  var svg = container.append('svg')
    .attr('width', svg_width)
    .attr('height', svg_height)
    .attr('id', 'main-svg')

  //Circular Noise
  cNoise = new CircularNoise(0.2);
  cNoiseNuclei = new CircularNoise(0.1);


  //Initialization
  cell_membrane = new Blob(svg, 2, 200, 200, 5, 10, centerx, centery, cNoise, '#831973', 'cell_stroke', 'Cell Membrane');
  cytoplasm = new Blob(svg, 2, 190, 190, 5, 10, centerx, centery, cNoise, '#331a50', 'cell', 'Cytoplasm');

  nuclear_membrane = new Blob(svg, 2, 70, 70, 0, 5, centerx, centery, cNoiseNuclei, '#c0392b', 'nucleus_stroke', 'Nuclear Membrane');
  nucleus = new Blob(svg, 2, 65, 65, 0, 5, centerx, centery, cNoiseNuclei, '#e66457', 'nucleus', 'Nucleus');

  nuclei = new Blob(svg, 2, 40, 40, 5, 5, centerx, centery + 10, cNoiseNuclei, '#f1c40f', 'nuclei', 'Nuclei');

  ribosomes = new Ribosomes(svg, 1, 3, 5, centerx + 50, centery + 90, 30, 30, '#9e71d2', 'ribo', 'Ribosomes');

  //smooth_er = new ER(svg, .8, 2, 3, 7, 2, 4, nuclear_membrane, 10, '#fff', 'smooth_er', 'Smooth ER')
}

function draw() {
  cell_membrane.draw();
  cytoplasm.draw();
  nuclear_membrane.draw();
  nucleus.draw();
  nuclei.draw();
  ribosomes.draw();
}
