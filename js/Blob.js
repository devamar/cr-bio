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
class Blob {
    constructor(container, power, width, height, variance, frequency, dx, dy, noise, fill, id, name, dropshadow = false) {
        this.power = power;
        var rng = Math.random() * variance;
        this.width = width + rng;
        this.height = height + rng;
        this.frequency = frequency;
        this.dx = dx;
        this.dy = dy;
        this.noise = noise;
        this.fill = fill;
        this.id = id;
        this.container = container;
        this.fill = fill;
        this.name = name;

        if (dropshadow) {
            this.drop_shadow = container.append('path')
                .attr('fill', fill)
                .attr('id', id + '_dropshadow')
                .attr('d', draw_cell(this.width, this.height, 2 / power, frequency, noise, dx + 2, dy + 2))
                .attr('filter', 'url(#blur)')
                .style('cursor', 'pointer');
        }
        this.component = container.append('path')
            .attr('fill', fill)
            .attr('id', id)
            .style('cursor', 'pointer');

        var blob = this;
        $('#' + id).mouseover(function(e) {
                blob.focus(e);
            })
            .mouseout(function(e) {
                blob.unFocus(e);
            });

        global_comp.push(this)
    }
    draw() {
        this.component.attr('d', draw_cell(this.width, this.height, 2 / this.power, this.frequency, this.noise, this.dx, this.dy))
    }
    shadeColor(amount) {
        this.component.attr('fill', shadeHexColor(this.component.attr('fill'), amount))
    }
    revertColor() {
        this.component.attr('fill', this.fill)
    }
    focus(e) {
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.dx, this.dy], [e.pageX, e.pageY], this.name.length * 9, this.name)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].component.style('transition', '1s');
            if (global_comp[i] != this)
                global_comp[i].shadeColor(0.5)
        }
    }
    unFocus() {
        var svg = d3.select('#main-svg');
        toolTipRemove(svg, this.name.length * 9)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].component.style('transition', '0s');
            if (global_comp[i] != this)
                global_comp[i].revertColor()
        }
    }
    addDropShadow() {}
}
