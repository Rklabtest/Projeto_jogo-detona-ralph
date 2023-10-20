const state = {
    view: {
        lives: document.querySelector('#lives'),
        squares: document.querySelectorAll('.square'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        startButton: document.querySelector('#start'),
        pauseButton: document.querySelector('#pause'),
        stopButton: document.querySelector('#stop'),
        message: document.querySelector('#message')
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        startCounter: 3,
        livesCounter: 3,
        listenersControl: false
    },
    actions: {
        startCounterId: null,
        timerId: null,
        countDownTimerId: null
    }
}

function changeView (caller) {
    switch (caller) {
        case 'countDownToStart':
            state.view.pauseButton.removeAttribute('disabled')
            state.view.stopButton.removeAttribute('disabled')
            state.view.startButton.classList.add('hide')
            state.view.pauseButton.classList.remove('hide')
            state.view.message.classList.add('hide')
        break
        
        case 'startGame':
            state.view.message.classList.remove('hide')
            state.view.startButton.setAttribute('disabled','')
            state.view.stopButton.classList.remove('hide')
        break
            
        case 'pauseGame':
            state.view.message.classList.remove('hide')
            state.view.startButton.removeAttribute('disabled')
            state.view.startButton.classList.remove('hide')
            state.view.pauseButton.setAttribute('disabled', '')
            state.view.pauseButton.classList.add('hide')
        break

        case 'stopGame':
            state.view.stopButton.setAttribute('disabled', '')
            state.view.stopButton.classList.add('hide')
            state.view.message.classList.add('hide')
        break

        case 'endGame':
            state.view.message.classList.remove('hide')
    }
}

function countDownToStart() {
    playSound('countdown.wav')
    state.values.startCounter--
    state.view.message.textContent = state.values.startCounter

    if (!state.values.startCounter) {
        clearInterval(state.actions.startCounterId)
        playSound('goo.wav')
        state.view.message.textContent = 'GO!'
        
        setTimeout(() => {
            changeView('countDownToStart')            
            state.actions.timerId = setInterval(randomSquare, state.values.gameVelocity)
            state.actions.countDownTimerId = setInterval(countDown, 1000)

            if(!state.values.listenersControl) {
                addListenerHitBox()
                addPauseEvent()
                addStopEvent()
                state.values.listenersControl = true // para não precisar remover e readicionar estes listeners toda vez que recomeçar o jogo.
            }
        }, 500)
    }
}

function addStartEvent () {
    state.view.startButton.addEventListener('click', startGame)
}

function startGame () {
    state.view.message.textContent = state.values.startCounter
    state.view.score.textContent = state.values.result
    state.view.lives.textContent = `x${state.values.livesCounter}`
    state.view.timeLeft.textContent = state.values.currentTime
    state.actions.startCounterId = setInterval(countDownToStart, 500)
    playSound('countdown.wav')
    changeView('startGame')        
}

function addStopEvent () {
    state.view.stopButton.addEventListener('click', stopGame)
}

function stopGame() {
    state.view.squares.forEach(square => square.classList.remove('enemy'))
    state.values.currentTime = 60
    state.values.result = 0
    state.values.startCounter = 3
    state.values.livesCounter = 3
    pauseGame()
    changeView('stopGame')
}

function addPauseEvent () {
    state.view.pauseButton.addEventListener('click', pauseGame)
}

function pauseGame() {
    state.values.hitPosition = null
    state.values.startCounter = 3
    state.view.startButton.textContent = 'Restart'
    state.view.message.textContent = 'Pausado'
    clearInterval(state.actions.countDownTimerId)
    clearInterval(state.actions.timerId)
    changeView('pauseGame')
}

function countDown () {
    state.values.currentTime--
    state.view.timeLeft.textContent = state.values.currentTime

    if(state.values.currentTime <= 0) {
        stopGame()
        alert(`O seu resultado foi ${state.values.result}`)
    }
}

function playSound(audioName) {
    let audio = new Audio(`./src/audios/${audioName}`)
    audio.volume = 0.2
    audio.play()
}

function randomSquare () {
    state.view.squares.forEach(square => {
        square.classList.remove('enemy')
    })

    let randomNumber = Math.floor(Math.random() * 9)
    let randomSquare = state.view.squares[randomNumber]
    randomSquare.classList.add('enemy')
    state.values.hitPosition = randomSquare.id
}

function endGame() {
    state.view.message.textContent = 'Game over'
    changeView('endGame')
    playSound('gameover.wav')
}

function addListenerHitBox () {
    state.view.squares.forEach(square => {
        square.addEventListener('mousedown', () => {

            if(square.id === state.values.hitPosition) {
                state.values.result++
                state.view.score.textContent = state.values.result
                state.values.hitPosition = null // resetando após clique certo
                playSound('malescream.wav')

            } else if(state.values.hitPosition !== null) {
                state.values.livesCounter--
                state.view.lives.textContent = `x${state.values.livesCounter}`
                playSound('wrong.mp3')
            }
            if(state.values.livesCounter === 0) {
                stopGame()
                endGame()
                changeView('endGame')
            }
        })
    })
}

function init() {
    addStartEvent()
}

init()

// playSound()