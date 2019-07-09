import { Component, h, State } from "@stencil/core";

@Component({
  tag: "app-home",
  styleUrl: "app-home.css",
  shadow: false
})
export class AppHome {
  canvas: HTMLCanvasElement;

  @State()
  windowWidth: number;

  @State()
  windowHeight: number;

  interval: number;

  baseCubePoints: number[][] = [
    [-1, -1, -1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1],
    [1, 1, -1],
    [1, -1, 1],
    [-1, 1, 1],
    [1, 1, 1]
  ];

  edges: number[][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [7, 6],
    [7, 5],
    [7, 4],
    [1, 4],
    [1, 5],
    [6, 2],
    [6, 3],
    [2, 4],
    [5, 3]
  ];

  projectedCubePoints: number[][] = [[], [], [], [], [], [], [], []];

  deg = 0.005;

  velX = 0;
  velY = 0;

  componentWillLoad() {
    this.fetchViewportDimensions();
    this.baseToProjected();
    this.projectedCubePoints.forEach(point =>
      console.log(this.pointToCoord(point))
    );
    window.onkeydown = ev => {
      switch (ev.key) {
        case "ArrowDown":
          this.velX += this.deg;
          break;
        case "ArrowUp":
          this.velX -= this.deg;
          break;
        case "ArrowLeft":
          this.velY += this.deg;
          break;
        case "ArrowRight":
          this.velY -= this.deg;
          break;
      }
    };
  }

  componentDidLoad() {
    this.interval = setInterval(() => {
      this.fetchViewportDimensions();
      this.draw();
    }, 3);
  }

  baseToProjected() {
    for (let i = 0; i < this.baseCubePoints.length; i++) {
      this.projectedCubePoints[i][0] = this.baseCubePoints[i][0];
      this.projectedCubePoints[i][1] = this.baseCubePoints[i][1];
      this.projectedCubePoints[i][2] = this.baseCubePoints[i][2] + 50;
    }
  }

  rotateX(deg) {
    for (const point of this.baseCubePoints) {
      point[1] = Math.cos(deg) * point[1] + Math.sin(deg) * point[2];
      point[2] = -Math.sin(deg) * point[1] + Math.cos(deg) * point[2];
    }
  }

  rotateY(deg) {
    for (const point of this.baseCubePoints) {
      point[0] = Math.cos(deg) * point[0] - Math.sin(deg) * point[2];
      point[2] = Math.sin(deg) * point[0] + Math.cos(deg) * point[2];
    }
  }

  rotateZ(deg) {
    for (const point of this.baseCubePoints) {
      point[0] = Math.cos(deg) * point[0] + Math.sin(deg) * point[1];
      point[1] = -Math.sin(deg) * point[0] + Math.cos(deg) * point[1];
    }
  }

  handleVelocityChanges() {
    this.velX *= 0.99;
    this.velY *= 0.99;
  }

  fetchViewportDimensions() {
    this.windowWidth = window.innerWidth * 0.99;
    this.windowHeight = window.innerHeight * 0.99;
  }

  pointToCoord(point: number[]) {
    return {
      x: point[0] * (7 / point[2]) * this.windowWidth + this.windowWidth * 0.5,
      y: point[1] * (7 / point[2]) * this.windowWidth + this.windowWidth * 0.25
    };
  }

  drawEdge(point1: number, point2: number) {
    const coords1 = this.pointToCoord(this.projectedCubePoints[point1]);
    const coords2 = this.pointToCoord(this.projectedCubePoints[point2]);
    const ctx = this.canvas.getContext("2d");
    ctx.beginPath();
    ctx.moveTo(coords1.x, coords1.y);
    ctx.lineTo(coords2.x, coords2.y);
    ctx.stroke();
  }

  drawPoint(point: number[]) {
    const ctx = this.canvas.getContext("2d");
    const coords = this.pointToCoord(point);
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 7.5, 0, 2 * Math.PI);
    ctx.fill();
  }

  draw() {
    const ctx = this.canvas.getContext("2d");

    ctx.clearRect(0, 0, this.windowWidth, this.windowHeight);
    ctx.lineWidth = 5;

    this.handleVelocityChanges();
    this.baseToProjected();
    this.rotateX(this.velX);
    this.rotateY(this.velY);

    for (const point of this.projectedCubePoints) {
      this.drawPoint(point);
    }

    for (const edge of this.edges) {
      this.drawEdge(edge[0], edge[1]);
    }
  }

  render() {
    return (
      <div class="app-home">
        <canvas
          ref={el => (this.canvas = el)}
          width={this.windowWidth}
          height={this.windowHeight}
        />
      </div>
    );
  }
}
