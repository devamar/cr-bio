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
        this.container = container;
        this.mito_group;
        this.outer;
        this.inner;
        this.pillar_group;

        this.ytrans_offset = random(5)
    }
    setupDraw() {
        //var membrane_offset = (this.width + this.height) / 16
        this.mito_group = this.container.append('g')
            .attr('id', this.id)
            .attr('transform', 'rotate(' + this.rot + ' ' + (this.pos.x + this.width / 2) + ' ' + (this.pos.y + this.height / 2) + ')');

        this.outer = this.mito_group.append('rect')
            .attr('fill', this.fill_outer)
            .attr('x', this.pos.x)
            .attr('y', this.pos.y)
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('rx', this.height / 2)
            .attr('ry', this.height / 2)
            .attr('id', this.id + '_outer')
            .style('cursor', 'pointer');

        var dv = this.height / 3;

        this.inner = this.mito_group.append('rect')
            .attr('fill', this.fill_inner)
            .attr('x', this.pos.x + dv / 2)
            .attr('y', this.pos.y + dv / 2)
            .attr('width', this.width - dv)
            .attr('height', this.height - dv)
            .attr('rx', (this.height - dv) / 2)
            .attr('ry', (this.height - dv) / 2)
            .attr('id', this.id + '_inner')
            .style('cursor', 'pointer');

        this.pillar_group = this.mito_group.append('g')
            .attr('id', this.id + '_pillars')

        //Lower Pillars
        var pillar_size = this.width / 17.5;
        for (var i = this.width / 4 - this.width / 8; i < this.width; i += this.width / 4) {
            var height_pillar = random(this.height / 4, this.height / 2)
            this.pillar_group.append('rect')
                .attr('fill', this.fill_outer)
                .attr('x', this.pos.x + i - pillar_size / 2)
                .attr('y', this.pos.y + this.height - dv / 4 - height_pillar)
                .attr('width', pillar_size)
                .attr('height', height_pillar)
                .attr('rx', pillar_size / 2)
                .attr('ry', pillar_size / 2)
                .attr('class', this.id + '_pillar')
                .style('cursor', 'pointer');
        }

        //Upper Pillars
        for (var i = this.width / 4; i < this.width; i += this.width / 4) {
            var height_pillar = random(this.height / 4, this.height / 2)
            this.pillar_group.append('rect')
                .attr('fill', this.fill_outer)
                .attr('x', this.pos.x + i - pillar_size / 2)
                .attr('y', this.pos.y + dv / 4)
                .attr('width', pillar_size)
                .attr('height', height_pillar)
                .attr('rx', pillar_size / 2)
                .attr('ry', pillar_size / 2)
                .attr('class', this.id + '_pillar')
                .style('cursor', 'pointer');
        }

        var mito = this;
        $('#' + this.id).mouseover(function(e) {
                mito.focus(e);
            })
            .mouseout(function(e) {
                mito.unFocus(e);
            });
        global_comp.push(this)
    }
    draw() {
        if (!(this.mito_group && this.outer && this.inner && this.pillar_group)) {
            this.setupDraw();
        }
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
    exit(dur, delay) {
        this.mito_group.transition().remove().delay(delay).duration(dur).style('opacity', 0)
        this.removeFromGlobalComponents()
    }
}
