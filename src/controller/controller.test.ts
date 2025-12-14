import { Controller } from "./controller";
import { IModel } from "../model/IModel";
import { IView } from "../view/IView";
import { DEFAULT_DELAY, MOVES, PARTICIPANTS } from "../utils/dataUtils";
import { Move } from "../utils/dataObjectUtils";

interface ControllerWithPrivates {
  updateScoreView(): void;
  updateTaraView(): void;
  updateTaraButtonView(): void;
}

interface ModelWithPrivates {
  resetMoves(): void;
  registerPlayerMove(move: Move): void;
}

describe("Controller", () => {
  let mockModel: jest.Mocked<IModel>;
  let mockView: jest.Mocked<IView>;
  let controller: Controller;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id=${MOVES.ROCK}></button>
      <button id=${MOVES.PAPER}></button>
      <button id=${MOVES.SCISSORS}></button>
      <button id=${MOVES.TARA}></button>
    `;

    // Create fully typed jest mocks
    mockModel = {
      getPlayerScore: jest.fn().mockReturnValue(0),
      getComputerScore: jest.fn().mockReturnValue(0),
      setPlayerScore: jest.fn(),
      setComputerScore: jest.fn(),
      getPlayerMove: jest.fn().mockReturnValue(MOVES.ROCK),
      getComputerMove: jest.fn().mockReturnValue(MOVES.SCISSORS),
      registerPlayerMove: jest.fn(),
      chooseComputerMove: jest.fn(),
      evaluateRound: jest.fn().mockReturnValue("You win!"),
      resetMoves: jest.fn(),
      getPlayerTaraCount: jest.fn().mockReturnValue(0),
      getComputerTaraCount: jest.fn().mockReturnValue(0),
      taraIsEnabled: jest.fn(),
      isTaraButtonVisible: jest.fn(),
      resetTaras: jest.fn(),
      getPlayerMostCommonMove: jest.fn(),
      getComputerMostCommonMove: jest.fn(),
      resetBothMoveCounts: jest.fn(),
      resetMostCommonMoves: jest.fn(),
      showMostCommonMove: jest.fn(),
      isMatchActive: jest.fn(),
      isMatchOver: jest.fn(),
      handleMatchWin: jest.fn(),
      incrementMatchNumber: jest.fn(),
      increaseRoundNumber: jest.fn(),
      getRoundNumber: jest.fn().mockReturnValue(1),
      getMatchNumber: jest.fn().mockReturnValue(1),
      setMatch: jest.fn(),
      setDefaultMatchData: jest.fn(),
      resetHistories: jest.fn(),
      resetMatchData: jest.fn(),
      getHealth: jest.fn(),
      resetScores: jest.fn(),
    };

    mockView = {
      activateSpinner: jest.fn(),
      bindStartGame: jest.fn(),
      bindPlayAgain: jest.fn(),
      bindResetGame: jest.fn(),
      bindPlayerMove: jest.fn(),
      updateMessage: jest.fn(),
      updateScores: jest.fn(),
      updateRound: jest.fn(),
      updateMatch: jest.fn(),
      showRoundOutcome: jest.fn(),
      showMatchOutcome: jest.fn(),
      toggleMoveButtons: jest.fn(),
      togglePlayAgain: jest.fn(),
      updateTaraCounts: jest.fn(),
      updateTaraButton: jest.fn(),
      updateMostCommonMoves: jest.fn(),
      updatePlayAgainButton: jest.fn(),
      resetForNextRound: jest.fn(),
      updateScoreView: jest.fn(),
      updateTaraView: jest.fn(),
      updateTaraButtonView: jest.fn(),
      toggleControls: jest.fn(),
      toggleGameStats: jest.fn(),
      updateHealth: jest.fn(),
      updateHealthBar: jest.fn(),
      updateStartButton: jest.fn(),
    };

    controller = new Controller(mockModel, mockView);

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("initialize updates the message and scores", async () => {
    const initializationPromise = controller.initialize();
    expect(mockView.updateScores).toHaveBeenCalled();

    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    expect(mockView.updateMessage).toHaveBeenCalledWith(
      "Rock, Paper, Scissors, Tara"
    );
    expect(mockView.activateSpinner).toHaveBeenCalledWith(false);
  });

  test("initialize calls view.updateMostCommonMoves when both most common moves exist", () => {
    mockModel.getPlayerMostCommonMove.mockReturnValue(MOVES.ROCK);
    mockModel.getComputerMostCommonMove.mockReturnValue(MOVES.PAPER);
    mockView.updateMostCommonMoves = jest.fn();

    controller.initialize();
    expect(mockView.updateMostCommonMoves).toHaveBeenCalledWith(
      MOVES.ROCK,
      MOVES.PAPER
    );
  });

  test("initialize calls updateMostCommonMoves when one move is present", () => {
    mockModel.getPlayerMostCommonMove.mockReturnValue(null);
    mockModel.getComputerMostCommonMove.mockReturnValue(MOVES.PAPER);
    mockView.updateMostCommonMoves = jest.fn();

    controller.initialize();
    expect(mockView.updateMostCommonMoves).toHaveBeenCalledWith(
      null,
      MOVES.PAPER
    );
  });

  test("endRound calls view.updateMostCommonMoves when both most common moves exist", () => {
    mockModel.getPlayerMostCommonMove.mockReturnValue(MOVES.ROCK);
    mockModel.getComputerMostCommonMove.mockReturnValue(MOVES.SCISSORS);
    mockView.updateMostCommonMoves = jest.fn();

    controller.initialize();
    document.getElementById(MOVES.PAPER)!.click();

    expect(mockView.updateMostCommonMoves).toHaveBeenCalledWith(
      MOVES.ROCK,
      MOVES.SCISSORS
    );
  });

  test("initialize sets Tara button state (updateTaraButton) only AFTER rendering buttons (bindPlayerMove)", async () => {
    // ARRANGE: Ensure the model indicates Tara is disabled initially
    mockModel.taraIsEnabled.mockReturnValue(false);

    // ACT: Run the initialization process
    const initializationPromise = controller.initialize();

    // Advance timers past the internal delay to allow async logic to proceed
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    // ASSERT 1: The correct state was passed (initially disabled)
    expect(mockView.updateTaraButton).toHaveBeenCalledWith(false);

    // ASSERT 2: The order of calls is correct.
    // We check the internal call order property of the mock functions.

    const bindPlayerMoveCallOrder =
      mockView.bindPlayerMove.mock.invocationCallOrder[0];
    const updateTaraButtonCallOrder =
      mockView.updateTaraButton.mock.invocationCallOrder[0];

    // bindPlayerMove (rendering) must happen before updateTaraButton (setting state)
    expect(updateTaraButtonCallOrder).toBeGreaterThan(bindPlayerMoveCallOrder);
  });

  // ===== Move Tests =====

  test("clicking rock button calls registerPlayerMove with 'rock'", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    const playerMoveHandler = mockView.bindPlayerMove.mock.calls[0][0];
    playerMoveHandler(MOVES.ROCK);
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.ROCK);
  });

  test("clicking paper button calls registerPlayerMove with 'paper'", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    const playerMoveHandler = mockView.bindPlayerMove.mock.calls[0][0];
    playerMoveHandler(MOVES.PAPER);
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.PAPER);
  });

  test("clicking scissors button calls registerPlayerMove with 'scissors'", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    const playerMoveHandler = mockView.bindPlayerMove.mock.calls[0][0];
    playerMoveHandler(MOVES.SCISSORS);
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.SCISSORS);
  });

  test("clicking tara button calls registerPlayerMove with 'tara'", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    const playerMoveHandler = mockView.bindPlayerMove.mock.calls[0][0];
    playerMoveHandler(MOVES.TARA);
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.TARA);
  });

  test("clicking a move button triggers computer to choose a move", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    const playerMoveHandler = mockView.bindPlayerMove.mock.calls[0][0];
    playerMoveHandler(MOVES.ROCK);
    expect(mockModel.chooseComputerMove).toHaveBeenCalled();
  });

  test("clicking a move button displays outcome and toggles UI", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    const playerMoveHandler = mockView.bindPlayerMove.mock.calls[0][0];
    playerMoveHandler(MOVES.ROCK);

    jest.advanceTimersByTime(DEFAULT_DELAY);
    await Promise.resolve();

    jest.advanceTimersByTime(DEFAULT_DELAY / 2);
    await Promise.resolve();

    expect(mockView.showRoundOutcome).toHaveBeenCalledWith(
      MOVES.ROCK,
      MOVES.SCISSORS,
      "You win!"
    );
    expect(mockView.toggleMoveButtons).toHaveBeenCalledWith(false);
    expect(mockView.togglePlayAgain).toHaveBeenCalledWith(true);
    expect(mockView.updateScores).toHaveBeenCalledWith(0, 0);
    expect(mockView.updateTaraCounts).toHaveBeenCalledWith(0, 0);
    expect(mockView.updateTaraButton).toHaveBeenCalled();
  });

  test("Clicking a move button makes move buttons disappear", async () => {
    const initializationPromise = controller.initialize();
    jest.advanceTimersByTime(DEFAULT_DELAY);
    await initializationPromise;

    document.getElementById(MOVES.SCISSORS)!.click();
    expect(mockView.toggleMoveButtons).toHaveBeenCalledWith(false);
  });

  test("should call resetMoves before registerPlayerMove", () => {
    const resetMoves = jest.spyOn(
      controller["model"] as unknown as ModelWithPrivates,
      "resetMoves"
    );

    const registerPlayerMove = jest.spyOn(
      controller["model"] as unknown as ModelWithPrivates,
      "registerPlayerMove"
    );

    controller.handlePlayerMove(MOVES.SCISSORS);

    const resetCall = resetMoves.mock.invocationCallOrder[0];
    const setMoveCall = registerPlayerMove.mock.invocationCallOrder[0];

    expect(resetCall).toBeLessThan(setMoveCall);
  });

  test("resetGameState should reset model and update view", () => {
    const updateScoreView = jest.spyOn(
      controller as unknown as ControllerWithPrivates,
      "updateScoreView"
    );
    const updateTaraView = jest.spyOn(
      controller as unknown as ControllerWithPrivates,
      "updateTaraView"
    );
    const updateTaraButtonView = jest.spyOn(
      controller as unknown as ControllerWithPrivates,
      "updateTaraButtonView"
    );

    controller.resetGameState();
    jest.advanceTimersByTime(DEFAULT_DELAY * 1.5);

    expect(mockModel.resetScores).toHaveBeenCalled();
    expect(mockModel.resetMoves).toHaveBeenCalled();
    expect(mockModel.resetTaras).toHaveBeenCalled();
    expect(mockModel.resetHistories).toHaveBeenCalled();
    expect(mockModel.resetBothMoveCounts).toHaveBeenCalled();
    expect(mockModel.resetMostCommonMoves).toHaveBeenCalled();

    expect(updateScoreView).toHaveBeenCalled();
    expect(updateTaraView).toHaveBeenCalled();
    expect(updateTaraButtonView).toHaveBeenCalled();
  });

  test("startGame performs initial game setup with correct view updates", () => {
    const initialRoundNumber = 1;
    const initialMatchNumber = 1;
    const showMostCommonMove = true; // Example value

    mockModel.getRoundNumber.mockReturnValue(initialRoundNumber);
    mockModel.getMatchNumber.mockReturnValue(initialMatchNumber);
    mockModel.showMostCommonMove.mockReturnValue(showMostCommonMove);
    mockModel.setDefaultMatchData.mockImplementation(() => {});

    // Mock all view methods that startGame interacts with
    mockView.updateRound.mockImplementation(() => {});
    mockView.updateMatch.mockImplementation(() => {});
    mockView.toggleControls.mockImplementation(() => {});
    mockView.toggleGameStats.mockImplementation(() => {});
    mockView.toggleMoveButtons.mockImplementation(() => {});

    controller["startGame"]();

    // Expected assertions
    expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
    expect(mockView.updateRound).toHaveBeenCalledWith(initialRoundNumber);
    expect(mockView.updateMatch).toHaveBeenCalledWith(initialMatchNumber);
    expect(mockView.toggleControls).toHaveBeenCalledWith(false);
    expect(mockView.toggleGameStats).toHaveBeenCalledWith(true);
    expect(mockView.toggleMoveButtons).toHaveBeenCalledWith(true);
  });

  describe("endRound", () => {
    test("endRound should proceed to next round if match is not over", () => {
      mockModel.getPlayerMove.mockReturnValue("rock");
      mockModel.getComputerMove.mockReturnValue("scissors");
      mockModel.evaluateRound.mockReturnValue("You win the round!");
      mockModel.isMatchOver.mockReturnValue(false);
      mockModel.increaseRoundNumber.mockImplementation(() => {});
      mockModel.getRoundNumber.mockReturnValue(2);

      controller["endRound"]();

      expect(mockView.showRoundOutcome).toHaveBeenCalledWith(
        "rock",
        "scissors",
        "You win the round!"
      );
      expect(mockModel.increaseRoundNumber).toHaveBeenCalled();
      expect(mockModel.incrementMatchNumber).not.toHaveBeenCalled();
      expect(mockModel.setMatch).not.toHaveBeenCalled();
      expect(mockView.showMatchOutcome).not.toHaveBeenCalled();
    });

    test("endRound should show match outcome and increment match number if match is over", () => {
      mockModel.getPlayerMove.mockReturnValue("rock");
      mockModel.getComputerMove.mockReturnValue("scissors");
      mockModel.isMatchOver.mockReturnValue(true);
      mockModel.handleMatchWin.mockReturnValue(PARTICIPANTS.PLAYER);
      mockModel.incrementMatchNumber.mockImplementation(() => {});
      mockModel.setMatch.mockImplementation(() => {});
      mockModel.increaseRoundNumber.mockImplementation(() => {});

      controller["endRound"]();

      expect(mockView.showMatchOutcome).toHaveBeenCalledWith(
        "rock",
        "scissors",
        PARTICIPANTS.PLAYER
      );
      expect(mockModel.incrementMatchNumber).toHaveBeenCalled();
      expect(mockModel.setMatch).toHaveBeenCalledWith(null);
      expect(mockView.showRoundOutcome).not.toHaveBeenCalled();
      expect(mockModel.increaseRoundNumber).not.toHaveBeenCalled();
    });

    test("endRound should show match outcome and increment match number if computer wins match", () => {
      const playerMove: Move = "paper";
      const computerMove: Move = "scissors"; // Computer wins round, leading to match win
      const matchWinner = PARTICIPANTS.COMPUTER;

      mockModel.getPlayerMove.mockReturnValue(playerMove);
      mockModel.getComputerMove.mockReturnValue(computerMove);
      // evaluateRound might not be called if match is already detected as over by health
      // but good practice to mock it if it theoretically could be.
      mockModel.evaluateRound.mockReturnValue("Computer wins the round!");
      mockModel.isMatchOver.mockReturnValue(true); // Key for this test
      mockModel.handleMatchWin.mockReturnValue(matchWinner); // Key for this test
      mockModel.incrementMatchNumber.mockImplementation(() => {});
      mockModel.setMatch.mockImplementation(() => {}); // Set to null after match end

      // Mock common view/model updates that happen at the end of every round
      mockModel.getPlayerScore.mockReturnValue(0);
      mockModel.getComputerScore.mockReturnValue(1); // Example score for computer win
      mockModel.getPlayerTaraCount.mockReturnValue(0);
      mockModel.getComputerTaraCount.mockReturnValue(3);
      mockModel.getPlayerMostCommonMove.mockReturnValue(null);
      mockModel.getComputerMostCommonMove.mockReturnValue("scissors");
      mockModel.isTaraButtonVisible.mockReturnValue(false);

      controller["endRound"](); // Accessing private method for testing

      // Assertions for when match IS over (Computer wins)
      expect(mockView.showMatchOutcome).toHaveBeenCalledWith(
        playerMove,
        computerMove,
        matchWinner
      );
      expect(mockModel.incrementMatchNumber).toHaveBeenCalled();
      expect(mockModel.setMatch).toHaveBeenCalledWith(null); // Should be called with null
      expect(mockView.showRoundOutcome).not.toHaveBeenCalled(); // Should NOT be called
      expect(mockModel.increaseRoundNumber).not.toHaveBeenCalled(); // Should NOT be called

      // Common calls for end of round (regardless of match end)
      expect(mockView.togglePlayAgain).toHaveBeenCalledWith(true);
      expect(mockView.updateScores).toHaveBeenCalledWith(0, 1);
      expect(mockView.updateTaraCounts).toHaveBeenCalledWith(0, 3);
      expect(mockView.updateMostCommonMoves).toHaveBeenCalledWith(
        null,
        "scissors"
      );
    });
  });

  describe("handleNextRound", () => {
    test("prepares for the next round within a match", () => {
      const nextRoundNumber = 3;
      const currentMatchNumber = 1;

      mockModel.getRoundNumber.mockReturnValue(nextRoundNumber);
      mockModel.getMatchNumber.mockReturnValue(currentMatchNumber);
      mockModel.setDefaultMatchData.mockImplementation(() => {});
      mockView.updateRound.mockImplementation(() => {});
      mockView.updateMatch.mockImplementation(() => {});
      mockView.resetForNextRound.mockImplementation(() => {});

      controller["handleNextRound"]();

      expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
      expect(mockView.updateRound).toHaveBeenCalledWith(nextRoundNumber);
      expect(mockView.updateMatch).toHaveBeenCalledWith(currentMatchNumber);
      expect(mockView.resetForNextRound).toHaveBeenCalled();
    });
  });
});
