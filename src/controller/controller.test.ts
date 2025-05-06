import { Controller } from "./controller";
import { MOVES } from "../utils/dataUtils";

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
      resetMoves: jest.fn(),
      resetScores: jest.fn(),
      resetTaras: jest.fn(),
      resetRoundNumber: jest.fn(),
      registerPlayerMove: jest.fn(),
    };

    mockView = {
      updateMessage: jest.fn(),
      updateScores: jest.fn(),
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
    expect(mockModel.resetRoundNumber).toHaveBeenCalled();

    expect((controller as any).updateScoreView).toHaveBeenCalled();
    expect((controller as any).updateTaraView).toHaveBeenCalled();
    expect((controller as any).updateTaraButtonView).toHaveBeenCalled();
  });
});
