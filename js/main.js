var global_comp = [];

function setup() {
    //P5 Init
    noCanvas();
    frameRate(30);
    /*
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        noLoop()
    }
    */
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

    //Circular Noises
    var cNoise = new CircularNoise(0.2);
    var cNoiseNuclei = new CircularNoise(0.1);

    //Component Initialization
    cell_membrane = new Blob(svg, 2, 250, 250, 5, 10, centerx, centery, cNoise, '#831973', 'cell_stroke', 'Cell Membrane', true);

    cytoplasm = new Blob(svg, 2, 240, 240, 5, 10, centerx, centery, cNoise, '#331a50', 'cell', 'Cytoplasm');

    nuclear_membrane = new Blob(svg, 2, 70, 70, 0, 5, centerx, centery, cNoiseNuclei, '#c0392b', 'nucleus_stroke', 'Nuclear Membrane');
    nucleus = new Blob(svg, 2, 65, 65, 0, 5, centerx, centery, cNoiseNuclei, '#e66457', 'nucleus', 'Nucleus');

    nuclei = new Blob(svg, 2, 40, 40, 5, 5, centerx, centery + 10, cNoiseNuclei, '#f1c40f', 'nuclei', 'Nuclei');

    ribosomes = new Ribosomes(svg, 2, 1, 5, centerx + 60, centery + 140, 30, 30, '#9e71d2', 'ribo', 'Ribosomes');
    ribosomes_b = new Ribosomes(svg, 1, 1, 8, centerx - 135, centery - 10, 30, 30, '#9e71d2', 'ribo_b', 'Ribosomes');

    lysosome = new Lysosome(svg, 15, 3, centerx - 115, centery + 100, '#cb58bf', '#831973', '#7f377b', 'lysosome', 'Lysosome')
    lysosome_b = new Lysosome(svg, 8, 3, centerx - 185, centery + 20, '#cb58bf', '#831973', '#7f377b', 'lysosome_b', 'Lysosome')

    mito = new Mitochondria(svg, 60, 30, centerx - 35, centery + 160, random(360), shadeHexColor('#9e71d2', -0.3), '#9e71d2',  'mito', 'Mitochondria')
    mito_b = new Mitochondria(svg, 70, 25, centerx + 135, centery, random(360), shadeHexColor('#9e71d2', -0.3), '#9e71d2',  'mito_b', 'Mitochondria')
}

function draw() {
    cell_membrane.draw();
    cytoplasm.draw();
    nuclear_membrane.draw();
    nucleus.draw();
    nuclei.draw();
    ribosomes.draw();
    lysosome.draw();
    lysosome_b.draw();
    mito.draw();
    mito_b.draw();
}
