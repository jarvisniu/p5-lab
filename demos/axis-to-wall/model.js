function Point(x = 0, y = 0, label = "") {
  this.x = x
  this.y = y
  this.label = label
  this.toString = function () {
    return `Point(${ this.x }, ${ this.y })`
  }
}

function Edge(p1, p2) {
  this.p1 = p1
  this.p2 = p2
}

function drawEdge(edge) {
  strokeWeight(4)
  stroke(0, 128, 255, 128)
  line(edge.p1.x, edge.p1.y, edge.p2.x, edge.p2.y)
}

function Arc(p1, p2) {
  this.p1 = p1
  this.p2 = p2
  this.angle = function() {
    let dx = this.p2.y - this.p1.y
    let dy = this.p2.x - this.p1.x
    return Math.atan2(dx, dy)
  }
  this.toString = function () {
    return `Arc<${ this.p1 }, ${ this.p2 }>`
  }
}

function drawArc(edge) {
  stroke(0, 128, 128, 255)
  fill(0, 128, 128, 255)
  arrow(edge.p1.x, edge.p1.y, edge.p2.x, edge.p2.y)
}

// 根据边 edges 生成弧 arcs
// 注意：点的弧只记录以此点为起点的那些弧。
function generateArcs(edges) {
  let arcs = []
  edges.forEach(edge => {
    let arc1 = new Arc(edge.p1, edge.p2)
    arcs.push(arc1)
    edge.p1.arcs = edge.p1.arcs || []
    edge.p1.arcs.push(arc1)
    edge.p2.arcs = edge.p2.arcs || []
    // edge.p2.arcs.push(arc1)

    let arc2 = new Arc(edge.p2, edge.p1)
    arcs.push(arc2)
    edge.p1.arcs = edge.p1.arcs || []
    // edge.p1.arcs.push(arc2)
    edge.p2.arcs = edge.p2.arcs || []
    edge.p2.arcs.push(arc2)
  })
  return arcs
}


// 根据弧生成环
// 建立新环和未处理弧列表；
// 任取一个弧，作为新环的第一个边，起点记为环起点，并将此弧标为作废；
// 获取上个弧的终点的所有弧，获取反向向量逆时针旋转遇到的第一个弧，并将此弧加入当前环。
// 检测此弧的终点是否是环起点，不是就一直循环，是就结束此环。
// 如果未处理弧列表不为空，就建立新环，并循环。
function generateLoops(arcs) {
  let rawArcList = copyArray(arcs)
  let loops = []
  do {
    // console.log('arcs', arcs)
    let loop = []
    let selArc = rawArcList[0]
    let loopStartPoint = selArc.p1
    loop.push(selArc)
    rawArcList = rawArcList.filter(item => item !== selArc)
    do {
      selArc = findArc(
        selArc.p2.arcs.filter(item => rawArcList.includes(item)),
        selArc)
      loop.push(selArc)
      rawArcList = rawArcList.filter(item => item !== selArc)
    } while (selArc.p2 !== loopStartPoint)
    loops.push(loop)
    // console.log('loop', loop)
  } while (rawArcList.length > 0)
  // console.log('loops', loops)
  return loops
}

function findArc(arcs, enterArc) {
  let reverseAngle = enterArc.angle() + Math.PI
  arcs.sort((arcA, arcB) => {
    return normAngle(reverseAngle - arcA.angle()) -
      normAngle(reverseAngle - arcB.angle())
  })
  return arcs[0]
}

// 标准化角度到这个范围：(0, 360]
function normAngle(angle) {
  while (angle > Math.PI * 2) angle -= Math.PI * 2
  while (angle <= 0) angle += Math.PI * 2
  // return rd(angle, 3)
  return angle
}

// 环偏移生成轮廓
// 输出结构：roomContours: [
//   [ // roomContour
//     { p1, p2 } // arc -> contourEdge
//   ]
// ]
function generateRoomContours(loops) {
  return loops.map(loop => {
    console.log('map 1')
    // 1.偏移
    let roomContour = loop.map(arc => {
      console.log('map 2')
      let arcAngle = arc.angle()
      let offsetAngle = arcAngle + Math.PI / 2 // TODO 或减
      let thick = 10
      return new Arc(
        new Point(
          arc.p1.x + thick * cos(offsetAngle),
          arc.p1.y + thick * sin(offsetAngle),
        ),
        new Point(
          arc.p2.x + thick * cos(offsetAngle),
          arc.p2.y + thick * sin(offsetAngle),
        ),
      )
    })
    // 2.直线求交连接各边端点
    for (let i = 0, len = roomContour.length; i < len; i++) {
      let arc = roomContour[i]
      let next = roomContour[i + 1 < len ? i + 1 : 0]
      let inters = lineIntersect(
        arc.p1.x, arc.p1.y, arc.p2.x, arc.p2.y,
        next.p1.x, next.p1.y, next.p2.x, next.p2.y)
      if (inters) {
        arc.p2.x = rd(inters.x, 2)
        arc.p2.y = rd(inters.y, 2)
        next.p1.x = rd(inters.x, 2)
        next.p1.y = rd(inters.y, 2)
      } else {
        // 单独的墙轮廓线平行会求交失败，需要插入新线，连接端点
        console.log(`push arc, p1: ${ arc.p2 }, p2: ${ arc.p1 }`)
        roomContour.push(new Arc(
          new Point(arc.p2.x, arc.p2.y),
          new Point(next.p1.x, next.p1.y),
        ))
      }
    }
    return roomContour
  })
}
