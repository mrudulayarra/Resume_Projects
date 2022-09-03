const{World,Engine,Runner,Render,Bodies,Body,Events} = Matter;

const engine = Engine.create();

engine.world.gravity.y = 0;//for the better movement of ball
const{world} = engine;

const easy = document.querySelector(".easy");
const medium = document.querySelector(".medium");
const hard = document.querySelector(".hard");
easy.addEventListener("click",() => {
    document.querySelector(".rules").classList.add("hide-rules");
    document.querySelector("section").classList.remove("hide-controls");
    draw(12,14);
});
medium.addEventListener("click",() => {
    document.querySelector(".rules").classList.add("hide-rules");
    document.querySelector("section").classList.remove("hide-controls");
    draw(16,18);
});
hard.addEventListener("click",() => {
    document.querySelector(".rules").classList.add("hide-rules");
    document.querySelector("section").classList.remove("hide-controls");
    draw(25,18);
});





function draw(noOfRows,noOfCols) {
    const width = window.innerWidth * 0.95;
    const height = window.innerHeight * 0.95;
    const unitLengthX = width / noOfCols;
    const unitLengthY = height / noOfRows;
    const render = Render.create({
        element : document.body,
        engine:engine,
        options : {
            wireframes: false,
            width,
            height,
        },
    });
    const walls = [
        Bodies.rectangle(width/2,0,width,3,{
            label:"wall",
            isStatic:true,
            render: {
                fillStyle: "red",
            }
        }),
        Bodies.rectangle(width/2,height,width,3,{
            isStatic:true,
            render: {
                fillStyle: "red",
            }
        }),
        Bodies.rectangle(width,height/2,3,height,{
            label:"wall",
            isStatic:true,
            render: {
                fillStyle: "red",
            }
        }),
        Bodies.rectangle(0,height/2,3,height,{
            label:"wall",
            isStatic:true,
            render: {
                fillStyle: "red",
            }
        })
    ];
    World.add(world,walls);

    //grid generation
    const grid = new Array(noOfRows).fill(null).map(() => new Array(noOfCols).fill(false));

    //vertical and horizontal walls
    const verticals = new Array(noOfRows).fill(null).map(() => new Array(noOfCols - 1).fill(false));
    const horizontals = new Array(noOfRows - 1).fill(null).map(() => new Array(noOfCols).fill(false));

    const startRow = Math.floor(Math.random() * noOfRows);
    const startCol = Math.floor(Math.random() * noOfCols);
    const generateMaze = (row,col) => {
        //check if the cell at[row,col] is already visited then return
        if(grid[row][col]) return;

        // mark the cell as visited
        grid[row][col] = true;

        // assemble the neighbours of cell
        const neighbours = [
            [row,col - 1,"left"],
            [row - 1,col,"up"],
            [row,col + 1,"right"],
            [row + 1,col,"down"]
        ];
        shuffle(neighbours);

        // for each neighbour
        for(let neighbour of neighbours) {
            const[neighbourRow,neighbourCol,direction] = neighbour;

            //see if that nieghbour is valid
            if(neighbourRow < 0 || neighbourCol < 0 || neighbourRow >= noOfRows || neighbourCol >= noOfCols) {
                continue;
            }

            //if we have visited that neighbour continue to next neighbour
            if(grid[neighbourRow][neighbourCol]) continue;

            // remove a wall from verticals
            if(direction === "left") {
                verticals[row][col - 1] = true;
            }
            else if(direction === "right") {
                verticals[row][col] = true;
            }
            // remove a wall from horizontals
            else if(direction === "down") {
                horizontals[row][col] = true;
            }
            else {
                horizontals[row - 1][col] = true;
            }
            generateMaze(neighbourRow,neighbourCol);
        }
    };
    generateMaze(startRow,startCol);
    horizontals.forEach((row,rowIndex) => {
        row.forEach((noWall,colIndex) => {
            if(noWall) {
                return;
            }
            const wall = Bodies.rectangle(
                colIndex * unitLengthX + unitLengthX / 2,
                rowIndex * unitLengthY + unitLengthY,
                unitLengthX,
                1,
                {
                    label:"wall",
                    isStatic:true,
                    render: {
                        fillStyle: "red",
                    }
                }
            );
            World.add(world,wall);
        });
    });
    verticals.forEach((row,rowIndex) => {
        row.forEach((noWall,colIndex) => {
            if(noWall) {
                return;
            }
            const wall = Bodies.rectangle(
                colIndex * unitLengthX + unitLengthX,
                rowIndex * unitLengthY + unitLengthY / 2,
                1,
                unitLengthY,
                {
                    label : "wall",
                    isStatic:true,
                    render: {
                        fillStyle: "red",
                    }
                }
            );
            World.add(world,wall);
        });
    });

    const min = Math.min(unitLengthX,unitLengthY);
    //goal
    const goal = Bodies.rectangle(
        width-unitLengthX / 2,
        height-unitLengthY / 2,
        min * 0.7,
        min * 0.7,
        {
            isStatic : true,
            label : "goal",
            render: {
                fillStyle: "green",
            }
        }
    );
    World.add(world,goal);

    //ball
    const ball = Bodies.circle(
        unitLengthX / 2,
        unitLengthY / 2,
        min * 0.3,
        {
            label : "ball",
            render: {
                fillStyle: "blue",
            }
        }
    );
    World.add(world,ball);
    Render.run(render);

    const runner = Runner.create();

    Runner.run(runner,engine);
    
    //event listeners

    document.addEventListener("keydown",(e) => {
        const {x,y} = ball.velocity;
        if(e.key === "w" || e.key === "ArrowUp") {
            Body.setVelocity(ball,{x, y: y - 3});
        }
        if(e.key === "d" || e.key === "ArrowRight") {
            Body.setVelocity(ball,{x : x + 3, y});
        }
        if(e.key === "s" || e.key === "ArrowDown") {
            Body.setVelocity(ball,{x, y: y + 3});
        }
        if(e.key === "a" || e.key === "ArrowLeft") {
            Body.setVelocity(ball,{x : x - 3, y});
        }
    });
    document.querySelector(".up").addEventListener("click",() => {
        const {x,y} = ball.velocity;
        Body.setVelocity(ball,{x, y: y - 3});

    });
    document.querySelector(".down").addEventListener("click",() => {
        const {x,y} = ball.velocity;
        Body.setVelocity(ball,{x, y: y + 3});

    });
    document.querySelector(".right").addEventListener("click",() => {
        const {x,y} = ball.velocity;
        Body.setVelocity(ball,{x : x + 3, y});

    });
    document.querySelector(".left").addEventListener("click",() => {
        const {x,y} = ball.velocity;
        Body.setVelocity(ball,{x : x - 3, y});

    });

    Events.on(engine,'collisionStart',(e) => {
        //pairs is an array which contains only one element
        // console.log(e.pairs.length); //prints 1
        e.pairs.forEach((collision) => {
            const labels = ["ball","goal"];
            if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
                world.bodies.forEach((obj) => {
                    if(obj.label === "wall") {
                        Body.setStatic(obj,false);
                    }
                });
                engine.world.gravity.y = 1;
                Body.setStatic(goal,false);
                document.querySelector("section").classList.add("hide-controls");
                setTimeout(() => {
                    document.querySelector(".winner").classList.remove("hidden");
                },1500);
            }
        });
    });
}


//my code
document.querySelector(".playagain").addEventListener("click",() => {
    window.location.reload();
});