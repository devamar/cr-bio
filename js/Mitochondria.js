/**
 * Creates an SVG componenet in the form of a mitochondria.
 * @param {D3Object} container - SVG Container of the mitochondria.
 * @param {int} width - Width of the mitochondria.
 * @param {int} height - Height of the mitochondria.
 * @param {int} dx - Horizontal displacement from position (0,0) of the mitochondria.
 * @param {int} dy - Vertical displacement from position (0,0) of the mitochondria.
 * @param {int} rot - Rotation from horizontal axis in degrees of the mitochondria.
 * @param {String} fill_outer - Fill of the outer mitochondria, ie. '#c0392b' (Hex Recommended).
 * @param {String} fill_outer - Fill of the inner mitochondria, ie. '#c0392b' (Hex Recommended).
 * @param {String} id - HTML id of the mitochondria, ie. 'mito'.
 * @param {String} name - Name of the mitochondria, ie. 'Mitochondria'
 */
class Mitochondria {
    constructor(container, width, height, dx, dy, rot, fill_outer, fill_inner, id, name) {
        this.width = width;
        this.height = height;
        this.pos = createVector(dx, dy)
        this.offset = createVector(0, 0)
        this.rot = rot;
        this.fill_outer = fill_outer;
        this.fill_inner = fill_inner;
        this.id = id;
        this.name = name;

        this.ytrans_offset = random(5)

        var membrane_offset = (width + height) / 16
        this.mito_group = container.append('g')
            .attr('id', id)
            .attr('transform', 'rotate(' + rot + ' ' + (dx + width / 2) + ' ' + (dy + height / 2) + ')');

        /*
        this.outer_membrane = this.mito_group.append('rect')
            .attr('fill', fill_outer_membrane)
            .attr('x', dx - membrane_offset/2)
            .attr('y', dy - membrane_offset/2)
            .attr('width', width + membrane_offset)
            .attr('height', height + membrane_offset)
            .attr('rx', (height + membrane_offset) / 2)
            .attr('ry', (height + membrane_offset) / 2)
            .attr('id', id + '_outer')
            .style('cursor', 'pointer');
        */
        this.outer = this.mito_group.append('rect')
            .attr('fill', fill_outer)
            .attr('x', dx)
            .attr('y', dy)
            .attr('width', width)
            .attr('height', height)
            .attr('rx', height / 2)
            .attr('ry', height / 2)
            .attr('id', id + '_outer')
            .style('cursor', 'pointer');

        var dv = height / 3;

        this.inner = this.mito_group.append('rect')
            .attr('fill', fill_inner)
            .attr('x', dx + dv / 2)
            .attr('y', dy + dv / 2)
            .attr('width', width - dv)
            .attr('height', height - dv)
            .attr('rx', (height - dv) / 2)
            .attr('ry', (height - dv) / 2)
            .attr('id', id + '_inner')
            .style('cursor', 'pointer');

        var pillar_group = this.mito_group.append('g')
            .attr('id', id + '_pillars')

        //Lower Pillars
        var pillar_size = width / 17.5;
        for (var i = width / 4 - width / 8; i < width; i += width / 4) {
            var height_pillar = random(height / 4, height / 2)
            pillar_group.append('rect')
                .attr('fill', fill_outer)
                .attr('x', dx + i - pillar_size / 2)
                .attr('y', dy + height - dv / 4 - height_pillar)
                .attr('width', pillar_size)
                .attr('height', height_pillar)
                .attr('rx', pillar_size / 2)
                .attr('ry', pillar_size / 2)
                .attr('class', id + '_pillar')
                .style('cursor', 'pointer');
        }

        //Upper Pillars
        for (var i = width / 4; i < width; i += width / 4) {
            var height_pillar = random(height / 4, height / 2)
            pillar_group.append('rect')
                .attr('fill', fill_outer)
                .attr('x', dx + i - pillar_size / 2)
                .attr('y', dy + dv / 4)
                .attr('width', pillar_size)
                .attr('height', height_pillar)
                .attr('rx', pillar_size / 2)
                .attr('ry', pillar_size / 2)
                .attr('class', id + '_pillar')
                .style('cursor', 'pointer');
        }

        var mito = this;
        $('#' + id).mouseover(function(e) {
                mito.focus(e);
            })
            .mouseout(function(e) {
                mito.unFocus(e);
            });

        global_comp.push(this)
    }
    draw() {
        this.mito_group.attr('transform', 'translate(' + this.offset.x + ', ' + this.offset.y + ') rotate(' + (this.rot + map(noise(frameCount * fps_factor * 0.1), 0, 1, 0, 360)) + ' ' + (this.pos.x + this.width / 2) + ' ' + (this.pos.y + this.height / 2) + ')')
        var xtrans = map(noise(frameCount * fps_factor), 0, 1, -8, 8)
        var ytrans = map(noise(frameCount * fps_factor + this.ytrans_offset), 0, 1, -8, 8)
        this.translate(xtrans, ytrans);
    }
    translate(x, y) {
        this.offset.x = x;
        this.offset.y = y;
    }
    shadeColor(amount) {
        this.outer.attr('fill', shadeHexColor(this.outer.attr('fill'), amount))
        this.inner.attr('fill', shadeHexColor(this.inner.attr('fill'), amount))
        d3.selectAll('.' + this.id + '_pillar').attr("fill", shadeHexColor(this.fill_outer, amount));
    }
    revertColor() {
        this.outer.attr('fill', this.fill_outer)
        this.inner.attr('fill', this.fill_inner)
        d3.selectAll('.' + this.id + '_pillar').attr("fill", this.fill_outer);
    }
    setTransition(amount) {
        this.outer.style('transition', amount + 's')
        this.inner.style('transition', amount + 's')
        d3.selectAll('.' + this.id + '_pillar').style("transition", amount + 's');
    }
    focus(e) {
        frameRate(fps_focus);
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.pos.x, this.pos.y], [e.pageX, e.pageY], this.name)

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
    removeFromGlobalComponents() {
        global_comp.splice(global_comp.indexOf(this), 1)
    }
    exit() {
        this.mito_group.transition().remove().duration(2000).style('opacity', 0)
    }
}
