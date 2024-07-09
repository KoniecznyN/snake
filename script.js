var game = {
  width: 21,
  height: 21,
  gameBoardScheme: [],
  gameBoard: [],
  init() {
    this.createBoardScheme();
    this.createBoard();
  },
  createBoardScheme() {
    for (let i = 0; i < this.height; ++i) {
      this.gameBoardScheme[i] = [];
      for (let j = 0; j < this.width; ++j) {
        if (i == 0 || i == this.width - 1 || j == 0 || j == this.width - 1) {
          this.gameBoardScheme[i][j] = 2;
        } else this.gameBoardScheme[i][j] = 0;
      }
    }
  },
  createBoard() {
    document.getElementById("gameBoard").innerHTML = "";
    for (let i = 0; i < this.height; ++i) {
      const row = document.createElement("div");
      row.id = "row";
      this.gameBoard[i] = [];
      for (let j = 0; j < this.width; ++j) {
        const el = {
          x: j,
          y: i,
          content: document.createElement("div"),
        };
        if (this.gameBoardScheme[i][j] == 2) {
          el.content.id = "wall";
        } else {
          el.content.id = "el";
        }
        this.gameBoard[i][j] = el;
        row.append(el.content);
      }
      document.getElementById("gameBoard").append(row);
    }
  },
  counter: 0,
  snake: [{ x: 10, y: 10 }],
  snakePosition: undefined,
  vec: { x: 0, y: 0 },
  interval: undefined,
  lastClckedKey: undefined,
  mainGame(e) {
    let snakeMove = () => {
      switch (e.code) {
        case "KeyW":
          if (this.lastClckedKey == "KeyS") {
            break;
          }
          this.vec = { x: 0, y: -1 };
          this.lastClckedKey = "KeyW";
          break;
        case "KeyD":
          if (this.lastClckedKey == "KeyA") {
            break;
          }
          this.vec = { x: 1, y: 0 };
          this.lastClckedKey = "KeyD";
          break;
        case "KeyS":
          if (this.lastClckedKey == "KeyW") {
            break;
          }
          this.vec = { x: 0, y: 1 };
          this.lastClckedKey = "KeyS";
          break;
        case "KeyA":
          if (this.lastClckedKey == "KeyD") {
            break;
          }
          this.vec = { x: -1, y: 0 };
          this.lastClckedKey = "KeyA";
          break;
      }

      this.snakePosition = {
        x: this.snake[0].x + this.vec.x,
        y: this.snake[0].y + this.vec.y,
      };

      this.gameBoardScheme[this.snake[this.snake.length - 1].y][
        this.snake[this.snake.length - 1].x
      ] = 0;
      this.snake.unshift(this.snakePosition);

      if (this.isApple == false) {
        this.drawApple();
        this.isApple = true;
      }
      this.gameBoardScheme[this.apple.y][this.apple.x] = 3;

      switch (this.gameBoardScheme[this.snake[0].y][this.snake[0].x]) {
        case 3:
          this.isApple = false;
          this.counter++;
          document.getElementById("counter").innerText =
            "Points: " + this.counter;
          break;
        case 2:
          return this.youLoose();
        case 1:
          return this.youLoose();
        default:
          this.snake.pop();
          break;
      }

      for (let i = 0; i < this.snake.length; i++) {
        this.gameBoardScheme[this.snake[i].y][this.snake[i].x] = 1;
      }

      this.updateBoard();
    };
    clearInterval(this.interval);
    snakeMove();
    this.interval = setInterval(snakeMove, 200);
  },
  isApple: false,
  apple: { x: 0, y: 0 },
  drawApple() {
    this.apple.x = Math.floor(Math.random() * (19 - 1) + 1);
    this.apple.y = Math.floor(Math.random() * (19 - 1) + 1);

    let isEmpty = true;
    while (isEmpty) {
      if (this.gameBoardScheme[this.apple.y][this.apple.x] == 0) {
        isEmpty = false;
      } else {
        this.apple.x = Math.floor(Math.random() * (19 - 1) + 1);
        this.apple.y = Math.floor(Math.random() * (19 - 1) + 1);
      }
    }
  },
  updateSnakeGraphic() {
    let updateHead = () => {
      switch (this.lastClckedKey) {
        case "KeyW":
          return (this.gameBoard[this.snake[0].y][this.snake[0].x].content.id =
            "snakeHeadU");
        case "KeyS":
          return (this.gameBoard[this.snake[0].y][this.snake[0].x].content.id =
            "snakeHeadD");
        case "KeyD":
          return (this.gameBoard[this.snake[0].y][this.snake[0].x].content.id =
            "snakeHeadR");
        case "KeyA":
          return (this.gameBoard[this.snake[0].y][this.snake[0].x].content.id =
            "snakeHeadL");
      }
    };

    let updateTail = () => {
      let vector = {
        x:
          this.snake[this.snake.length - 2].x -
          this.snake[this.snake.length - 1].x,
        y:
          this.snake[this.snake.length - 2].y -
          this.snake[this.snake.length - 1].y,
      };
      vector = `${vector.x}, ${vector.y}`;
      switch (vector) {
        case "0, -1":
          return (this.gameBoard[this.snake[this.snake.length - 1].y][
            this.snake[this.snake.length - 1].x
          ].content.id = "snakeTailU");
        case "0, 1":
          return (this.gameBoard[this.snake[this.snake.length - 1].y][
            this.snake[this.snake.length - 1].x
          ].content.id = "snakeTailD");
        case "1, 0":
          return (this.gameBoard[this.snake[this.snake.length - 1].y][
            this.snake[this.snake.length - 1].x
          ].content.id = "snakeTailR");
        case "-1, 0":
          return (this.gameBoard[this.snake[this.snake.length - 1].y][
            this.snake[this.snake.length - 1].x
          ].content.id = "snakeTailL");
      }
    };

    let updateBody = () => {
      for (let i = 1; i < this.snake.length; ++i) {
        let vectorBeforeElement = {
          x: this.snake[i - 1].x - this.snake[i].x,
          y: this.snake[i - 1].y - this.snake[i].y,
        };
        let vectorAfterElement = {
          x: this.snake[i + 1].x - this.snake[i].x,
          y: this.snake[i + 1].y - this.snake[i].y,
        };
        vector = `${vectorBeforeElement.x}, ${vectorBeforeElement.y}; ${vectorAfterElement.x}, ${vectorAfterElement.y}`;
        if (vector == "1, 0; -1, 0" || vector == "-1, 0; 1, 0") {
          return (this.gameBoard[this.snake[i].y][this.snake[i].x].content.id =
            "snakeBodyHorizontally");
        } else if (vector == "0, 1; 0, -1" || vector == "0, -1; 0, 1") {
          return (this.gameBoard[this.snake[i].y][this.snake[i].x].content.id =
            "snakeBodyVertically");
        } else if (vector == "1, 0; 0, 1" || vector == "0, 1; 1, 0") {
          return (this.gameBoard[this.snake[i].y][this.snake[i].x].content.id =
            "snakeBodyDtoR");
        } else if (vector == "-1, 0; 0, 1" || vector == "0, 1; -1, 0") {
          return (this.gameBoard[this.snake[i].y][this.snake[i].x].content.id =
            "snakeBodyDtoL");
        } else if (vector == "0, -1; 1, 0" || vector == "1, 0; 0, -1") {
          return (this.gameBoard[this.snake[i].y][this.snake[i].x].content.id =
            "snakeBodyUtoR");
        } else if (vector == "0, -1; -1, 0" || vector == "-1, 0; 0, -1") {
          return (this.gameBoard[this.snake[i].y][this.snake[i].x].content.id =
            "snakeBodyUtoL");
        }
      }
    };

    if (this.snake.length == 1) {
      updateHead();
    }
    if (this.snake.length == 2) {
      updateHead();
      updateTail();
    }
    if (this.snake.length >= 3) {
      updateHead();
      updateBody();
      updateTail();
    }
  },
  updateBoard() {
    for (let i = 0; i < this.gameBoardScheme.length; i++) {
      for (let j = 0; j < this.gameBoardScheme[i].length; j++) {
        switch (this.gameBoardScheme[j][i]) {
          case 1:
            this.updateSnakeGraphic();
            break;
          case 0:
            this.gameBoard[j][i].content.id = "el";
            break;
          case 3:
            this.gameBoard[j][i].content.id = "apple";
            break;
          default:
            break;
        }
      }
    }
  },
  youLoose() {
    clearInterval(this.interval);
    alert("Przegrales");
    this.snake = [{ x: 10, y: 10 }];
    this.gameBoardScheme = [];
    this.gameBoard = [];
    this.counter = 0;
    document.getElementById("counter").innerText = "Points: " + this.counter;
    this.init();
  },
};
