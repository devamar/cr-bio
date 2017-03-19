class SmoothER {
    constructor(container, length, width, branch_width, iterations, start_angle, surround, padding, fill, id, name) {
        this.length = length;
        this.width = width;
        this.branch_width = branch_width;
        this.r = surround.width + padding;
        this.pos = createVector(surround.pos.x, surround.pos.y);
        this.offset = createVector(0, 0);
        this.start_theta = start_angle;
        this.theta_delta_a = random(this.length / 2, this.length);
        this.theta_delta_b = random(this.length / 2, this.length);
        this.theta_delta_c = random(this.length / 2, this.length);
        this.theta_delta_d = random(this.length / 2, this.length);
        this.theta_delta_e = random(PI / 16, PI / 8);
        this.theta_delta_f = random(PI / 8, PI / 5);
        this.theta_delta_g = random(PI / 8, PI / 5);
        this.transrng = random(5);
        this.name = name;
        this.id = id;
        this.fill = fill;
        this.transition = 0;
        this.container = container;
        this.component;
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
        frameRate(fps);
        var svg = d3.select('#main-svg');
        toolTipRemove(svg)

        for (var i = 0; i < global_comp.length; i++) {
            global_comp[i].setTransition(0)
            if (global_comp[i] != this)
                global_comp[i].revertColor()
        }
    }
    translate(x, y) {
        this.offset.x = x;
        this.offset.y = y;
    }
    removeFromGlobalComponents() {
        global_comp.splice(global_comp.indexOf(this), 1)
    }
    exit(dur, delay) {
        this.component.transition().remove().delay(delay).duration(dur).style('opacity', 0)
        this.removeFromGlobalComponents()
    }
    setupDraw() {
        this.component = this.container.append('path')
            .attr('fill', this.fill)
            .attr('stroke', 'none')
            .attr('d', '')
            .attr('id', this.id)
            .style('cursor', 'pointer');


        var er = this;

        $('#' + this.id).mouseover(function(e) {
                er.focus(e);
            })
            .mouseout(function(e) {
                er.unFocus(e);
            });

        global_comp.push(this)
    }
    draw() {
        if (!this.component) {
            this.setupDraw()
        }
        var current_theta = this.start_theta;
        var s = ''
        //A
        s += 'M' + ((this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //B
        var x1 = (this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        var y1 = (this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        var x2 = (this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        var y2 = (this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += alt_arc_to(x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //C
        s += arc_to(current_theta, current_theta - this.theta_delta_a, this.r + 4 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_a
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //D
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //E
        s += arc_to(current_theta, current_theta + this.theta_delta_b, this.r + 3 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta + this.theta_delta_b
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //F
        x1 = (this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += alt_arc_to(x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //G
        s += arc_to(current_theta, current_theta - this.theta_delta_c, this.r + 2 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_c
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //H
        s += 'L' + ((this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //I
        s += arc_to(current_theta, current_theta + this.theta_delta_d, this.r + this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta + this.theta_delta_d
        s += 'L' + ((this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //J
        x1 = (this.r + 1 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 1 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += alt_arc_to(x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //K
        s += arc_to(current_theta, current_theta - this.theta_delta_d - this.theta_delta_e - this.branch_width, this.r, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_d - this.theta_delta_e - this.branch_width
        s += 'L' + ((this.r) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r) * sin(current_theta) + (this.pos.y + this.offset.y))

        //L
        x1 = (this.r) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += alt_arc_to(x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //M
        s += arc_to(current_theta, current_theta + this.theta_delta_e, this.r + this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta + this.theta_delta_e
        s += 'L' + ((this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //N
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //O
        s += arc_to(current_theta, current_theta - this.theta_delta_f, this.r + 2 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_f
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //P
        x1 = (this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += alt_arc_to(x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //Q
        s += arc_to(current_theta, this.start_theta - this.theta_delta_a - this.branch_width, this.r + 3 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = this.start_theta - this.theta_delta_a - this.branch_width
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //R
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //S
        s += arc_to(current_theta, current_theta - this.theta_delta_g, this.r + 4 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_g
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //T
        x1 = (this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += alt_arc_to(x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //U
        s += arc_to(current_theta, this.start_theta, this.r + 5 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = this.start_theta
        s += 'L' + ((this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        this.component.attr('d', s);

        var transx = map(noise(frameCount * fps_factor), 0, 1, -5, 5)
        var transy = map(noise(frameCount * fps_factor + this.transrng), 0, 1, -5, 5)

        this.translate(transx, transy)
    }
}
