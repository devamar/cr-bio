/**
 * Creates an SVG componenet which displaces similar to a 'blob' of liquid.
 * @param {D3Object} container - SVG Container of the blob.
 * @param {int} r - Radius of the lysosome.
 * @param {int} num_debree - Number of Protiens/Enzymes in the lysosome.
 * @param {int} dx - Horizontal displacement from position (0,0) of the lysosome.
 * @param {int} dy - Vertical displacement from position (0,0) of the lysosome.
 * @param {String} fill - Fill of the lysosome, ie. '#c0392b' (Hex Recommended).
 * @param {String} fill_membrane - Fill of the lysosome mebrane, ie. '#c0392b' (Hex Recommended).
 * @param {String} fill_debree - Fill of the lysosome debree, ie. '#c0392b' (Hex Recommended).
 * @param {String} id - HTML id of the blob, ie. 'lysosome'.
 * @param {String} name - Name of the blob, ie. 'Lysosome'.
 */
class Lysosome {
    constructor(container, r, num_debree, dx, dy, fill, fill_membrane, fill_debree, id, name) {
        this.r = r;
        this.pos = createVector(dx, dy);
        this.offset = createVector(0, 0);
        this.rng = createVector(random(5), random(5));
        this.name = name;
        this.id = id;
        this.debree = [];
        this.num_debree = num_debree;
        this.fill = fill;
        this.fill_membrane = fill_membrane;
        this.fill_debree = fill_debree;

        this.ytrans_offset = random(10)
        this.debree_noise = new BlobNoise(0.5);
        this.container = container;
        this.lysosome;
        this.membrane;
        this.blob;
    }

    translate(x, y) {
        this.offset.x = x;
        this.offset.y = y;
        this.blob.translate(x, y);
        this.membrane.translate(x, y);
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].translate(x, y);
        }
    }
    setupDraw() {
        this.lysosome = this.container.append('g')
            .attr('id', this.id);

        var blob_cnoise = new BlobNoise(0.001)
        this.membrane = new Blob(this.lysosome, 2, this.r * 1.2, this.r * 1.2, this.r / 5, 2, this.pos.x + this.r, this.pos.y + this.r, blob_cnoise, this.fill_membrane, this.id + '_membrane', this.name + ' Membrane')
        this.blob = new Blob(this.lysosome, 2, this.r, this.r, this.r / 5, 2, this.pos.x + this.r, this.pos.y + this.r, blob_cnoise, this.fill, this.id + '_blob', this.name)

        var attempts = 0;
        while ((this.debree.length <= this.num_debree) && (attempts < 500)) {
            attempts += 1;
            var rng_a = random()
            var rng_b = random()
            if (rng_b < rng_a) {
                var temp_rng_a = rng_a
                rng_a = rng_b
                rng_b = temp_rng_a
            }
            var new_rad = random(this.r / 9, this.r / 6)
            var new_dx = rng_b * (this.r - new_rad * 1.5) * cos(TWO_PI * rng_a / rng_b) + this.pos.x + this.r
            var new_dy = rng_b * (this.r - new_rad * 1.5) * sin(TWO_PI * rng_a / rng_b) + this.pos.y + this.r
            var no_overlap = true
            for (var i = 0; i < this.debree.length; i++) {
                var d = sq(this.debree[i].dx - new_dx) + sq(this.debree[i].dy - new_dy)
                if (d - 20 < sq(this.debree[i].r + new_rad) || d > 100) {
                    no_overlap = false
                }
            }
            if (no_overlap) {
                var new_ribo = new Ribosome(this.lysosome, new_rad, new_dx, new_dy, this.fill_debree, this.id + 'debree', this.id + 'debree' + this.debree.length, 'Protiens/Enzymes')
                this.debree.push(new_ribo)
            }
        }
    }
    draw() {
        if (!(this.lysosome && this.membrane && this.blob)) {
            this.setupDraw();
        }
        this.membrane.draw()
        this.blob.draw()
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].draw();
        }
        var xtrans = map(noise(frameCount * fps_factor + this.rng.x), 0, 1, -10, 10)
        var ytrans = map(noise(frameCount * fps_factor + this.rng.y), 0, 1, -10, 10)
        this.translate(xtrans, ytrans);
    }
    setTransition(amount) {
        this.blob.setTransition(amount);
        this.membrane.setTransition(amount);
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].setTransition(amount);
        }
    }
    shadeColor(amount) {
        this.blob.shadeColor(amount);
        this.membrane.shadeColor(amount);
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].shadeColor(amount);
        }
    }
    revertColor() {
        this.blob.revertColor();
        this.membrane.revertColor();
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].revertColor();
        }
    }
    focus(e) {
        frameRate(fps_focus)
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.pos.x + this.offset.x, this.pos.y + this.offset.y], [e.pageX, e.pageY], this.name)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(1)
            if (global_comp[i] != this)
                global_comp[i].shadeColor(0.5)
        }
    }
    unFocus() {
        frameRate(fps)
        var svg = d3.select('#main-svg');
        toolTipRemove(svg)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(0)
            if (global_comp[i] != this)
                global_comp[i].revertColor()
        }
    }
    click() {
        for (var i = 0; i < global_comp.length; i++) {
            if (global_comp[i] != this)
                global_comp[i].exit();
        }
    }
    removeFromGlobalComponents() {
        global_comp.splice(global_comp.indexOf(this), 1)
    }
    exit(dur, delay) {
        this.lysosome.transition().remove().delay(delay).duration(dur).style('opacity', 0)
        this.removeFromGlobalComponents()
    }
}
