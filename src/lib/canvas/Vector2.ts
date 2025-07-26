class Vector2 {
  x: number
  y: number

  constructor(x?: number, y?: number) {
    this.x = x || 0
    this.y = y || 0
  }

  _reset = (x: number, y: number) => {
    this.x = x
    this.y = y
    return this
  }

  _toString = (decPlaces: number): string => {
    decPlaces = decPlaces || 3
    const scalar = Math.pow(10, decPlaces)
    return `${Math.round(this.x * scalar) / scalar}, ${
      Math.round(this.y * scalar) / scalar
    }]`
  }

  _clone = () => {
    return new Vector2(this.x, this.y)
  }

  _copyTo = (v: Vector2) => {
    v.x = this.x
    v.y = this.y
  }

  _copyFrom = (v: Vector2) => {
    this.x = v.x
    this.y = v.y
  }

  _magnitude = () => {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  _magnitudeSquared = () => {
    return this.x * this.x + this.y * this.y
  }

  _normalise = () => {
    const m = this._magnitude()
    this.x = this.x / m
    this.y = this.y / m
    return this
  }

  _reverse = () => {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  _plusEq = (v: Vector2) => {
    this.x += v.x
    this.y += v.y
    return this
  }

  _plusNew = (v: Vector2) => {
    return new Vector2(this.x + v.x, this.y + v.y)
  }

  _minusEq = (v: Vector2) => {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  _minusNew = (v: Vector2) => {
    return new Vector2(this.x - v.x, this.y - v.y)
  }

  _multiplyEq = (scalar: number) => {
    this.x *= scalar
    this.y *= scalar
    return this
  }

  _multiplyNew = (scalar: number) => {
    const returnvec = this._clone()
    return returnvec._multiplyEq(scalar)
  }

  _divideEq = (scalar: number) => {
    this.x /= scalar
    this.y /= scalar
    return this
  }

  _divideNew = (scalar: number) => {
    const returnvec = this._clone()
    return returnvec._divideEq(scalar)
  }

  _dot = (v: Vector2) => {
    return this.x * v.x + this.y * v.y
  }

  _angle = (useDegrees?: boolean) => {
    return (
      Math.atan2(this.y, this.x) * (useDegrees ? Vector2Const._TO_DEGREES : 1)
    )
  }

  _rotate = (angle: number, useDegrees?: boolean) => {
    const cosRY = Math.cos(angle * (useDegrees ? Vector2Const._TO_RADIANS : 1))
    const sinRY = Math.sin(angle * (useDegrees ? Vector2Const._TO_RADIANS : 1))
    Vector2Const._temp._copyFrom(this)
    this.x = Vector2Const._temp.x * cosRY - Vector2Const._temp.y * sinRY
    this.y = Vector2Const._temp.x * sinRY + Vector2Const._temp.y * cosRY
    return this
  }

  _equals = (v: Vector2) => {
    return this.x === v.x && this.y === v.y
  }

  _isCloseTo = (v: Vector2, tolerance: number) => {
    if (this._equals(v)) return true
    Vector2Const._temp._copyFrom(this)
    Vector2Const._temp._minusEq(v)
    return Vector2Const._temp._magnitudeSquared() < tolerance * tolerance
  }

  _rotateAroundPoint = (
    point: Vector2,
    angle: number,
    useDegrees?: boolean
  ) => {
    Vector2Const._temp._copyFrom(this)
    Vector2Const._temp._minusEq(point)
    Vector2Const._temp._rotate(angle, useDegrees)
    Vector2Const._temp._plusEq(point)
    this._copyFrom(Vector2Const._temp)
  }

  _isMagLessThan = (distance: number) => {
    return this._magnitudeSquared() < distance * distance
  }

  _isMagGreaterThan = (distance: number) => {
    return this._magnitudeSquared() > distance * distance
  }

  _dist = (v: Vector2) => {
    return this._minusNew(v)._magnitude()
  }
}

const Vector2Const = {
  _TO_DEGREES: 180 / Math.PI,
  _TO_RADIANS: Math.PI / 180,
  _temp: new Vector2(),
}

export default Vector2
