const score = document.querySelector('.score'),
start = document.querySelector('.start'), 
gameArea = document.querySelector('.gameArea'),
car = document.createElement('div');

car.classList.add('car');

start.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};

function getQuantityElements(heightElement) {// получаем количество элементов взависимости от размера экрана
    return document.documentElement.clientHeight / heightElement + 1;
}

function startGame() {
    start.classList.add('hide');
    gameArea.innerHTML= ' ';
    car.style.left = '125px';
    car.style.bottom = '10px';
    car.style.top = 'auto';
    // добавляем линии
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }
    // добавляем машины
    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';// рандомное располложение противников по горизонтали Math.floor - округляет значение, Math.random - добаляет рандомное значени
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url(\'./image/enemy2.png\') center / cover no-repeat';
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    setting.x = car.offsetLeft;//добавляем свойство x для объекта setting и вызываем метод offsetLeft(содержит левое смещение элемента относительно offsetParent)
    setting.y = car.offsetTop;// содержит верхнее смещение
    requestAnimationFrame(playGame);// сообщаем о том, что playGame - будет анимированной, и просим запланировать перерисовку на следующем кадре анимации 
}

function playGame() {
    if (setting.start){
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed;// скорость перемещения автомобиля
        }

        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed;// х будет увеличиваться
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed;// чтобы двигался вверх
        }

        if (keys.ArrowDown && setting.x < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed;// чтобы двигался вниз
        }

        car.style.left = setting.x + 'px';// стиль .car будут присваиваться значения setting.x
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame); // чтобы анимация была плавной и игра не останавлтвалась, фукция должна сама себя перезапускать 
    }
}

function startRun(event) { // к event(объект события на странице) можно обращаться только внутри функции  
    event.preventDefault(); // отключаем стандартное поведение браузера 
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault(); // отключаем стандартное поведение браузера 
    keys[event.key] = false;
}

function moveRoad() {// анимируем лении
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(item){
        item.y += setting.speed;
        item.style.top = item.y + 'px';

        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100;
        }
    });
}

function moveEnemy() {// анимируем противников
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item) {
        let carRect = car.getBoundingClientRect();// метод возвращает размеры и позицию 
        //элемента в виде объекта для машины
        let enemyRect = item.getBoundingClientRect();//для противников

        if (carRect.top <= enemyRect.bottom && carRect.right >= enemyRect.left && carRect.left <= enemyRect.right && carRect.bottom >= enemyRect.top) {
            setting.start = false;
            console.warn('столковение');
            start.classList.remove('hide');
            score.style.top = start.offsetHeight;
        }

        item.y += setting.speed / 2;// устанавливаем скорость противников
        item.style.top = item.y + 'px';
        if (item.y >= document.documentElement.clientHeight) {
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });
}