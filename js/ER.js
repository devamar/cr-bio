class ER {
    constructor(container, min_length, max_length, min_width, max_width, min_iterations, max_iterations, surround, padding, fill, id, name) {
        this.data = [] // this.data = [{x: 0, y: 0}, {x: 1, y: 0} ...]
        //First Iteration
        this.length = Math.random() * ((max_length - min_length) / 2) + min_length / 2;
        this.width = Math.random() * (max_width - min_width) + min_width;
        this.branch_width = Math.random() * (max_width - min_width) + min_width;
        this.r = surround.width + padding;
        this.dx = surround.dx;
        this.dy = surround.dy
        this.component = container.append('path')
            .attr('fill', 'none')
            .attr('stroke-width', '1px')
            .attr('stroke', fill)
            .attr('d', '')
            .attr('id', id)
            .style('cursor', 'pointer');
        var start_theta = Math.random() * (2 * Math.PI - min_width) + min_width;
        var theta_delta_a = Math.random() * (this.length);
        var theta_delta_b = Math.random() * (this.length);
        var theta_delta_c = Math.random() * (this.length);
        var theta_delta_d = Math.random() * (this.length);
        var theta_delta_e = Math.random() * Math.PI / 2
        var theta_delta_f = Math.random() * Math.PI / 2
        var theta_delta_g = Math.random() * Math.PI / 2
        var s = ''
        var current_theta = start_theta

        //A
        s += 'M' + parseInt((this.r + 5 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 5 * this.width) * sin(current_theta) + this.dy)

        //B
        s += 'L' + parseInt((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 4 * this.width) * sin(current_theta) + this.dy)

        //C
        s += arc_to(current_theta, current_theta - theta_delta_a, this.r + 4 * this.width, this.dx, this.dy)
        current_theta = current_theta - theta_delta_a
        s += 'L' + parseInt((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 4 * this.width) * sin(current_theta) + this.dy)

        //D
        s += 'L' + parseInt((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 3 * this.width) * sin(current_theta) + this.dy)

        //E
        s += arc_to(current_theta, current_theta + theta_delta_b, this.r + 3 * this.width, this.dx, this.dy)
        current_theta = current_theta + theta_delta_b
        s += 'L' + parseInt((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 3 * this.width) * sin(current_theta) + this.dy)

        //F
        s += 'L' + parseInt((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 2 * this.width) * sin(current_theta) + this.dy)

        //G
        s += arc_to(current_theta, current_theta - theta_delta_c, this.r + 2 * this.width, this.dx, this.dy)
        current_theta = current_theta - theta_delta_c
        s += 'L' + parseInt((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 2 * this.width) * sin(current_theta) + this.dy)

        //H
        s += 'L' + parseInt((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + this.width) * sin(current_theta) + this.dy)

        //I
        s += arc_to(current_theta, current_theta + theta_delta_d, this.r + this.width, this.dx, this.dy)
        current_theta = current_theta + theta_delta_d
        s += 'L' + parseInt((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + this.width) * sin(current_theta) + this.dy)

        //J
        s += 'L' + parseInt((this.r) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r) * sin(current_theta) + this.dy)

        //K
        s += arc_to(current_theta, current_theta - theta_delta_d - theta_delta_e - this.branch_width, this.r, this.dx, this.dy)
        current_theta = current_theta - theta_delta_d - theta_delta_e - this.branch_width
        s += 'L' + parseInt((this.r) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r) * sin(current_theta) + this.dy)

        //L
        s += 'L' + parseInt((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + this.width) * sin(current_theta) + this.dy)

        //M
        s += arc_to(current_theta, current_theta + theta_delta_e, this.r + this.width, this.dx, this.dy)
        current_theta = current_theta + theta_delta_e
        s += 'L' + parseInt((this.r + this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + this.width) * sin(current_theta) + this.dy)

        //N
        s += 'L' + parseInt((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 2 * this.width) * sin(current_theta) + this.dy)

        //O
        s += arc_to(current_theta, current_theta - theta_delta_f, this.r + 2 * this.width, this.dx, this.dy)
        current_theta = current_theta - theta_delta_f
        s += 'L' + parseInt((this.r + 2 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 2 * this.width) * sin(current_theta) + this.dy)

        //P
        s += 'L' + parseInt((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 3 * this.width) * sin(current_theta) + this.dy)

        //Q
        //x = start_theta - theta_delta_a - this.branch_width - current_theta
        s += arc_to(current_theta, start_theta - theta_delta_a - this.branch_width, this.r + 3 * this.width, this.dx, this.dy)
        current_theta = start_theta - theta_delta_a - this.branch_width
        s += 'L' + parseInt((this.r + 3 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 3 * this.width) * sin(current_theta) + this.dy)

        //R
        s += 'L' + parseInt((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 4 * this.width) * sin(current_theta) + this.dy)

        //S
        s += arc_to(current_theta, current_theta - theta_delta_g, this.r + 4 * this.width, this.dx, this.dy)
        current_theta = current_theta - theta_delta_g
        s += 'L' + parseInt((this.r + 4 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 4 * this.width) * sin(current_theta) + this.dy)

        //T
        s += 'L' + parseInt((this.r + 5 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 5 * this.width) * sin(current_theta) + this.dy)

        //U
        s += arc_to(current_theta, start_theta, this.r + 5 * this.width, this.dx, this.dy)
        current_theta = start_theta
        s += 'L' + parseInt((this.r + 5 * this.width) * cos(current_theta) + this.dx) + ' ' + parseInt((this.r + 5 * this.width) * sin(current_theta) + this.dy)

        this.component.attr('d', s)
    }
    draw() {
        for (var j = 0; j < this.data.length; j++) {
            this.data[j].translate(map(this.noise.getNoise(frameCount * .01 * j), 0, 1, -5, 5), map(this.noise.getNoise(frameCount * .01 * (this.data.length - j)), 0, 1, -5, 5));
        }
    }
}
