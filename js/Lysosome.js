/**
 * Creates an SVG componenet which displaces similar to a 'blob' of liquid.
 * @param {D3Object} container - SVG Container of the blob.
 * @param {int} power - The exponent n in: (x-dx)^n + (y-dy)^n = r^n.
 * @param {int} width - Base width of the blob.
 * @param {int} height - Base height of the blob.
 * @param {int} variance - Variance in base width and base height of the blob.
 * @param {int} frequency - Frequency of the displacement of the blob.
 * @param {int} dx - Horizontal displacement from position (0,0) of the blob.
 * @param {int} dy - Vertical displacement from position (0,0) of the blob.
 * @param {CircularNoise} noise - Noise used to displace the blob.
 * @param {String} fill - Fill of the blob, ie. '#c0392b' (Hex Recommended).
 * @param {String} id - HTML id of the blob, ie. 'cell_membrane'.
 * @param {String} name - Name of the blob, ie. 'Cell Membrane'
 */
class Lysosome {
    constructor(container, r, num_debree, dx, dy, fill, fill_membrane, fill_debree, id, name) {
        this.debree = []
        var blob_cnoise = new CircularNoise(0.001)
        this.blob = new Blob(container, 2, r*1.2, r*1.2, r / 5, 2, dx + r, dy + r, blob_cnoise, fill_membrane, id + '_membrane', name + ' Membrane')
        this.membrane = new Blob(container, 2, r, r, r / 5, 2, dx + r, dy + r, blob_cnoise, fill, id, name)
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
          var new_rad = map(Math.random(), 0,1, r/9, r/6)
          var new_dx = rng_b*(r-new_rad*1.5)*cos(2*Math.PI*rng_a/rng_b) + dx + r
          var new_dy = rng_b*(r-new_rad*1.5)*sin(2*Math.PI*rng_a/rng_b) + dy + r
          var no_overlap = true
          for (var i = 0; i < this.debree.length; i++) {
              var d = Math.pow(this.debree[i].dx - new_dx, 2) + Math.pow(this.debree[i].dy - new_dy, 2)
              if (d - 20 < Math.pow(this.debree[i].r + new_rad, 2) || d > 100) {
                  no_overlap = false
              }
          }
          if (no_overlap) {
              this.debree.push(new Ribosome(container, new_rad, new_dx, new_dy, fill_debree, id + 'debree', id + 'debree' + this.debree.length, 'Protiens/Enzymes'))
          }
        }
        this.name = name
        this.dx = dx
        this.dy = dy
        this.r = r
        this.debree_noise = new CircularNoise(0.5);
        var lysosome = this;
        $('#' + id).mouseover(function(e) {
                //lysosome.focus(e);
            })
            .mouseout(function(e) {
                //lysosome.unFocus(e);
            });
    }
    draw() {
        this.blob.draw()
        this.membrane.draw()
        for (var j = 0; j < this.debree.length; j++) {
            this.debree[j].translate(map(this.debree_noise.getNoise(frameCount * .01 * j), 0, 1, -5, 5), map(this.debree_noise.getNoise(frameCount * .01 * (this.debree.length - j)), 0, 1, -5, 5));
        }
    }
    shadeColor(amount) {
        //this.blob.shadeColor(amount);
        //this.debree.shadeColor(amount);
    }
    revertColor() {
        //this.blob.revertColor();
        //this.debree.revertColor();
    }
    focus(e) {
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.dx + this.r, this.dy + this.r], [e.pageX, e.pageY], this.name)
        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].component.style('transition', '1s');
            if (global_comp[i] != this.blob && global_comp[i] != this.debree) {
                global_comp[i].shadeColor(0.5)
            } else if (global_comp[i] == this.debree) {
                global_comp[i].shadeColor(-0.5)
            }
        }
    }
    unFocus() {
        var svg = d3.select('#main-svg');
        toolTipRemove(svg)
        for (var i = 0; i < this.lines.length; i++)
            this.lines[i].component.style('transition', '0s');
        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].component.style('transition', '0s');
            if (global_comp[i] != this.blob || this.lines.indexOf(global_comp[i]) == -1)
                global_comp[i].revertColor()
        }
    }
}
