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
        this.r = r
        this.dx = dx
        this.dy = dy
        this.name = name
        this.debree = []

        var blob_cnoise = new BlobNoise(0.001)
        this.ytrans_offset = random(10)
        this.debree_noise = new BlobNoise(0.5);

        this.lysosome = container.append('g')
            .attr('id', id);

        this.membrane = new Blob(this.lysosome, 2, r * 1.2, r * 1.2, r / 5, 2, dx + r, dy + r, blob_cnoise, fill_membrane, id + '_membrane', name + ' Membrane')
        this.blob = new Blob(this.lysosome, 2, r, r, r / 5, 2, dx + r, dy + r, blob_cnoise, fill, id + '_blob', name)

        var attempts = 0;
        while ((this.debree.length <= num_debree) && (attempts < 500)) {
            attempts += 1;
            var rng_a = random()
            var rng_b = random()
            if (rng_b < rng_a) {
                var temp_rng_a = rng_a
                rng_a = rng_b
                rng_b = temp_rng_a
            }
            var new_rad = random(r / 9, r / 6)
            var new_dx = rng_b * (r - new_rad * 1.5) * cos(TWO_PI * rng_a / rng_b) + dx + r
            var new_dy = rng_b * (r - new_rad * 1.5) * sin(TWO_PI * rng_a / rng_b) + dy + r
            var no_overlap = true
            for (var i = 0; i < this.debree.length; i++) {
                var d = sq(this.debree[i].dx - new_dx) + sq(this.debree[i].dy - new_dy)
                if (d - 20 < sq(this.debree[i].r + new_rad) || d > 100) {
                    no_overlap = false
                }
            }
            if (no_overlap) {
                this.debree.push(new Ribosome(this.lysosome, new_rad, new_dx, new_dy, fill_debree, id + 'debree', id + 'debree' + this.debree.length, 'Protiens/Enzymes'))
            }
        }

        global_comp.push(this)
    }
    draw() {
        this.blob.draw()
        this.membrane.draw()
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].translate(map(noise(frameCount * .01), 0, 1, -5, 5), map(noise(frameCount * .01 + this.ytrans_offset), 0, 1, -5, 5));
        }
        var xtrans = map(noise(frameCount * .01), 0, 1, -5, 5)
        var ytrans = map(noise(frameCount * .01 + this.ytrans_offset), 0, 1, -5, 5)
        this.translate(xtrans, ytrans);
    }
    setTransition(amount) {
        this.transition = amount;
    }
    shadeColor(amount) {

    }
    revertColor() {

    }
    translate(x, y) {
        if (this.transition > 0) {
            this.lysosome.transition()
                .duration(this.transition * 1000)
                .attr('transform', 'translate(' + x + ', ' + y + ')')
        } else {
            this.lysosome.attr('transform', 'translate(' + x + ', ' + y + ')')
        }
    }
}
