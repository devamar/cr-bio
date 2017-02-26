class Ribosomes {
    constructor(container, r, r_var, amount, dx, dy, dxvar, dyvar, fill, class_name, name) {
        this.data = [] //this.data = [RibsomeA, RibsomeB, RibsomeC]
        this.noise = new CircularNoise(0.5);
        while (this.data.length < amount) {
            var new_dx = Math.random() * dxvar + dx
            var new_dy = Math.random() * dyvar + dy
            var new_rad = Math.random() * (r_var) + r
            var no_overlap = true
            for (var i = 0; i < this.data.length; i++) {
                var d = Math.pow(this.data[i].dx - new_dx, 2) + Math.pow(this.data[i].dy - new_dy, 2)
                if (d - 100 < Math.pow(this.data[i].r + new_rad, 2)) {
                    no_overlap = false
                }
            }
            if (no_overlap) {
                this.data.push(new Ribosome(container, new_rad, new_dx, new_dy, fill, class_name + this.data.length, name))
            }
        }
    }
    draw() {
        for (var j = 0; j < this.data.length; j++) {
            this.data[j].translate(map(this.noise.getNoise(frameCount * .01 * j), 0, 1, -5, 5), map(this.noise.getNoise(frameCount * .01 * (this.data.length - j)), 0, 1, -5, 5));
        }
    }
}

class Ribosome {
    constructor(container, r, dx, dy, fill, id, name) {
        this.component = container.append('circle')
            .attr('fill', fill)
            .attr('cx', dx)
            .attr('cy', dy)
            .attr('r', r)
            .attr('id', id)
            .style('cursor', 'pointer')
        this.r = r;
        this.dx = dx;
        this.dy = dy;
        this.id = id;
        this.fill = fill;
        this.name = name;

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
    focus(e) {
        var svg = d3.select('#main-svg');
        toolTip(svg, [this.dx, this.dy], [e.pageX, e.pageY], this.name.length * 9, this.name)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].component.style('transition', '1s');
            if (global_comp[i] instanceof Ribosome) {
                global_comp[i].shadeColor(-0.5)
            } else {
                global_comp[i].shadeColor(0.5)
            }
        }
    }
    unFocus() {
        var svg = d3.select('#main-svg');
        toolTipRemove(svg, this.name.length * 9)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].component.style('transition', '0s');
            global_comp[i].revertColor()
        }
    }
}
