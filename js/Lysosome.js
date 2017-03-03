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

        var blob_cnoise = new CircularNoise(0.001)
        this.trans_cnoise = new CircularNoise(1)
        this.debree_noise = new CircularNoise(0.5);

        this.lysosome = container.append('g')
            .attr('id', id);

        this.membrane = new Blob(this.lysosome, 2, r * 1.2, r * 1.2, r / 5, 2, dx + r, dy + r, blob_cnoise, fill_membrane, id + '_membrane', name + ' Membrane')
        this.blob = new Blob(this.lysosome, 2, r, r, r / 5, 2, dx + r, dy + r, blob_cnoise, fill, id + '_blob', name)

        var attempts = 0;
        while ((this.debree.length <= num_debree) && (attempts < 500)) {
            attempts += 1;
            var rng_a = Math.random()
            var rng_b = Math.random()
            if (rng_b < rng_a) {
                var temp_rng_a = rng_a
                rng_a = rng_b
                rng_b = temp_rng_a
            }
            var new_rad = map(Math.random(), 0, 1, r / 9, r / 6)
            var new_dx = rng_b * (r - new_rad * 1.5) * cos(2 * Math.PI * rng_a / rng_b) + dx + r
            var new_dy = rng_b * (r - new_rad * 1.5) * sin(2 * Math.PI * rng_a / rng_b) + dy + r
            var no_overlap = true
            for (var i = 0; i < this.debree.length; i++) {
                var d = Math.pow(this.debree[i].dx - new_dx, 2) + Math.pow(this.debree[i].dy - new_dy, 2)
                if (d - 20 < Math.pow(this.debree[i].r + new_rad, 2) || d > 100) {
                    no_overlap = false
                }
            }
            if (no_overlap) {
                this.debree.push(new Ribosome(this.lysosome, new_rad, new_dx, new_dy, fill_debree, id + 'debree', id + 'debree' + this.debree.length, 'Protiens/Enzymes'))
            }
        }
        var lysosome = this;
    }
    draw() {
        this.blob.draw()
        this.membrane.draw()
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].translate(map(this.debree_noise.getNoise(frameCount * .01 * j), 0, 1, -5, 5), map(this.debree_noise.getNoise(frameCount * .01 * (this.debree.length - j)), 0, 1, -5, 5));
        }
        var xtrans = map(this.trans_cnoise.getNoise(frameCount * .01), 0, 1, -5, 5)
        var ytrans = map(this.trans_cnoise.getNoise(frameCount * .01), 0, 1, -5, 5)
        this.translate(xtrans, ytrans);
    }
    translate(x, y) {
      this.lysosome.attr('transform', 'translate(' + x +', ' + y + ')')
    }
}
