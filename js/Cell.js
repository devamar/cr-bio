class Cell {
    constructor() {
        this.data = []
    }
    add(component) {
        if (!(component instanceof Array)) {
          component = [component]
        }
        for (var i = 0; i < component.length; i++) {
            this.data.push(component[i])
        }
    }
    draw() {
        for (var i = 0; i < this.data.length; i++) {
            this.data[i].draw();
        }
    }
    tranformTo(other) {
        this.data[0].transformTo(other.data[0], 3000);
        for (var i = 1; i < this.data.length; i++) {
          var current_comp = this.data[i]
          console.log(current_comp)
          this.data[i].exit(1000, 0);
        }
        global_comp = [];
        active_cell = other;
    }
}
