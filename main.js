// 1.没有蛇头
// 2.食物闪光
// 3.暂停、继续
// 4.食物不应该在现有snake身上生成



//获取snake容器
const snake = document.getElementById("snake")
//获取snake的身体各部分。Tag即<>里面的内容
//报错：cannot read properties of null
// js引入放最后面就解决了。页面是自上而下的运行的，HTML都没有运行到，当然获取不到对应节点
const snakes = snake.getElementsByTagName("div")
//获取food
const food = document.getElementById("food")
//获取score和level
const scoreSpan = document.getElementById("score")
const levelSpan = document.getElementById("level")
//创建变量存储score和level
let score = 0
let level = 1

// stage是边长为300的正方形，food的坐标x、y的值应在(0,290)之间，以左上角的点为准
// Math.floor() 函数总是返回小于等于一个给定数字的最大整数，如5.95返回5
function changeFood(){
    // 一定要乘以10！直接300就不一定是10的倍数了，会出现卡一半的尴尬bug
    const x = Math.floor(Math.random() * 30) * 10
    const y = Math.floor(Math.random() * 30) * 10
    // 不要忘了加"px"！！
    food.style.left = x + "px"
    food.style.top = y + "px"
}

let direction

// 创建一个变量来记录按键状态
let keyActive = true
const keyArr = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]

// 创建Object的格式别写错了，先属性名，冒号后属性值
const Obj = {
    ArrowDown: "ArrowUp",
    ArrowUp: "ArrowDown", 
    ArrowRight: "ArrowLeft",
    ArrowLeft: "ArrowRight"
}

// 绑定按键事件keydown、keyup,键盘事件只能绑定给可以获取焦点的元素或者是document
document.addEventListener("keydown", (event) =>{
    // 数组里是否包含event.key元素。不能传形参direction
    if (keyActive || keyArr.includes(event.key)) {
        if (snakes.length < 2 || Obj[direction] !== event.key){
            // 设置方向
            direction = event.key
            keyActive = false
        } 
    }
})

setTimeout(function move(){
    // 获取蛇头
    const head = snakes[0]
    
    // 获取蛇头head的坐标
    let x = head.offsetLeft
    let y = head.offsetTop

    switch(direction){
        case "ArrowUp" :
            y -= 10
            break
        case "ArrowDown" :
            y += 10
            break
        case "ArrowLeft" :
            x -= 10
            break
        case "ArrowRight" :
            x += 10
            break        
    }

    // 检查蛇是否吃到食物
    if (
        head.offsetTop === food.offsetTop &&
        head.offsetLeft === food.offsetLeft
    ) {
        // console.log("吃到了！")  
        // 接下来会发生两件事/两个需求
        // 说人话：  1.snake身体变长一截；2.生成新food
        // 程序语言：1.snake增加一个div； 2.随机改变food位置
        changeFood()
        snake.insertAdjacentHTML("beforeend", "<div></div>")
        score++
        scoreSpan.textContent = score

        // 检查等级
        // 因为要先吃食物才能增加level，所以不要把这个if写在外面，不然就会还没动就喜提level 11
        if ( score % 5 === 0 && level < 10) {
            level++
            levelSpan.textContent = level
        }
    }

    //判断是否撞墙，return结束整个函数，所以后面的代码也不再执行
    if ( x < 0 || x > 290 || y < 0 || y > 290 ){
        alert(`You hit the wall !\nGame over !`)
        return
    }

    // 判断是否撞到自己
    // 这里可以写i=1吗?
    for (let i = 0; i < snakes.length - 1; i++) {
        if(
            snakes[i].offsetLeft === x &&
            snakes[i].offsetTop === y
        ){
            alert(`You hit yourself !\nGame Over !`)
            return
        }
    }

    // 获取蛇尾tail。数组格式别写错了：arr[]
    const tail = snakes[snakes.length - 1]
    // 移动蛇的位置
    tail.style.left = x + "px"
    tail.style.top = y + "px"
    // 蛇尾放到蛇头的位置，原蛇头退到第二位，所以不写新的"<div></div>"
    // tail是snake的元素，写insertAdjacentElement而不是HTML
    snake.insertAdjacentElement("afterbegin", tail)
    keyActive = true

    // 每隔150ms执行一次move函数（可控制snake的速度）
    setTimeout(move, 150 - level * 10)
// 定时器只执行一次。嵌套定时器后，一个定时器到期就自动切换另一个定时器。功能类似setInterval，但不会延迟堆积任务
}, 150)



    // if(event.key === "ArrowUp"){
    //     alarm("up")
    // }
    // switch(direction){
    //     case "ArrowUp" :
    //         console.log("↑")
    //         head.style.top = head.offsetTop - 10 +"px"
    //         break
    //     case "ArrowDown" :
    //         console.log("↓")
    //         head.style.top = head.offsetTop + 10 +"px"
    //         break
    //     case "ArrowLeft" :
    //         console.log("←")
    //         head.style.left = head.offsetLeft - 10 +"px"
    //         break
    //     case "ArrowRight" :
    //         console.log("→")
    //         head.style.left = head.offsetLeft + 10 +"px"
    //         break        
    // }

// 第一种掉头写法：
        // else {
        //     // 如果现在是↑，则除了↓外，其他的方向（↑、←、→）都行
        //     if (direction === "ArrowUp" && event.key !== "ArrowDown"){
        //         direction = event.key
        //     }else if (direction === "ArrowDown" && event.key !== "ArrowUp"){
        //         direction = event.key
        //     }else if (direction === "ArrowLeft" && event.key !== "ArrowRight"){
        //         direction = event.key
        //     }else if (direction === "ArrowRight" && event.key !== "ArrowLeft"){
        //         direction = event.key
        //     } 
        // }

// 第二种掉头写法：
        // else {
        //     // 判断蛇是否掉头。如果现在是↑，则除了↓外，其他的方向（↑、←、→）都行
        //     if (Obj[direction] !== event.key) {
        //         direction = event.key
        //     }
        // }