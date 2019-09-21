// constants ------------------------------------------------------------------

const DEGREE = 180 / Math.PI
const RADIAN = Math.PI / 180

// draw methods ---------------------------------------------------------------

function arrow (x1, y1, x2, y2) {
  strokeWeight(2)
  line(x1, y1, x2, y2)
  let angleTo2From = Math.atan2(y1 - y2, x1 - x2)
  let angleArrowLeft = angleTo2From - Math.PI / 9
  let angleArrowRight = angleTo2From + Math.PI / 9
  let arrowLeftPointX = x2 + 6 * Math.cos(angleArrowLeft)
  let arrowLeftPointY = y2 + 6 * Math.sin(angleArrowLeft)
  let arrowRightPointX = x2 + 6 * Math.cos(angleArrowRight)
  let arrowRightPointY = y2 + 6 * Math.sin(angleArrowRight)
  triangle(x2, y2, arrowLeftPointX, arrowLeftPointY,
           arrowRightPointX, arrowRightPointY)
}

function polyline () {
  let pts = arguments
  if (pts.length < 2) return

  strokeWeight(1)
  stroke(120, 120, 120, 128)
  beginShape()
  for (let i = 0; i < pts.length; i++) {
    vertex(pts[i].x, pts[i].y)
  }
  endShape(CLOSE)
}

// utils ----------------------------------------------------------------------

function copyArray (arr) {
  let newArr = []
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i])
  }
  return newArr
}

function rd(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
