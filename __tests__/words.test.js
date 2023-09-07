import {jest} from "@jest/globals"

jest.unstable_mockModule("lodash", () => { 
  return {
    default: {
      sample: "TEST"
    }
  }
 })
 
import {getWord, isWord} from '../src/words.js'

describe("test Words", () => { 
    it("test getWord", () => {
      expect(getWord()).toEqual("TEST")
     })

    test('test isWord', () => {
      expect(isWord("ZYMIC")).toEqual(true)
    })
  })
