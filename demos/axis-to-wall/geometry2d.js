// 二维计算几何算法

// 直线求交点
// 特殊情况(重合和平行)都会返回null，没有区分
function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
  let dx12 = x1 - x2
  let dx34 = x3 - x4
  let dy12 = y1 - y2
  let dy34 = y3 - y4
  let d = dx12 * dy34 - dy12 * dx34
  if (d < 1 && d > -1) return null

  let xy12 = x1 * y2 - y1 * x2
  let xy34 = x3 * y4 - y3 * x4
  return {
    x: (xy12 * dx34 - dx12 * xy34) / d,
    y: (xy12 * dy34 - dy12 * xy34) / d,
  }
}
