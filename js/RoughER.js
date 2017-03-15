class RoughER {
    constructor(container, length, width, branch_width, iterations, start_angle, surround, padding, ribo_radius, fill, ribo_fill, id, name) {
        this.ribo_fill = ribo_fill
        this.ribo_radius = ribo_radius;
        this.ribo_radius_var = 1;
        this.length = length;
        this.width = width;
        this.branch_width = branch_width;
        this.r = surround.width + padding;
        this.pos = createVector(surround.pos.x, surround.pos.y);
        this.offset = createVector(0,0);
        this.component = container.append('g')
          .attr('id', id)
        this.ribosomes = []
        this.er = this.component.append('path')
            .attr('fill', fill)
            .attr('stroke', 'none')
            .attr('d', '')
            .attr('id', id + '_rough')
            .style('cursor', 'pointer');
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

        var er = this;

        $('#' + id + '_rough').mouseover(function(e) {
                er.focus(e);
            })
            .mouseout(function(e) {
                er.unFocus(e);
            });

        global_comp.push(this)
    }
    shadeColor(amount) {
        this.er.attr('fill', shadeHexColor(this.fill, amount))
    }
    revertColor() {
        this.er.attr('fill', this.fill)
    }
    setTransition(amount) {
        this.er.style('transition', amount + 's');
        this.transition = amount;
        for (var i = 0; i < this.ribosomes.length; i++) {
          this.ribosomes[i].setTransition(amount)
        }
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
      for (var i = 0; i < this.ribosomes.length; i++) {
        this.ribosomes[i].translate(x, y)
      }
    }
    removeFromGlobalComponents() {
      global_comp.splice(global_comp.indexOf(this), 1)
    }
    exit() {
        this.component.transition().remove().duration(2000).style('opacity', 0)
    }
    addRibo(x, y) {
        this.ribosomes.push(new Ribosome(this.component, this.ribo_radius + random(-this.ribo_radius_var, this.ribo_radius_var), x, y, this.ribo_fill, this.id + '_ribo', this.id + '_ribo' + this.ribosomes.length, 'Ribosome'))
    }
    draw() {
      //console.log(this.ribosomes)
        var current_theta = this.start_theta;
        var s = ''
        //A
        s += 'M' + ((this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //B
        var x1 = (this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        var y1 = (this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        var x2 = (this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        var y2 = (this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += rough_alt_arc_to(this, x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //C
        s += rough_arc_to(this, current_theta, current_theta - this.theta_delta_a, this.r + 4 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_a
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //D
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //E
        s += rough_arc_to(this, current_theta, current_theta + this.theta_delta_b, this.r + 3 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta + this.theta_delta_b
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //F
        x1 = (this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += rough_alt_arc_to(this, x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //G
        s += rough_arc_to(this, current_theta, current_theta - this.theta_delta_c, this.r + 2 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_c
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //H
        s += 'L' + ((this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //I
        s += rough_arc_to(this, current_theta, current_theta + this.theta_delta_d, this.r + this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta + this.theta_delta_d
        s += 'L' + ((this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //J
        x1 = (this.r + 1 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 1 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += rough_alt_arc_to(this, x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //K
        s += rough_arc_to(this, current_theta, current_theta - this.theta_delta_d - this.theta_delta_e - this.branch_width, this.r, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_d - this.theta_delta_e - this.branch_width
        s += 'L' + ((this.r) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r) * sin(current_theta) + (this.pos.y + this.offset.y))

        //L
        x1 = (this.r) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += rough_alt_arc_to(this, x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //M
        s += rough_arc_to(this, current_theta, current_theta + this.theta_delta_e, this.r + this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta + this.theta_delta_e
        s += 'L' + ((this.r + this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //N
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //O
        s += rough_arc_to(this, current_theta, current_theta - this.theta_delta_f, this.r + 2 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_f
        s += 'L' + ((this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //P
        x1 = (this.r + 2 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 2 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += rough_alt_arc_to(this, x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //Q
        s += rough_arc_to(this, current_theta, this.start_theta - this.theta_delta_a - this.branch_width, this.r + 3 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = this.start_theta - this.theta_delta_a - this.branch_width
        s += 'L' + ((this.r + 3 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 3 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //R
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //S
        s += rough_arc_to(this, current_theta, current_theta - this.theta_delta_g, this.r + 4 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = current_theta - this.theta_delta_g
        s += 'L' + ((this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        //T
        x1 = (this.r + 4 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y1 = (this.r + 4 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        x2 = (this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)
        y2 = (this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y)
        s += rough_alt_arc_to(this, x1, y1, x2, y2, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))

        //U
        s += rough_arc_to(this, current_theta, this.start_theta, this.r + 5 * this.width, (this.pos.x + this.offset.x), (this.pos.y + this.offset.y))
        current_theta = this.start_theta
        s += 'L' + ((this.r + 5 * this.width) * cos(current_theta) + (this.pos.x + this.offset.x)) + ' ' + ((this.r + 5 * this.width) * sin(current_theta) + (this.pos.y + this.offset.y))

        this.er.attr('d', s);

        for (var i = 0; i < this.ribosomes.length; i++) {
          this.ribosomes[i].draw()
        }

        var transx = map(noise(frameCount * fps_factor), 0, 1, -5, 5)
        var transy = map(noise(frameCount * fps_factor + this.transrng), 0, 1, -5, 5)

        this.translate(transx, transy)
    }
}
