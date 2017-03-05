class ER {
    constructor(container, length, width, branch_width, iterations, start_angle, surround, padding, fill, id, name) {
        this.length = length;
        this.width = width;
        this.branch_width = branch_width;
        this.r = surround.width + padding;
        this.dx = surround.dx;
        this.dy = surround.dy;
        this.component = container.append('path')
            .attr('fill', fill)
            .attr('stroke', 'none')
            .attr('d', '')
            .attr('id', id)
            .style('cursor', 'pointer');
        this.start_theta = start_angle;
        this.theta_delta_a = random(this.length/2, this.length)
        this.theta_delta_b = random(this.length/2, this.length)
        this.theta_delta_c = random(this.length/2, this.length)
        this.theta_delta_d = random(this.length/2, this.length)
        this.theta_delta_e = random(PI/16, PI/8)
        this.theta_delta_f = random(PI/8, PI/5)
        this.theta_delta_g = random(PI/8, PI/5)
        this.transrng = random(5)
        this.name = name;
        this.id = id;
        this.fill = fill;
        this.transition = 0;

        var er = this;

        $('#' + id).mouseover(function(e) {
                er.focus(e);
            })
            .mouseout(function(e) {
                er.unFocus(e);
            });

        global_comp.push(this)
    }
    shadeColor(amount) {
        this.component.attr('fill', shadeHexColor(this.fill, amount))
    }
    revertColor() {
        this.component.attr('fill', this.fill)
    }
    setTransition(amount) {
      this.component.style('transition', amount + 's');
      this.transition = amount;
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
    draw() {
        var current_theta = this.start_theta;
        var s = ''
        //A
        s += 'M' + ((this.r + 5 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + this.dy)
        //B
        //s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + this.dy)
        var x1 = (this.r + 5 * this.width) * cos(current_theta) + this.dx
        var y1 = (this.r + 5 * this.width) * sin(current_theta) + this.dy
        var x2 = (this.r + 4 * this.width) * cos(current_theta) + this.dx
        var y2 = (this.r + 4 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy)

        //C
        s += arc_to(current_theta, current_theta - this.theta_delta_a, this.r + 4 * this.width, this.dx, this.dy)
        current_theta = current_theta - this.theta_delta_a
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + this.dy)

        //D
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + this.dy)
        /*
        x1 = (this.r + 4 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 4 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 3 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 3 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy, 0)
        */

        //E
        s += arc_to(current_theta, current_theta + this.theta_delta_b, this.r + 3 * this.width, this.dx, this.dy)
        current_theta = current_theta + this.theta_delta_b
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + this.dy)

        //F
        //s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + this.dy)
        x1 = (this.r + 3 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 3 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 2 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 2 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy)

        //G
        s += arc_to(current_theta, current_theta - this.theta_delta_c, this.r + 2 * this.width, this.dx, this.dy)
        current_theta = current_theta - this.theta_delta_c
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + this.dy)

        //H
        s += 'L' + ((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + this.width) * sin(current_theta) + this.dy)
        /*
        x1 = (this.r + 2 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 2 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 1 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 1 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy, 0)
        */


        //I
        s += arc_to(current_theta, current_theta + this.theta_delta_d, this.r + this.width, this.dx, this.dy)
        current_theta = current_theta + this.theta_delta_d
        s += 'L' + ((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + this.width) * sin(current_theta) + this.dy)

        //J
        //s += 'L' + ((this.r) * cos(current_theta) + this.dx) + ' ' + ((this.r) * sin(current_theta) + this.dy)
        x1 = (this.r + 1 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 1 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r) * cos(current_theta) + this.dx
        y2 = (this.r) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy)

        //K
        s += arc_to(current_theta, current_theta - this.theta_delta_d - this.theta_delta_e - this.branch_width, this.r, this.dx, this.dy)
        current_theta = current_theta - this.theta_delta_d - this.theta_delta_e - this.branch_width
        s += 'L' + ((this.r) * cos(current_theta) + this.dx) + ' ' + ((this.r) * sin(current_theta) + this.dy)

        //L
        //s += 'L' + ((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + this.width) * sin(current_theta) + this.dy)
        x1 = (this.r) * cos(current_theta) + this.dx
        y1 = (this.r) * sin(current_theta) + this.dy
        x2 = (this.r + this.width) * cos(current_theta) + this.dx
        y2 = (this.r + this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy)

        //M
        s += arc_to(current_theta, current_theta + this.theta_delta_e, this.r + this.width, this.dx, this.dy)
        current_theta = current_theta + this.theta_delta_e
        s += 'L' + ((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + this.width) * sin(current_theta) + this.dy)

        //N
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + this.dy)
        /*
        x1 = (this.r + this.width) * cos(current_theta) + this.dx
        y1 = (this.r + this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 2 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 2 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy, Math.PI)
        */

        //O
        s += arc_to(current_theta, current_theta - this.theta_delta_f, this.r + 2 * this.width, this.dx, this.dy)
        current_theta = current_theta - this.theta_delta_f
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + this.dy)

        //P
        //s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + this.dy)
        x1 = (this.r + 2 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 2 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 3 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 3 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy)

        //Q
        //x = this.start_theta - this.theta_delta_a - this.branch_width - current_theta
        s += arc_to(current_theta, this.start_theta - this.theta_delta_a - this.branch_width, this.r + 3 * this.width, this.dx, this.dy)
        current_theta = this.start_theta - this.theta_delta_a - this.branch_width
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + this.dy)

        //R
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + this.dy)
        /*
        x1 = (this.r + 3 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 3 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 4 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 4 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy, Math.PI)
        */

        //S
        s += arc_to(current_theta, current_theta - this.theta_delta_g, this.r + 4 * this.width, this.dx, this.dy)
        current_theta = current_theta - this.theta_delta_g
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + this.dy)

        //T
        //s += 'L' + ((this.r + 5 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + this.dy)
        x1 = (this.r + 4 * this.width) * cos(current_theta) + this.dx
        y1 = (this.r + 4 * this.width) * sin(current_theta) + this.dy
        x2 = (this.r + 5 * this.width) * cos(current_theta) + this.dx
        y2 = (this.r + 5 * this.width) * sin(current_theta) + this.dy
        s += alt_arc_to(x1, y1, x2, y2, this.dx, this.dy)

        //U
        s += arc_to(current_theta, this.start_theta, this.r + 5 * this.width, this.dx, this.dy)
        current_theta = this.start_theta
        s += 'L' + ((this.r + 5 * this.width) * cos(current_theta) + this.dx) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + this.dy)

        this.component.attr('d', s);

        var transx = map(noise(frameCount * .008), 0, 1, -7, 7)
        var transy = map(noise(frameCount * .008 + this.transrng), 0, 1, -7, 7)

        this.component.transition()
          .duration(this.transition*1000)
          .attr('transform', 'translate(' + transx + ', ' + transy + ') rotate(' + 5*noise(frameCount*0.01)+ ' ' + this.dx + ' ' + this.dy + ')')
    }
}
