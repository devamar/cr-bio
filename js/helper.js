function toolTip(container, initial, final, name) {
    container.selectAll("#tool-tip-line").remove();
    container.selectAll("#tool-tip-text").remove();
    var d = 40;
    var beta = Math.atan(abs((initial[1] - final[1]) / (initial[0] - final[0])));
    var mx = (final[0] - initial[0]);
    var my = (final[1] - initial[1]);
    if (mx >= 0) {
        if (my <= 0) {
            var nx = final[0] + d * cos(beta);
            var ny = final[1] - d * sin(beta);
            var ext = 1
        } else {
            var nx = final[0] + d * cos(beta);
            var ny = final[1] + d * sin(beta);
            var ext = 1
        }
    } else {
        if (my <= 0) {
            var nx = final[0] - d * cos(beta);
            var ny = final[1] - d * sin(beta);
            var ext = -1
        } else {
            var nx = final[0] - d * cos(beta);
            var ny = final[1] + d * sin(beta);
            var ext = -1
        }
    }

    var text = container.append('text')
        .attr('id', 'tool-tip-text')
        .text(name)
        .attr('x', nx)
        .attr('y', ny - 10)
        .attr('fill', 'rgba(0,0,0,0)')

    if (mx < 0) {
        text.attr('text-anchor', 'end');
    }

    text.transition()
        .duration(750)
        .attr('fill', 'rgba(0,0,0,1)')

    var el = document.getElementById('tool-tip-text');
    ext = ext * el.getComputedTextLength();

    var total_d = d + abs(ext)

    var line = container.append('path')
        .attr('d', 'M' + final[0] + ' ' + final[1] + 'L' + nx + ' ' + ny + ' ' + 'L' + (nx + ext) + ' ' + ny)
        .attr('stroke-dasharray', total_d + ' ' + total_d)
        .attr('stroke-dashoffset', total_d)
        .attr('id', 'tool-tip-line')
        .style('stroke', 'rgba(0,0,0,1)')
        .style('fill', 'none')
        .style('stroke-width', 1)
        .style('pointer-events', 'none');

    line.transition()
        .duration(750)
        .attr('stroke-dashoffset', '0')
}

function toolTipRemove(container) {
    var el = document.getElementById('tool-tip-text');
    var ext = el.getComputedTextLength();
    var d = 40;
    var total_d = d + ext;
    container.selectAll("#tool-tip-line").transition()
        .duration(250)
        .attr('stroke-dashoffset', total_d)
    container.selectAll("#tool-tip-text").transition()
        .duration(250)
        .attr('fill', 'rgba(0,0,0,0)')
}

function draw_cell(width, height, na, freq, noise, dx, dy) {
    var s = ''
    for (var theta = 0; theta < TWO_PI; theta += 0.1) {
        var radius_noise = map(noise.getNoise(theta, frameCount * .02), 0, 1, -freq, freq);
        x = pow(abs(cos(theta)), na) * (radius_noise + width) * Math.sign(cos(theta)) + dx;
        y = pow(abs(sin(theta)), na) * (radius_noise + height) * Math.sign(sin(theta)) + dy;
        if (theta == 0) {
            s += 'M' + x + ' ' + y;
        } else {
            s += 'L' + x + ' ' + y;
        }
    }
    return s;
}

function arc_to(start_theta, end_theta, radius, dx, dy) {
    s = ''
    increment = 0.1
    if (start_theta <= end_theta) {
        for (var theta = start_theta; theta <= end_theta; theta += increment) {
            var x = radius * cos(theta) + dx
            var y = radius * sin(theta) + dy
            s += 'L' + x + ' ' + y;
        }
    } else {
        for (var theta = start_theta; theta >= end_theta; theta -= increment) {
            var x = radius * cos(theta) + dx
            var y = radius * sin(theta) + dy
            s += 'L' + x + ' ' + y;
        }
    }
    return s
}

function alt_arc_to(x1, y1, x2, y2, dx, dy) {

    var s = ''
    var radius = sqrt(sq(x1 - x2) + sq(y1 - y2))
    var cx = (x1 + x2) / 2;
    var cy = (y1 + y2) / 2;
    var increment = 0.2;
    for (var theta = 0; theta <= TWO_PI; theta += increment) {
        var x = (radius / 2) * cos(theta) + cx
        var y = (radius / 2) * sin(theta) + cy
        s += 'L' + x + ' ' + y;
    }
    return s
}

function draw_line(x1, y1, length) {
    var s = ''
    for (var x = x1; x <= x1 + 2 * length; x += 0.1) {
        //var noise_a = 10*noise(0.1*(0.1*frameCount + x))
        noise_a = sin(0.1 * frameCount + 0.1 * x)
        if (s == '')
            s += 'M' + (x + noise_a) + ' ' + (y1 + noise_a)
        else
            s += 'L' + (x + noise_a) + ' ' + (y1 + noise_a)
    }
    return s;
}

class BlobNoise {
    constructor(scale) {
        this.dx = random(100);
        this.dy = random(100);
        this.dt = random(100);
        this.scale = scale;
    }
    getNoise(theta, time) {
        return noise(this.dx + cos(theta) * this.scale, this.dy + sin(theta) * scale, this.dt + time);
    }
}

function shadeHexColor(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (round((t - R) * p) + R) * 0x10000 + (round((t - G) * p) + G) * 0x100 + (round((t - B) * p) + B)).toString(16).slice(1);
}
