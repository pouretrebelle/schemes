import { map, wrappedDistance } from './numbers'

describe('map', () => {
  it('returns mapped number', () => {
    expect(map(5, 0, 10, 0, 100)).toEqual(50)
    expect(map(6, 5, 10, 0, 100)).toEqual(20)
    expect(map(5, 0, 10, 100, 200)).toEqual(150)
  })
  it('clamps result', () => {
    expect(map(5, 0, 10, 0, 100, true)).toEqual(50)
    expect(map(-5, 0, 10, 0, 100, true)).toEqual(0)
    expect(map(15, 0, 10, 0, 100, true)).toEqual(100)
  })
})

describe('wrappedDistance', () => {
  it('returns distance', () => {
    expect(wrappedDistance(2, 4, 0, 10)).toEqual(2)
    expect(wrappedDistance(2, 4, 0, 100)).toEqual(2)
    expect(wrappedDistance(6, 8, 0, 100)).toEqual(2)
  })
  it('with wrong order', () => {
    expect(wrappedDistance(4, 2, 0, 10)).toEqual(-2)
    expect(wrappedDistance(4, 2, 0, 100)).toEqual(-2)
    expect(wrappedDistance(8, 6, 0, 100)).toEqual(-2)
  })
  it('wrapped', () => {
    expect(wrappedDistance(2, 8, 0, 10)).toEqual(4)
    expect(wrappedDistance(8, 2, 0, 10)).toEqual(-4)
    expect(wrappedDistance(10, 90, 0, 100)).toEqual(20)
  })
  it('with negative range', () => {
    expect(wrappedDistance(4, 2, -10, 10)).toEqual(-2)
    expect(wrappedDistance(-5, 5, -10, 10)).toEqual(10)
    expect(wrappedDistance(-5, 8, -10, 10)).toEqual(7)
  })
})
