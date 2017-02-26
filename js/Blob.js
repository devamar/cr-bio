class Blob {
    constructor(container, power, width, height, variance, frequency, dx, dy, noise, fill, id, name) {
        this.component = container.append('path')
            .attr('fill', fill)
            .attr('id', id)
            .style('cursor', 'pointer');
        this.power = power;
        var rng = Math.random()*variance;
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
}
