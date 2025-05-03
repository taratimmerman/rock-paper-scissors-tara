import { Controller } from "./controller";

describe("Controller", () => {
  let mockModel: any;
  let mockView: any;
  let controller: Controller;

  beforeEach(() => {
    document.body.innerHTML = `
      <button id="rock"></button>
      <button id="paper"></button>
      <button id="scissors"></button>
    `;

    mockModel = {
      getScore: jest.fn().mockReturnValue(0),
      setPlayerMove: jest.fn(),
      getPlayerMove: jest.fn().mockReturnValue("rock"),
      chooseComputerMove: jest.fn(),
      setComputerMove: jest.fn(),
      getComputerMove: jest.fn().mockReturnValue("scissors"),
      evaluateRound: jest.fn().mockReturnValue("You win!"),
      increaseRoundNumber: jest.fn(),
      getTaraCount: jest.fn().mockReturnValue(0),
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
    };

    controller = new Controller(mockModel, mockView);
  });

  test("initialize updates the message and scores", () => {
    controller.initialize();

    expect(mockModel.getScore).toHaveBeenCalledWith("player");
    expect(mockModel.getScore).toHaveBeenCalledWith("computer");
    expect(mockView.updateMessage).toHaveBeenCalledWith(
      "Rock, Paper, Scissors, Tara"
    );
    expect(mockView.updateScores).toHaveBeenCalledWith(0, 0);
  });

  // ===== Move Tests =====

  test("clicking rock button sets player move to 'rock'", () => {
    controller.initialize();
    const rockBtn = document.getElementById("rock")!;
    rockBtn.click();

    expect(mockModel.setPlayerMove).toHaveBeenCalledWith("rock");
  });

  test("clicking paper button sets player move to 'paper'", () => {
    controller.initialize();
    document.getElementById("paper")!.click();
    expect(mockModel.setPlayerMove).toHaveBeenCalledWith("paper");
  });

  test("clicking scissors button sets player move to 'scissors'", () => {
    controller.initialize();
    document.getElementById("scissors")!.click();
    expect(mockModel.setPlayerMove).toHaveBeenCalledWith("scissors");
  });

  test("clicking a move button triggers computer to choose a move", () => {
    controller.initialize();
    document.getElementById("rock")!.click();

    expect(mockModel.chooseComputerMove).toHaveBeenCalled();
  });

  test("clicking a move button displays outcome and toggles UI", () => {
    controller.initialize();
    document.getElementById("rock")!.click();

    expect(mockView.showRoundOutcome).toHaveBeenCalledWith(
      "rock",
      "scissors",
      "You win!"
    );
    expect(mockView.toggleMoveButtons).toHaveBeenCalledWith(false);
    expect(mockView.togglePlayAgain).toHaveBeenCalledWith(true);
    expect(mockView.updateScores).toHaveBeenCalledWith(0, 0);
    expect(mockView.updateTaraCounts).toHaveBeenCalledWith(0, 0);
  });
});
