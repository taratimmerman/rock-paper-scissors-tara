import { Controller } from "./controller";
import { MOVES, PARTICIPANTS } from "../utils/dataUtils";
import { Move } from "../utils/dataObjectUtils";

describe("Controller", () => {
  let mockModel: any;
  let mockView: any;
  let controller: Controller;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id=${MOVES.ROCK}></button>
      <button id=${MOVES.PAPER}></button>
      <button id=${MOVES.SCISSORS}></button>
      <button id=${MOVES.TARA}></button>
    `;

    mockModel = {
      getPlayerScore: jest.fn().mockReturnValue(0),
      getComputerScore: jest.fn().mockReturnValue(0),
      setPlayerScore: jest.fn(),
      setComputerScore: jest.fn(),
      getPlayerMove: jest.fn().mockReturnValue(MOVES.ROCK),
      setComputerMove: jest.fn(),
      getComputerMove: jest.fn().mockReturnValue(MOVES.SCISSORS),
      chooseComputerMove: jest.fn(),
      evaluateRound: jest.fn().mockReturnValue("You win!"),
      increaseRoundNumber: jest.fn(),
      getPlayerTaraCount: jest.fn().mockReturnValue(0),
      getComputerTaraCount: jest.fn().mockReturnValue(0),
      taraIsEnabled: jest.fn(),
      isTaraButtonVisible: jest.fn(),
      resetMoves: jest.fn(),
      resetScores: jest.fn(),
      resetTaras: jest.fn(),
      registerPlayerMove: jest.fn(),
      resetHistories: jest.fn(),
      resetBothMoveCounts: jest.fn(),
      resetMostCommonMoves: jest.fn(),
      getPlayerMostCommonMove: jest.fn(),
      getComputerMostCommonMove: jest.fn(),
      showMostCommonMove: jest.fn(),
      isMatchActive: jest.fn(),
      isMatchOver: jest.fn(),
      setMatch: jest.fn(),
      resetMatchData: jest.fn(),
      getRoundNumber: jest.fn(),
      updateRound: jest.fn(),
      incrementMatchNumber: jest.fn(),
      getMatchWinner: jest.fn(),
      getMatchNumber: jest.fn(),
      setDefaultMatchData: jest.fn(),
      getHealth: jest.fn(),
    };

    mockView = {
      updateMessage: jest.fn(),
      updateScores: jest.fn(),
      updateRound: jest.fn(),
      updateMatch: jest.fn(),
      showRoundOutcome: jest.fn(),
      toggleMoveButtons: jest.fn(),
      togglePlayAgain: jest.fn(),
      toggleStartButton: jest.fn(),
      resetForNextRound: jest.fn(),
      updateTaraCounts: jest.fn(),
      updateTaraButton: jest.fn(),
      toggleResetGameState: jest.fn(),
      updateScoreView: jest.fn(),
      updateTaraView: jest.fn(),
      toggleMostCommonMoveTable: jest.fn(),
      updateMostCommonMoves: jest.fn(),
      updateStartButton: jest.fn(),
      showMatchOutcome: jest.fn(),
      toggleTaraButton: jest.fn(),
      updateHealth: jest.fn(),
    };

    controller = new Controller(mockModel, mockView);
  });

  test("initialize updates the message and scores", () => {
    controller.initialize();

    expect(mockModel.getPlayerScore).toHaveBeenCalled();
    expect(mockModel.getComputerScore).toHaveBeenCalled();
    expect(mockView.updateMessage).toHaveBeenCalledWith(
      "Rock, Paper, Scissors, Tara"
    );
    expect(mockView.updateScores).toHaveBeenCalledWith(0, 0);
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

  // ===== Move Tests =====

  test("clicking rock button sets player move to 'rock'", () => {
    controller.initialize();
    const rockBtn = document.getElementById(MOVES.ROCK)!;
    rockBtn.click();

    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.ROCK);
  });

  test("clicking paper button sets player move to 'paper'", () => {
    controller.initialize();
    document.getElementById(MOVES.PAPER)!.click();
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.PAPER);
  });

  test("clicking scissors button sets player move to 'scissors'", () => {
    controller.initialize();
    document.getElementById(MOVES.SCISSORS)!.click();
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.SCISSORS);
  });

  test("clicking tara button sets player move to 'tara'", () => {
    controller.initialize();
    document.getElementById(MOVES.TARA)!.click();
    expect(mockModel.registerPlayerMove).toHaveBeenCalledWith(MOVES.TARA);
  });

  test("clicking a move button triggers computer to choose a move", () => {
    controller.initialize();
    document.getElementById(MOVES.ROCK)!.click();

    expect(mockModel.chooseComputerMove).toHaveBeenCalled();
  });

  test("clicking a move button displays outcome and toggles UI", () => {
    controller.initialize();
    document.getElementById(MOVES.ROCK)!.click();

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

  test("should call resetMoves before registerPlayerMove", () => {
    const resetSpy = jest.spyOn(mockModel, "resetMoves");
    const registerPlayerMoveSpy = jest.spyOn(mockModel, "registerPlayerMove");

    controller.handlePlayerMove(MOVES.SCISSORS);

    const resetCall = resetSpy.mock.invocationCallOrder[0];
    const setMoveCall = registerPlayerMoveSpy.mock.invocationCallOrder[0];

    expect(resetCall).toBeLessThan(setMoveCall);
  });

  test("resetGameState should reset model and update view", () => {
    jest.spyOn(controller as any, "updateScoreView");
    jest.spyOn(controller as any, "updateTaraView");
    jest.spyOn(controller as any, "updateTaraButtonView");

    controller.resetGameState();

    expect(mockModel.resetScores).toHaveBeenCalled();
    expect(mockModel.resetMoves).toHaveBeenCalled();
    expect(mockModel.resetTaras).toHaveBeenCalled();
    expect(mockModel.resetHistories).toHaveBeenCalled();
    expect(mockModel.resetBothMoveCounts).toHaveBeenCalled();
    expect(mockModel.resetMostCommonMoves).toHaveBeenCalled();

    expect((controller as any).updateScoreView).toHaveBeenCalled();
    expect((controller as any).updateTaraView).toHaveBeenCalled();
    expect((controller as any).updateTaraButtonView).toHaveBeenCalled();
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
    mockView.toggleStartButton.mockImplementation(() => {});
    mockView.toggleResetGameState.mockImplementation(() => {});
    mockView.toggleMostCommonMoveTable.mockImplementation(() => {});
    mockView.toggleMoveButtons.mockImplementation(() => {});

    controller["startGame"]();

    // Expected assertions
    expect(mockModel.setDefaultMatchData).toHaveBeenCalled();
    expect(mockView.updateRound).toHaveBeenCalledWith(initialRoundNumber);
    expect(mockView.updateMatch).toHaveBeenCalledWith(initialMatchNumber);
    expect(mockView.toggleStartButton).toHaveBeenCalledWith(false);
    expect(mockView.toggleResetGameState).toHaveBeenCalledWith(false);
    expect(mockView.toggleMostCommonMoveTable).toHaveBeenCalledWith(
      showMostCommonMove
    );
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
      mockModel.getMatchWinner.mockReturnValue(PARTICIPANTS.PLAYER);
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
      mockModel.getMatchWinner.mockReturnValue(matchWinner); // Key for this test
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
      expect(mockView.toggleMostCommonMoveTable).toHaveBeenCalledWith(false);
      expect(mockView.toggleMoveButtons).toHaveBeenCalledWith(false);
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
