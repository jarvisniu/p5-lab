let p1 = new Point(220, 170, '1')
let p2 = new Point(180, 70, '2')
let p3 = new Point(120, 70, '3')
let p4 = new Point(120, 170, '4')
let p5 = new Point(20, 70, '5')
let p6 = new Point(20, 170, '6')
let p7 = new Point(20, 210, '7')

// 原始数据
let points = [p1, p2, p3, p4, p5, p6, p7]
let edges = [
  new Edge(p1, p2),
  new Edge(p2, p3),
  new Edge(p3, p4),
  new Edge(p4, p1),
  new Edge(p3, p5),
  new Edge(p5, p6),
  new Edge(p6, p4),
  new Edge(p6, p7),
]
// 计算数据
let arcs
let loops
let roomContours

function setup() {
  createCanvas(400, 400)
  background(220)
  textAlign(LEFT, TOP)
  frameRate(3)

  arcs = generateArcs(edges)
  // arcs.forEach((arc,i) => {
  //   console.log('arc ' + i + ': ' + arc)
  // })
  loops = generateLoops(arcs)
  // loops.forEach((loop,i) => {
  //   console.log(`loop ${ i + 1 }`)
  //   loop.forEach((arc, arcIndex) => {
  //     console.log(`${ arcIndex + 1 }: ${ arc }`)
  //   })
  // })
  // console.log('loops.length', loops.length)
  roomContours = generateRoomContours(loops)
  // console.log('roomContours', roomContours)
  // log roomContours
  roomContours.forEach((arcs,i) => {
    console.log(`roomContours ${ i + 1 }`)
    arcs.forEach((arc, arcIndex) => {
      console.log(`${ arcIndex + 1 }: ${ arc }`)
    })
  })
}

let selLoopIndex = 0
let arcIndex = 0

function draw() {
  clear()

  // 绘制中轴线交点
  strokeWeight(1)
  stroke(120, 120, 120, 128)
  points.forEach(point => {
    text(point.label, point.x + 2, point.y + 2)
  })

  // 绘制中轴线
  edges.forEach(edge => {
    line(edge.p1.x, edge.p1.y, edge.p2.x, edge.p2.y)
  })

  // 绘制环
  arcIndex += 1
  fill('black')
  text(`当前环: ${ selLoopIndex + 1 } / ${ loops.length } (按左右键切换)`, 10, 30)
  if (arcIndex >= loops[selLoopIndex].length) {
    arcIndex = 0
  }
  drawArc(loops[selLoopIndex][arcIndex])

  // 绘制房间轮廓
  strokeWeight(1)
  stroke('pink')
  roomContours.forEach(arcs => {
    arcs.forEach(arc => {
      line(arc.p1.x, arc.p1.y, arc.p2.x, arc.p2.y)
    })
  })
}

function keyPressed () {
  if (keyCode === RIGHT_ARROW) {
    selLoopIndex += 1
    if (selLoopIndex === loops.length) selLoopIndex = 0
    arcIndex = 0
  } else if (keyCode === LEFT_ARROW) {
    selLoopIndex -= 1
    if (selLoopIndex === -1) selLoopIndex = loops.length - 1
    arcIndex = 0
  }
}
