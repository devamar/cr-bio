/**
 * Creates an SVG componenet which displaces similar to a 'blob' of liquid.
 * @param {D3Object} container - SVG Container of the blob.
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
        this.dx = dx;
        this.dy = dy;
        this.rot = rot;
        this.fill_outer = fill_outer;
        this.fill_inner = fill_inner;
        this.id = id;
        this.name = name;

        this.trans_cnoise = new CircularNoise(1)

        this.mito_group = container.append('g')
            .attr('id', id)
            .attr('transform', 'rotate(' + rot + ' ' + (dx + width / 2) + ' ' + (dy + height / 2) + ')');

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
            var height_pillar = map(Math.random(), 0, 1, height / 4, height / 2)
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
            var height_pillar = map(Math.random(), 0, 1, height / 4, height / 2)
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
        var xtrans = map(this.trans_cnoise.getNoise(frameCount * .01), 0, 1, -5, 5)
        var ytrans = map(this.trans_cnoise.getNoise(frameCount * .01), 0, 1, -5, 5)
        this.translate(xtrans, ytrans);
    }
    translate(x, y) {
        this.mito_group.attr('transform', 'translate(' + x + ', ' + y + ') rotate(' + (this.rot + map(noise(frameCount * 0.01), 0, 1, 0, 40)) + ' ' + (this.dx + this.width / 2) + ' ' + (this.dy + this.height / 2) + ')')
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
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.dx, this.dy], [e.pageX, e.pageY], this.name)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(1)
            if (global_comp[i] != this)
                global_comp[i].shadeColor(0.5)
        }
    }
    unFocus() {
        var svg = d3.select('#main-svg');
        toolTipRemove(svg)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(0)
            if (global_comp[i] != this)
                global_comp[i].revertColor()
        }
    }
    addDropShadow() {}
}