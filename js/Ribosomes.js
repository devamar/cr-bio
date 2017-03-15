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
        this.ytrans_offset = random(5);
        var iterations = 0;
        while (this.data.length < amount && iterations < 500) {
            iterations++;
            var new_dx = random(dx, dx + dxvar)
            var new_dy = random(dy, dy + dyvar)
            var new_rad = random(-r_var, r_var) + r
            var no_overlap = true
            for (var i = 0; i < this.data.length; i++) {
                var d = sq(this.data[i].pos.x - new_dx) + sq(this.data[i].pos.y - new_dy)
                if (d - 100 < sq(this.data[i].r + new_rad)) {
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
            this.data[j].translate(map(noise(frameCount * fps_factor + j), 0, 1, -8, 8), map(noise(frameCount * fps_factor + this.ytrans_offset), 0, 1, -8, 8));
            this.data[j].draw();
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
    constructor(container, r, dx, dy, fill, class_name, id, name, hover = true) {
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
        this.pos = createVector(dx, dy)
        this.offset = createVector(0, 0)
        this.rng = createVector(random(5), random(5))
        this.fill = fill;
        this.name = name;
        this.class_name = class_name
        this.hover = hover;

        if (hover) {
            var ribo = this;
            $('#' + id).mouseover(function(e) {
                    ribo.focus(e);
                })
                .mouseout(function(e) {
                    ribo.unFocus(e);
                });
        }
        global_comp.push(this);
    }
    translate(x, y) {
        this.offset.x = x
        this.offset.y = y
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
    draw() {
        this.component.attr('cx', this.pos.x + this.offset.x);
        this.component.attr('cy', this.pos.y + this.offset.y);
    }
    focus(e) {
        frameRate(fps_focus);
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.pos.x + this.offset.x, this.pos.y + this.offset.y], [e.pageX, e.pageY], this.name)

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
        frameRate(fps);
        var svg = d3.select('#main-svg');
        toolTipRemove(svg)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(0)
            global_comp[i].revertColor()
        }
    }
    removeFromGlobalComponents() {
        global_comp.splice(global_comp.indexOf(this), 1)
    }
    exit() {
        this.component.transition().remove().duration(2000).style('opacity', 0)
    }
}
