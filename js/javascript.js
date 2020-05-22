const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const ground = new Image()
ground.src = 'content/background.png'
const food = new Image()
food.src = 'content/strike.png'

const food1 = new Image()
food1.src = 'content/chari.png'

const food2 = new Image()
food2.src = 'content/apple.png'


let box = 32


class Score // Singletone
{
    constructor(score = 0)//в последующем можно  брать с бд
    {
        if(Score.exists)
        {
            return Score.instance
        }
        this.score = score
        Score.instance = this
        Score.exists = true
        return this
    }

    getScore()
    {
        return this.score
    }

    setScore(score)
    {
        this.score = score 
    }
}

class PositionFood
{
    constructor()
    {
        this.x = parseInt(Math.random() * 17 + 1)*box
        this.y =  parseInt(Math.random() * 15 + 3)*box
    }

    generation()
    {
        this.x = parseInt(Math.random() * 17 + 1)*box
        this.y =  parseInt(Math.random() * 15 + 3)*box
    }

    }

    
class FoodScore // Strategy
{
    scoring()
    {
        return this.resultScore
    }
}

class Shelcovica extends FoodScore
{
    constructor()
    {
        super()
        this.resultScore = 1
    }
}

class Vishnya extends FoodScore
{
    constructor()
    {
        super()
        this.resultScore = 2
    }
}

class Apple  extends FoodScore
{
    constructor()
    {
        super()
        this.resultScore = 2.5
    }
}

class ResultFoodScore
{
    result(type)
    {
        return type.scoring()
    }
}

const resfoodscore = new ResultFoodScore()

//=============================================================end Strategy==============================================================

//console.log(resscorefood.result(new Apple()))

document.addEventListener("keydown",direction)


class User //===========prototype
{
    constructor(name,score)
    {
        this.name = name
        this.score = score
        this.statusScoring = 'white'
        
    }
}

User.prototype.Change = function()
{
    if(this.score >= 5 && this.score<10)
    this.statusScoring = 'yellow'
    else if(this.score >= 10 && this.score<15)
    this.statusScoring = 'black'
    else if(this.score>=15 && this.score<20)
    this.statusScoring = 'red'
    else if (this.score >=20 && this.score<25)
    this.statusScoring = 'orange'
    else if (this.score >=25 && this.score < 50)
    this.statusScoring = 'tomato'
    else if (this.score >=50)
    this.statusScoring = 'gold'
}

//=============================end prototype=====================================


function ScoreShow(color)
{
    ctx.fillStyle = color
    ctx.font = "50px Arial"
    ctx.fillText(newScore.score,box*2.5,box*1.65)
}
function NameShow(name)
{
    ctx.fillStyle = username.statusScoring
    ctx.font = "50px Arial"
    ctx.fillText(username.name,box*15,box*1.65)
}

let dir


function direction(e)
{
    if(e.keyCode == 37 && dir != 'right')
    {
        dir = 'left'
    }
    if(e.keyCode == 38 && dir != 'down')
    {
        dir = 'up'
    }
    if(e.keyCode == 39 && dir != 'left')
    {
        dir = 'right'
    }
    if(e.keyCode == 40 && dir != 'up')
    {
        dir = 'down'
    }
}

function eatTail(head,arr)
{
    for(let i = 0; i< arr.length; i++)
    {
        if(head.x == arr[i].x && head.y == arr[i].y)
        {
            clearInterval(game)
        }
    }
}

function NoTailFruitGeneration(Positions,arr)
{
    for(let i = 0; i< arr.length; i++)
    {
        if(Positions.x == arr[i].x && Positions.y == arr[i].y)
        {
            Positions.generation()
        }
    }
}

function NoFruitOnePositionGenerate(Position,Position1,Position2)
{
    if(Position.x == Position1.x && Position.y == Position1.y)
    {
        Position1.generation()
    }
    if(Position2.x == Position1.x && Position2.y == Position1.y || Position2.x == Position.x && Position2.y == Position.y)
    {
        Position2.generation()
    }
}

let Position = new PositionFood()
let PositionApple = new PositionFood()
let PositionCha = new PositionFood()

function drawGame()
{
    ctx.drawImage(ground,0,0)
    ctx.drawImage(food,Position.x,Position.y)
    ctx.drawImage(food1,PositionCha.x,PositionCha.y)
    ctx.drawImage(food2,PositionApple.x,PositionApple.y)

    for(let i = 0;i<snake.length;i++)
    {
        ctx.fillStyle = i == 0 ? 'red' : 'white'
        ctx.fillRect(snake[i].x,snake[i].y,box,box)
    }

    ctx.fillStyle = 'white'
    ctx.font = "50px Arial"
    ctx.fillText(newScore.score,box*2.5,box*1.65)
    NameShow(username.name)
    console.log(newScore.score)
    username.Change()
    ScoreShow(username.statusScoring)

    let snakeX = snake[0].x
    let snakeY = snake[0].y
    NoFruitOnePositionGenerate(PositionApple,PositionCha,Position)
    if(snakeX==Position.x && snakeY == Position.y)
    {
            newScore.getScore(newScore.score = newScore.score+resfoodscore.result(new Shelcovica()))
            Position.generation()
            NoTailFruitGeneration(Position,snake)

    }
    else if (snakeX == PositionApple.x&& snakeY == PositionApple.y)
    {
        newScore.getScore(newScore.score = newScore.score+resfoodscore.result(new Apple()))
        PositionApple.generation()
        NoTailFruitGeneration(PositionApple,snake)
    }
    else if (snakeX == PositionCha.x&& snakeY == PositionCha.y)
    {
        newScore.getScore(newScore.score = newScore.score+resfoodscore.result(new Vishnya()))
        PositionCha.generation()
        NoTailFruitGeneration(PositionCha,snake)
    }
    else
    {
        snake.pop()
    }

    if(snakeX < box || snakeX > box*17 || snakeY < 3*box || snakeY > 17 * box)
    {
        clearInterval(game)
    }
    username.score = newScore.score

    if(dir == 'left') snakeX-= box
    if(dir == 'right') snakeX+=box
    if(dir == 'up') snakeY -=box
    if(dir == 'down') snakeY += box

    let newHead = 
    {
        x: snakeX,
        y:snakeY
    }

    eatTail(newHead,snake);
     
    snake.unshift(newHead)
}

let newScore = new Score()
let username = new User('Taras',newScore.score)


let snake = [];
snake[0] = 
{
    x: 9*box,
    y: 10*box
} 

let game = setInterval(drawGame,100)

