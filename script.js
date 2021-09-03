// Quering The Dom
const startGameBtn = document.querySelector('.start-game > span');
const nameInfo = document.querySelector('.name > span');
const triesInfo = document.querySelector('.tries > span');
const blocks = document.querySelectorAll('.block');
let idxArr = [...Array(blocks.length).keys()];
let restartGame = document.querySelectorAll('.refresh');

// Start Game Function & Ordering Layers
// Quering The Layers
const optionsLayer = document.querySelector('.options');

startGameBtn.addEventListener('click', () => {
    let username = prompt('What Is Your Name?');
    let ternary = username ? username : 'Unknown';
    nameInfo.textContent = ternary;
    optionsLayer.classList.remove('down');
    startGameBtn.parentElement.classList.add('up');
});

// Set The Options
// Quering The Buttons
const body = document.body;
const normalGame = document.querySelector('#normal');
const timerGame = document.querySelector('#timer');
const triesGame = document.querySelector('#tries');
const timerInfo = document.querySelector('.timer > span');
const setLayer = document.querySelector('.set');
let timer = 0;
let triesBoolean = false;

// Normal Game
normalGame.addEventListener('click', () => {
    optionsLayer.classList.add('up');
    body.classList.remove('body-overflow');
});

// Game With Options (Timer & Tries)

// For Both (Timer & Tries)
function checkValidation(target, inputVal) {
    let ternaryRegEx = target === 'timer' ? /^[1-5]$/ : /^[1][0-9]$/;
    if (ternaryRegEx.test(inputVal)) {
        return true;
    } else {
        return false;
    }
}

// Timer Function
timerGame.addEventListener('click', () => {
    optionsLayer.classList.add('up');
    setLayer.classList.remove('down');
    let checkForm = setLayer.querySelector('form');
    checkForm.set.setAttribute('placeholder', 'Set Timer From 1/5 min')
    checkForm.addEventListener('submit', e => {
        e.preventDefault();
        if (checkValidation('timer', checkForm.set.value)) {
            timer = checkForm.set.value;
            setLayer.classList.add('up');
            body.classList.remove('body-overflow');
            setTimer(timer);
        } else {
            alert('Set Timer From 1/5 min');
        }
    });
});

// Start Timer
function setTimer(min) {
    let sec = 59, mainMin = min - 1;
    setInterval(() => {
        sec--;
        if (sec === -1) {
            mainMin--;
            sec = 59;
        }
        if (mainMin === 0 &&  sec === 0) {
            clearInterval(1);
            loser();
        }
        let html = `<span class=min>0</span>${mainMin}:<span class=sec>0</span>${sec}`;
        timerInfo.innerHTML = html;

        if (mainMin > 9) {
            timerInfo.querySelector('.min').style.display = 'none';
        } else {
            timerInfo.querySelector('.min').style.display = 'inline';
        }
        if (sec > 9) {
            timerInfo.querySelector('.sec').style.display = 'none';
        } else {
            timerInfo.querySelector('.sec').style.display = 'inline';
        }
    }, 1000);
}

// Tries Function
triesGame.addEventListener('click', () => {
    optionsLayer.classList.add('up');
    setLayer.classList.remove('down');
    let checkForm = setLayer.querySelector('form');
    checkForm.set.setAttribute('placeholder', 'Set Tries From 10/19 try')
    checkForm.addEventListener('submit', e => {
        e.preventDefault();
        if (checkValidation('try', checkForm.set.value)) {
            triesBoolean = true;
            triesInfo.textContent = checkForm.set.value;
            setLayer.classList.add('up');
            body.classList.remove('body-overflow');
        } else {
            alert('Set Tries From 10/19 try');
        }
    });
});

// Restart The Game
restartGame.forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelector('#refresh').submit();
    });
});

// Winner & Loser Functions
// Quering The Dom
const winnerLayer = document.querySelector('.winner');
const loserlayer = document.querySelector('.loser');
let flippedArr = [];

// Quering The Audio
const success = document.querySelector('#success');
const fail = document.querySelector('#fail');

// Winner Function
function winner() {
    blocks.forEach(block => {
        if (block.classList.contains('flipped')) {
            if (!flippedArr.includes(block)) {
                flippedArr.push(block)
            }
        }
    });
    if (flippedArr.length === idxArr.length) {
        winnerLayer.classList.remove('down');
        blocks[0].parentElement.classList.add('stop-clicking');
        clearInterval(1);
        body.classList.add('body-overflow')
    }
}

// Loser Function
function loser() {
    loserlayer.classList.remove('down');
    blocks[0].parentElement.classList.add('stop-clicking');
    body.classList.add('body-overflow')
}

// Shuffling Function
function shuffle(arr) {
    for (let i = 0; i < arr.length; i++) {
        let random = Math.floor(Math.random() * arr.length), temp = arr[i];
        arr[i] = arr[random];
        arr[random] = temp;
    }
    return arr;
}
shuffle(idxArr);

// Shuffling The Blocks
blocks.forEach((block, idx) => block.style.order = idxArr[idx]);

// Main Functions
// Flipping The Blocks
function flippingFunc(el) {el.classList.add('clicked')}

// Check Flipped Blocks
function checkFlippedBlocks(block_1, block_2, blocks) {
    if (block_1.dataset.tec === block_2.dataset.tec) {
        blocks.forEach(block => {
            block.classList.remove('clicked');
            block.classList.add('flipped');
            success.play()
        });
    } else {
        setTimeout(() => {
            blocks.forEach(block => {
                block.classList.remove('clicked');
            });
        }, 500);
        if (triesBoolean) {
            triesInfo.textContent = Number(triesInfo.textContent) - 1;
            if (Number(triesInfo.textContent) === 0) {
                loser();
            }
        } else {
            triesInfo.textContent = Number(triesInfo.textContent) + 1;
        }
        setTimeout(() => {fail.play()}, 200);
    }
    winner();
}

blocks.forEach(block => {
    block.addEventListener('click', () => {
        flippingFunc(block);
        const clicked = document.querySelectorAll('.clicked');
        if (clicked.length === 2) {
            block.parentElement.classList.add('stop-clicking');
            setTimeout(() => {
                block.parentElement.classList.remove('stop-clicking');
            }, 500)
            checkFlippedBlocks(clicked[0], clicked[1], clicked);
        }
    });
});