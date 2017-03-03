/**
 * Creates a set of Ribosome Objects based on the given parameters.
 * @param {D3Object} container - SVG Container of the Ribosome Objects.
 * @param {int} r - Base radius of the Ribosome.
 * @param {int} r_var - Amount of variation in base radius for each Ribsome.
 * @param {int} amount - Number of total Ribsomes.
 * @param {int} dx - Horizontal displacement from position (0,0) of the Ribosomes.
 * @param {int} dy - Vertical displacement from position (0,0) of the Ribosomes.
 * @param {int} dxvar - Variation allowed in the horizontal position for each Ribosome.
 * @param {int} dyvar - Variation allowed in the vertical position for each Ribosome.
 * @param {String} fill - Fill of the Ribosomes, ie. '#c0392b' (Hex Recommended).
 * @param {String} class_name - HTML class of the Ribosomes, ie. 'ribosomes'.
 * @param {String} name - Name of the blob, ie. 'Ribosomes'
 */
class Ribosomes {
    constructor(container, r, r_var, amount, dx, dy, dxvar, dyvar, fill, class_name, name) {
        this.data = [] //this.data = [RibsomeA, RibsomeB, RibsomeC ...]
        this.noise = new CircularNoise(0.5);
        while (this.data.length < amount) {
            var new_dx = Math.random() * dxvar + dx
            var new_dy = Math.random() * dyvar + dy
            var new_rad = map(Math.random(), 0, 1, -r_var, r_var) + r
            var no_overlap = true
            for (var i = 0; i < this.data.length; i++) {
                var d = Math.pow(this.data[i].dx - new_dx, 2) + Math.pow(this.data[i].dy - new_dy, 2)
                if (d - 100 < Math.pow(this.data[i].r + new_rad, 2)) {
                    no_overlap = false
                }
            }
            if (no_overlap) {
                this.data.push(new Ribosome(container, new_rad, new_dx, new_dy, fill, class_name, class_name + this.data.length, name))
            }
        }
    }
    draw() {
        for (var j = 0; j < this.data.length; j++) {
            this.data[j].translate(map(this.noise.getNoise(frameCount * .01 * j), 0, 1, -5, 5), map(this.noise.getNoise(frameCount * .01 * (this.data.length - j)), 0, 1, -5, 5));
        }
    }
}
/**
 * Creates an SVG circle with the given properties.
 * @param {D3Object} container - SVG Container of the Ribosome.
 * @param {int} r - Radius of the Ribosome.
 * @param {int} dx - Horizontal displacement from position (0,0) of the Ribosome.
 * @param {int} dy - Vertical displacement from position (0,0) of the Ribosome.
 * @param {String} fill - Fill of the Ribosome, ie. '#c0392b' (Hex Recommended).
 * @param {String} id - HTML id of the Ribosome, ie. 'ribosome_a'.
 * @param {String} name - Name of the Ribosome, ie. 'Ribosomes'
 */
class Ribosome {
    constructor(container, r, dx, dy, fill, class_name, id, name) {
        this.component = container.append('circle')
            .attr('fill', fill)
            .attr('cx', dx)
            .attr('cy', dy)
            .attr('r', r)
            .attr('class', class_name)
            .attr('id', id)
            .style('cursor', 'pointer')
        this.r = r;
        this.id = id;
        this.dx = dx;
        this.dy = dy;
        this.fill = fill;
        this.name = name;
        this.class_name = class_name
        var ribo = this;
        $('#' + id).mouseover(function(e) {
                ribo.focus(e);
            })
            .mouseout(function(e) {
                ribo.unFocus(e);
            });

        global_comp.push(this);
    }
    translate(tx, ty) {
        var current_cx = parseInt(this.component.attr('cx'));
        var current_cy = parseInt(this.component.attr('cy'));
        this.component.attr('cx', this.dx + tx);
        this.component.attr('cy', this.dy + ty);
    }
    shadeColor(amount) {
        this.component.attr('fill', shadeHexColor(this.component.attr('fill'), amount))
    }
    revertColor() {
        this.component.attr('fill', this.fill)
    }
    setTransition(amount) {
      this.component.style('transition', amount + 's')
    }
    focus(e) {
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.dx, this.dy], [e.pageX, e.pageY], this.name)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(1)
            if (global_comp[i].component && global_comp[i].component.attr('class') == this.class_name) {
                global_comp[i].shadeColor(-0.5)
            } else {
                global_comp[i].shadeColor(0.5)
            }
        }
    }
    unFocus() {
        var svg = d3.select('#main-svg');
        toolTipRemove(svg)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(0)
            global_comp[i].revertColor()
        }
    }
}
