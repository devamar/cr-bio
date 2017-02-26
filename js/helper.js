function toolTip(container, initial, final, extension, name) {
    container.selectAll(".tool-tip").remove();
    container.selectAll(".tool-tip-text").remove();
    var d = 40;
    var beta = Math.atan(abs((initial[1] - final[1]) / (initial[0] - final[0])));
    var mx = (final[0] - initial[0]);
    var my = (final[1] - initial[1]);
    if (mx >= 0) {
        if (my <= 0) {
            var nx = final[0] + d * cos(beta);
            var ny = final[1] - d * sin(beta);
            var ext = extension
        } else {
            var nx = final[0] + d * cos(beta);
            var ny = final[1] + d * sin(beta);
            var ext = extension
        }
    } else {
        if (my <= 0) {
            var nx = final[0] - d * cos(beta);
            var ny = final[1] - d * sin(beta);
            var ext = -extension
        } else {
            var nx = final[0] - d * cos(beta);
            var ny = final[1] + d * sin(beta);
            var ext = -extension
        }
    }

    var total_d = d + abs(ext)

    var line = container.append('path')
        .attr('d', 'M' + final[0] + ' ' + final[1] + 'L' + nx + ' ' + ny + ' ' + 'L' + (nx + ext) + ' ' + ny)
        .attr('stroke-dasharray', total_d + ' ' + total_d)
        .attr('stroke-dashoffset', total_d)
        .attr('class', 'tool-tip')
        .style('stroke', 'rgba(0,0,0,1)')
        .style('fill', 'none')
        .style('stroke-width', 1)
        .style('pointer-events', 'none');

    line.transition()
        .duration(750)
        .attr('stroke-dashoffset', '0')

    var text = container.append('text')
        .attr('class', 'tool-tip-text')
        .text(name)
        .attr('x', nx)
        .attr('y', ny - 10)
        .attr('fill', 'rgba(0,0,0,0)')

    text.transition()
        .duration(750)
        .attr('fill', 'rgba(0,0,0,1)')
}

function toolTipRemove(container, extension) {
    var d = 40;
    var total_d = d + abs(extension);
    container.selectAll(".tool-tip").transition()
        .duration(250)
        .attr('stroke-dashoffset', total_d)
    container.selectAll(".tool-tip-text").transition()
        .duration(250)
        .attr('fill', 'rgba(0,0,0,0)')
}

function draw_cell(width, height, na, freq, noise, dx, dy) {
    var s = ''
    for (var theta = 0; theta < 2 * Math.PI; theta += 0.1) {
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
    }
    else {
      for (var theta = start_theta; theta >= end_theta; theta -= increment) {
          var x = radius * cos(theta) + dx
          var y = radius * sin(theta) + dy
          s += 'L' + x + ' ' + y;
      }
    }
    return s
}

function arc_to_s(start_theta, end_theta, radius, dx, dy) {
    s = ''
    increment = 0.1

    end_theta = -end_theta
    if (start_theta <= end_theta) {
        for (var theta = start_theta; theta <= end_theta; theta += increment) {
            var x = radius * cos(theta) + dx
            var y = radius * sin(theta) + dy
            s += 'L' + x + ' ' + y;
        }
    }
    else {
      for (var theta = start_theta; theta >= end_theta; theta -= increment) {
          var x = radius * cos(theta) + dx
          var y = radius * sin(theta) + dy
          s += 'L' + x + ' ' + y;
      }
    }
    return s
}


function CircularNoise(scale) {

    this.offsetX = random(100);
    this.offsetY = random(100);
    this.offsetZ = random(100);
    this.scale = scale;

    this.getNoise = function(radian) {
        var r = radian % Math.PI * 2;
        if (r < 0.0) {
            r += TWO_PI;
        }
        return noise(cNoise.offsetX + cos(r) * scale, cNoise.offsetY + sin(r) * scale);
    }

    this.getNoise = function(radian, time) {
        var r = radian % Math.PI * 2;
        if (r < 0.0) {
            r += TWO_PI;
        }
        return noise(this.offsetX + cos(r) * this.scale, this.offsetY + sin(r) * scale, this.offsetZ + time);
    }
}

function shadeHexColor(color, percent) {
    var f = parseInt(color.slice(1), 16),
        t = percent < 0 ? 0 : 255,
        p = percent < 0 ? percent * -1 : percent,
        R = f >> 16,
        G = f >> 8 & 0x00FF,
        B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}
