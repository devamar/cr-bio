var global_comp = [];
var fps = 15;
var fps_focus = 1;
var fps_factor = 0.015;
var transition = d3.transition()

function setup() {
    //P5 Init
    noCanvas();
    frameRate(fps);
    resetSketch()
}

function resetSketch() {
    d3.select('svg').remove();

    var svg_width = 700;
    var svg_height = 700;
    var centerx = svg_width / 2;
    var centery = svg_height / 2;

    //D3 Init
    var body = d3.select('body');

    var svg = body.append('svg')
        .attr('width', svg_width)
        .attr('height', svg_height)
        .attr('id', 'main-svg');
    var blur_filter = svg.append('filter')
        .attr('id', 'blur');
    var gaussian_blur = blur_filter.append('feGaussianBlur')
        .attr('in', 'SourceGraphic')
        .attr('stdDeviation', '10');

    //Blob Noises
    var bNoise = new BlobNoise(0.2);
    var bNoiseNuclei = new BlobNoise(0.1);

    //Component Initialization
    cell_membrane = new Blob(svg, 2, 250, 250, 5, 10, centerx, centery, bNoise, '#831973', 'cell_stroke', 'Cell Membrane', true);

    cytoplasm = new Blob(svg, 2, 240, 240, 5, 10, centerx, centery, bNoise, '#331a50', 'cell', 'Cytoplasm');

    nuclear_membrane = new Blob(svg, 2, 70, 70, 0, 5, centerx, centery, bNoiseNuclei, '#c0392b', 'nucleus_stroke', 'Nuclear Membrane');
    nucleus = new Blob(svg, 2, 65, 65, 0, 5, centerx, centery, bNoiseNuclei, '#e66457', 'nucleus', 'Nucleus');

    nuclei = new Blob(svg, 2, 40, 40, 5, 5, centerx, centery + 10, bNoiseNuclei, '#f1c40f', 'nuclei', 'Nuclei');

    ribosomes = new Ribosomes(svg, 3, 1, 5, centerx + 60, centery + 140, 30, 30, '#9e71d2', 'ribo', 'Ribosomes');
    ribosomes_b = new Ribosomes(svg, 2, 1, 8, centerx - 135, centery - 10, 30, 30, '#9e71d2', 'ribo_b', 'Ribosomes');

    lysosome = new Lysosome(svg, 15, 3, centerx - 115, centery + 100, '#cb58bf', '#831973', '#7f377b', 'lysosome', 'Lysosome')
    lysosome_b = new Lysosome(svg, 8, 3, centerx - 185, centery + 20, '#cb58bf', '#831973', '#7f377b', 'lysosome_b', 'Lysosome')

    mito = new Mitochondria(svg, 60, 30, centerx - 35, centery + 160, random(360), shadeHexColor('#9e71d2', -0.3), '#9e71d2', 'mito', 'Mitochondria')
    mito_b = new Mitochondria(svg, 70, 25, centerx + 135, centery, random(360), shadeHexColor('#9e71d2', -0.3), '#9e71d2', 'mito_b', 'Mitochondria')

    smooth_er = new SmoothER(svg, 1, 8, 0.1, 3, -HALF_PI + 1, nuclear_membrane, 10, '#9e71d2', 'smooth_er', 'Smooth ER')
    rough_er = new RoughER(svg, 1, 8, 0.1, 3, HALF_PI, nuclear_membrane, 10, 2, shadeHexColor('#831973', 0.1), '#cb58bf', 'rough_er', 'Rough ER')
}


function draw() {
    cell_membrane.draw();
    cytoplasm.draw();
    nuclear_membrane.draw();
    nucleus.draw();
    nuclei.draw();
    ribosomes.draw();
    ribosomes_b.draw();
    lysosome.draw();
    lysosome_b.draw();
    mito.draw();
    mito_b.draw();
    smooth_er.draw();
    rough_er.draw();
}
