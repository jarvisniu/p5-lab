// 数独游戏(基于p5.js)

let OFFSET_X = 60
let OFFSET_Y = 60
let CELL_SIZE = 30

let cells = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]
let fixed = cells.map(line => line.map(n => Math.sign(n)))
let errors = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
]
let selIndexX = -1
let selIndexY = -1

function setup () {
  createCanvas(400, 400)
  textAlign(CENTER, CENTER)
  textFont('DengXian')
  textSize(18)
  textWidth(3)
}

function draw () {
  // 背景(清空)
  background('#eee')
  // 选中格子
  noStroke()
  fill('#eebb99')
  if (selIndexX > -1 && selIndexY > -1) {
    rect(
      OFFSET_X + CELL_SIZE * selIndexX,
      OFFSET_Y + CELL_SIZE * selIndexY,
      CELL_SIZE, CELL_SIZE,
    )
  }
  // 格子
  stroke('black')
  for (let i = 0; i < 10; i++) {
    strokeWeight(i % 3 == 0 ? 3 : 1)
    line(
      OFFSET_X + CELL_SIZE * i, OFFSET_Y,
      OFFSET_X + CELL_SIZE * i, OFFSET_Y + CELL_SIZE * 9,
    )
  }
  for (let j = 0; j < 10; j++) {
    strokeWeight(j % 3 == 0 ? 3 : 1)
    line(
      OFFSET_X, OFFSET_Y + CELL_SIZE * j,
      OFFSET_X + CELL_SIZE * 9, OFFSET_Y + CELL_SIZE * j,
    )
  }
  // 标题
  fill('black')
  noStroke()
  textStyle(NORMAL)
  text('数独', OFFSET_X + CELL_SIZE * 4.5, OFFSET_Y / 2)
  // 格内数字
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      textStyle(fixed[j][i] ? BOLD: NORMAL)
      fill(errors[j][i] == 1 ? 'red': 'black')
      text(
        label(cells[j][i]),
        OFFSET_X + CELL_SIZE * (i + 0.5),
        OFFSET_Y + CELL_SIZE * (j + 0.5),
      )
    }
  }
}

function keyPressed (e) {
  if (selIndexX * selIndexY >= 0) {
    if (e.key == 'Backspace') {
      if (cells[selIndexY][selIndexX] < 10) cells[selIndexY][selIndexX] = 0
    } else if (/[1-9]/.test(e.key)) {
      if (!fixed[selIndexY][selIndexX]) {
        cells[selIndexY][selIndexX] = +e.key
      }
    }
    refreshStatus()
  }
}

function mousePressed (e) {
  let indexX = Math.floor((e.offsetX - OFFSET_X) / CELL_SIZE)
  let indexY = Math.floor((e.offsetY - OFFSET_Y) / CELL_SIZE)
  if (indexX * indexY < 0) {
    selIndexX = selIndexY = -1
  } else if (indexX < 9 && indexY < 9 && !fixed[indexY][indexX]) {
    selIndexX = indexX
    selIndexY = indexY
  }
}

function refreshStatus () {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      errors[j][i] = 0
    }
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      // 行
      for (let i2 = 0; i2 < 9; i2++) {
        if (i2 != i && equal(cells[j][i2], cells[j][i])) errors[j][i] = 1
      }
      // 列
      for (let j2 = 0; j2 < 9; j2++) {
        if (j2 != j && equal(cells[j2][i], cells[j][i])) errors[j][i] = 1
      }
      // 宫格
      let iStart = Math.floor(i / 3) * 3
      let jStart = Math.floor(j / 3) * 3
      for (let i2 = iStart; i2 < iStart + 3; i2++) {
        for (let j2 = jStart; j2 < jStart + 3; j2++) {
          if ((i2 != i || j2 != j) && equal(cells[j2][i2], cells[j][i])) errors[j][i] = 1
        }
      }
    }
  }
}

function label(n) {
  if (n == 0) return ''
  else return n
}

function equal(a, b) {
  if (a * b < 0) return false
  return a == b
}
