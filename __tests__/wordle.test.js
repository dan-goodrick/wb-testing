import { jest } from "@jest/globals";
const mockIsWord = jest.fn(() => true);
jest.unstable_mockModule("../src/words.js", () => {
  return {
    getWord: jest.fn(() => "APPLE"),
    isWord: mockIsWord,
  };
});

const { Wordle, buildLetter } = await import("../src/wordle.js");
describe("test buildLetter", () => {
  test("returns a letter object", () => {
    expect(buildLetter("a", "test")).toEqual({ letter: "a", status: "test" });
  });
});
describe("test Wordle Constructor", () => {
  it("validates maxGuesses default", () => {
    const wordle = new Wordle();
    expect(wordle.maxGuesses).toEqual(6);
  }),
    it("validates maxGuesses args", () => {
      const maxGuesses = 1200;
      const wordle = new Wordle(maxGuesses);
      expect(wordle.maxGuesses).toEqual(maxGuesses);
    }),
    it("validates default word array length is 6", () => {
      const wordle = new Wordle();
      expect(wordle.guesses.length).toEqual(6);
    }),
    it("validates word array length is maxGuesses", () => {
      const maxGuesses = 12;
      const wordle = new Wordle(maxGuesses);
      expect(wordle.guesses.length).toEqual(maxGuesses);
    }),
    it("tests that currGuess is 0", () => {
      const wordle = new Wordle();
      expect(wordle.currGuess).toEqual(0);
    });
  it("tests mock getWord", () => {
    const wordle = new Wordle();
    expect(wordle.word).toEqual("APPLE");
  });
});

describe("Test buildGuessFromWord", () => {
  it("tests A _ _ _ _", () => {
    const wordle = new Wordle();
    const statuses = wordle.buildGuessFromWord("A____");
    const answers = [
      { letter: "A", status: "CORRECT" },
      { letter: "_", status: "ABSENT" },
      { letter: "_", status: "ABSENT" },
      { letter: "_", status: "ABSENT" },
      { letter: "_", status: "ABSENT" },
    ];
    for (let i in statuses) {
      expect(statuses[i]).toEqual(answers[i]);
    }
  }),
    it("tests E _ _ _ _", () => {
      const wordle = new Wordle();
      const statuses = wordle.buildGuessFromWord("E____");
      const answers = [
        { letter: "E", status: "PRESENT" },
        { letter: "_", status: "ABSENT" },
        { letter: "_", status: "ABSENT" },
        { letter: "_", status: "ABSENT" },
        { letter: "_", status: "ABSENT" },
      ];
      for (let i in statuses) {
        expect(statuses[i]).toEqual(answers[i]);
      }
    }),
    it("tests Z _ _ _ _", () => {
      const wordle = new Wordle();
      const statuses = wordle.buildGuessFromWord("Z____");
      const answers = [
        { letter: "E", status: "PRESENT" },
        { letter: "_", status: "ABSENT" },
        { letter: "_", status: "ABSENT" },
        { letter: "_", status: "ABSENT" },
        { letter: "_", status: "ABSENT" },
      ];
      statuses.forEach((e) => {
        expect(e.status).toEqual("ABSENT");
      });
    });
});

describe("Test appendGuess", () => {
  test("no more guesses", () => {
    const wordle = new Wordle(1);
    wordle.appendGuess("A____");
    expect(() => wordle.appendGuess("GUESS")).toThrow();
  }),
    test("tests guess length", () => {
      const wordle = new Wordle();
      expect(() => wordle.appendGuess("APPLES")).toThrow();
      expect(() => wordle.appendGuess("APPL")).toThrow();
    }),
    test("tests if guess is a word", () => {
      mockIsWord.mockReturnValueOnce(false);// EVERY GUESS WILL THROW AN ERROR
      const wordle = new Wordle();
      expect(() => wordle.appendGuess("APPLE")).toThrow();
    }),
    it("tests increment guess", () => {
      const wordle = new Wordle();
      wordle.appendGuess("GUESS");
      expect(wordle.currGuess).toEqual(1);
    }),
    test('appends the result of buildGuessFromWord to the guesses array', () => { 
      const wordle = new Wordle();
      const word = "STRAW"
      wordle.appendGuess(word)
      expect(wordle.guesses[0]).toEqual(wordle.buildGuessFromWord(word))
    })
    test("lower case guesses", () => { 
      const wordle = new Wordle();
      const word = "A____"
      wordle.appendGuess(word)
      expect(wordle.guesses[0][0]).toEqual({letter: "A", status: "CORRECT"})
      })
});

describe("Test isSolved", () => { 
  test("solved puzzle", () => { 
    const wordle = new Wordle();
    wordle.appendGuess("APPLE")
    expect(wordle.isSolved()).toBe(true)
   }),
  test("solved puzzle", () => { 
    const wordle = new Wordle();
    wordle.appendGuess("guess")
    expect(wordle.isSolved()).toBe(false)
   })
 })
describe("Test shouldEndGame", () => { 
  test("last guess is correct", () => { 
    const wordle = new Wordle(1);
    wordle.appendGuess("APPLE")
    expect(wordle.shouldEndGame()).toBe(true)
   }),
  test("no guesses left", () => { 
    const wordle = new Wordle(1);
    wordle.appendGuess("guess")
    expect(wordle.shouldEndGame()).toBe(true)
   }),
   test("no guesses made", () => { 
     const wordle = new Wordle();
     expect(wordle.shouldEndGame()).toBe(false)
    }),
    test("still guesses left", () => { 
      const wordle = new Wordle();
      wordle.appendGuess("guess")
      expect(wordle.shouldEndGame()).toBe(false)
     })
 })