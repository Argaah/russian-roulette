// =========================================================
// RUSSIAN ROULETTE
// FULL CLEAN VERSION
// PART 1 / 2
// =========================================================

let gameSessionId = null

// =========================================================
// SUPABASE
// =========================================================

const SUPABASE_URL =
    'https://kasewgqrkfjiqqjqdvjm.supabase.co'

const SUPABASE_KEY =
    'sb_publishable_YXo3nrxsvx_uwof30ogQVg_x-ufLtwY'


let supabaseClient = null


if (
    window.supabase &&
    typeof window.supabase.createClient === 'function'
) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        )

} else {

    console.error(
        'Supabase library was not loaded.'
    )
}


// =========================================================
// DOM HELPER
// =========================================================

const $ = (id) =>
    document.getElementById(id)


// =========================================================
// DOM ELEMENTS
// =========================================================

const game =
    $('game')

const table =
    $('table')

const background =
    $('background')

const enemy =
    $('enemy')

const enemyText =
    $('enemyText')


// ---------------------------------------------------------
// PLAYER ACTION UI
// ---------------------------------------------------------

const playerActions =
    $('playerActions')

const coinChoices =
    $('coinChoices')

const shotMeButton =
    $('shotme')

const shotEnemyButton =
    $('shotenemy')

const shuffleButton =
    $('playershuffle')

const headsButton =
    $('heads')

const tailsButton =
    $('tails')


// ---------------------------------------------------------
// TURN UI
// ---------------------------------------------------------

const turnInfo =
    $('turnInfo')

const actionInfo =
    $('actionInfo')

const enemyAction =
    $('enemyAction')


// ---------------------------------------------------------
// CHAMBER UI
// ---------------------------------------------------------

const chambersLeft =
    $('chambersLeft')

const bulletsLeft =
    $('bulletsLeft')

const blanksLeft =
    $('blanksLeft')

const roundNumber =
    $('roundNumber')

const shuffleCount =
    $('shuffleCount')


// ---------------------------------------------------------
// GUNS
// ---------------------------------------------------------

const playerGun =
    $('gun')

const playerGunShotHimself =
    $('gunshotme')

const enemyGunShotPlayer =
    $('enemygun')

const enemyGunShotHimself =
    $('enemygunshot')


// ---------------------------------------------------------
// COINS
// ---------------------------------------------------------

const coinDown =
    $('coindown')

const coinHead =
    $('coinhead')

const coinTails =
    $('cointails')


// ---------------------------------------------------------
// GAME OVER
// ---------------------------------------------------------

const gameOverScreen =
    $('gameOverScreen')

const gameOverContent =
    $('gameOverContent')

const gameOverTitle =
    $('gameOverTitle')

const newChallengerButton =
    $('newChallengerButton')

const continueText =
    $('continueText')

const winStats =
    $('winStats')

const gunshotFlash =
    $('gunshotFlash')


// ---------------------------------------------------------
// USERNAME
// ---------------------------------------------------------

const usernameInput =
    $('usernameInput')

const saveUsername =
    $('saveUsername')

const currentUsernameElement =
    $('currentUsername')


// ---------------------------------------------------------
// WELCOME
// ---------------------------------------------------------

const welcomeScreen =
    $('welcomeScreen')

const welcomeUsernameInput =
    $('welcomeUsernameInput')

const welcomePlayButton =
    $('welcomePlayButton')

const changeUsernameButton =
    $('changeUsernameButton')

const welcomeError =
    $('welcomeError')


// =========================================================
// USERNAME STATE
// =========================================================

let playerUsername =
    localStorage.getItem(
        'playerUsername'
    ) || ''


let hasLoggedIn =
    localStorage.getItem(
        'playerHasLoggedIn'
    ) === 'true'


// =========================================================
// VALIDATE USERNAME
// =========================================================

function validateUsername(
    value
) {

    const username =
        String(
            value ?? ''
        ).trim()


    if (!username) {

        return {
            valid: false,

            message:
                'Please enter your username.'
        }
    }


    if (
        username.length < 2
    ) {

        return {
            valid: false,

            message:
                'Username must contain at least 2 characters.'
        }
    }


    if (
        username.length > 20
    ) {

        return {
            valid: false,

            message:
                'Username must be 20 characters or less.'
        }
    }


    if (
        !/^[a-zA-Z0-9_ ]+$/.test(
            username
        )
    ) {

        return {
            valid: false,

            message:
                'Username can only contain letters, numbers, spaces, and _.'
        }
    }


    return {
        valid: true,

        username
    }
}


// =========================================================
// UPDATE USERNAME UI
// =========================================================

function updateUsernameUI() {

    if (usernameInput) {

        usernameInput.value =
            playerUsername
    }


    if (currentUsernameElement) {

        currentUsernameElement.textContent =
            playerUsername || 'Guest'
    }
}


// =========================================================
// WELCOME ERROR
// =========================================================

function showWelcomeError(
    message
) {

    if (!welcomeError)
        return


    welcomeError.textContent =
        message


    welcomeError.classList.add(
        'show'
    )
}


function hideWelcomeError() {

    if (!welcomeError)
        return


    welcomeError.textContent =
        ''


    welcomeError.classList.remove(
        'show'
    )
}


// =========================================================
// SET USERNAME
// =========================================================

function setPlayerUsername(
    value
) {

    const result =
        validateUsername(
            value
        )


    if (!result.valid)
        return false


    playerUsername =
        result.username


    hasLoggedIn =
        true


    localStorage.setItem(
        'playerUsername',
        playerUsername
    )


    localStorage.setItem(
        'playerLoggedIn',
        'true'
    )


    localStorage.setItem(
        'playerHasLoggedIn',
        'true'
    )


    updateUsernameUI()


    return true
}


// =========================================================
// CHANGE USERNAME
// =========================================================

function changeUsername() {

    localStorage.removeItem(
        'playerUsername'
    )

    localStorage.removeItem(
        'playerLoggedIn'
    )

    localStorage.removeItem(
        'playerHasLoggedIn'
    )


    playerUsername =
        ''

    hasLoggedIn =
        false


    if (welcomeUsernameInput) {

        welcomeUsernameInput.value =
            ''
    }


    hideWelcomeError()


    if (welcomeScreen) {

        welcomeScreen.style.display =
            'flex'

        welcomeScreen.style.opacity =
            '1'

        welcomeScreen.style.pointerEvents =
            'auto'
    }


    if (game) {

        game.style.pointerEvents =
            'none'
    }


    if (welcomeUsernameInput) {

        welcomeUsernameInput.focus()
    }


    updateUsernameUI()
}


// =========================================================
// SHOW WELCOME
// =========================================================

function showWelcomeScreen() {

    if (!welcomeScreen)
        return


    welcomeScreen.style.display =
        'flex'


    requestAnimationFrame(
        () => {

            welcomeScreen.style.opacity =
                '1'

            welcomeScreen.style.pointerEvents =
                'auto'
        }
    )


    if (game) {

        game.style.pointerEvents =
            'none'
    }


    if (welcomeUsernameInput) {

        welcomeUsernameInput.value =
            playerUsername


        if (!playerUsername) {

            setTimeout(
                () => {

                    welcomeUsernameInput.focus()

                },
                200
            )
        }
    }
}


// =========================================================
// HIDE WELCOME
// =========================================================

function hideWelcomeScreen() {

    if (!welcomeScreen)
        return


    welcomeScreen.style.opacity =
        '0'


    welcomeScreen.style.pointerEvents =
        'none'


    if (game) {

        game.style.pointerEvents =
            'auto'
    }


    setTimeout(
        () => {

            if (!welcomeScreen)
                return


            welcomeScreen.style.display =
                'none'

        },
        500
    )
}


// =========================================================
// PLAY FROM WELCOME
// =========================================================

function playFromWelcome() {

    console.log('PLAY BUTTON CLICKED')


    // Jangan gunakan:
    // if (gameStarted) return
    //
    // Karena welcome screen memang harus bisa
    // memulai game walaupun state sebelumnya true.


    hideWelcomeError()


    // Ambil username dari input welcome
    let username =
        playerUsername || ''


    const input =
        document.getElementById(
            'welcomeUsernameInput'
        )


    if (input) {

        username =
            input.value.trim()
    }


    console.log(
        'Username:',
        username
    )


    // Validasi username
    const result =
        validateUsername(
            username
        )


    if (!result.valid) {

        console.log(
            'Username invalid:',
            result.message
        )


        showWelcomeError(
            result.message
        )


        if (input) {

            input.focus()

            input.classList.add(
                'input-error'
            )


            setTimeout(
                () => {

                    input.classList.remove(
                        'input-error'
                    )

                },
                500
            )
        }


        return
    }


    // Simpan username
    setPlayerUsername(
        result.username
    )


    // Login
    hasLoggedIn =
        true


    localStorage.setItem(
        'playerLoggedIn',
        'true'
    )


    localStorage.setItem(
        'playerHasLoggedIn',
        'true'
    )


    console.log(
        'Starting game...'
    )


    // Audio harus dimulai dari user interaction
    startGameSounds()


    // Tutup welcome
    hideWelcomeScreen()


    // Mulai game
    startGame()


    console.log(
        'GAME STARTED'
    )
}

// =========================================================
// AUDIO
// =========================================================

const sounds = {

    coinFlip:
        new Audio(
            './sounds/coinflip.mp3'
        ),

    coinResult:
        new Audio(
            './sounds/resultcoinflip.mp3'
        ),

    showGun:
        new Audio(
            './sounds/showgun.mp3'
        ),

    clock:
        new Audio(
            './sounds/clock.mp3'
        ),

    detak:
        new Audio(
            './sounds/detak.mp3'
        ),

    blank:
        new Audio(
            './sounds/blank.mp3'
        ),

    shot:
        new Audio(
            './sounds/shot.mp3'
        ),

    shuffle:
        new Audio(
            './sounds/shuffle.mp3'
        ),

    enemyLaugh1:
        new Audio(
            './sounds/enemylaugh.mp3'
        ),

    enemyLaugh2:
        new Audio(
            './sounds/enemylaugh2.mp3'
        ),

    enemyLaugh3:
        new Audio(
            './sounds/enemylaugh3.mp3'
        ),

    backsound:
        new Audio(
            './sounds/backsound.mp3'
        )
}


sounds.clock.loop =
    true

sounds.detak.loop =
    true

sounds.backsound.loop =
    true


sounds.clock.volume =
    1

sounds.detak.volume =
    0.5

sounds.backsound.volume =
    1

sounds.shuffle.volume =
    0.8

sounds.enemyLaugh1.volume =
    0.8

sounds.enemyLaugh2.volume =
    0.8

sounds.enemyLaugh3.volume =
    0.8


let gameSoundsStarted =
    false


// =========================================================
// PLAY SOUND
// =========================================================

function playSound(
    sound
) {

    if (!sound)
        return


    try {

        sound.currentTime =
            0


        const promise =
            sound.play()


        if (
            promise &&
            typeof promise.catch ===
                'function'
        ) {

            promise.catch(
                () => {}
            )
        }

    } catch (error) {

        console.warn(
            'Audio error:',
            error
        )
    }
}


// =========================================================
// START GAME SOUNDS
// =========================================================

function startGameSounds() {

    if (gameSoundsStarted)
        return


    gameSoundsStarted =
        true


    const backgroundSounds = [

        sounds.clock,

        sounds.detak,

        sounds.backsound

    ]


    backgroundSounds.forEach(
        sound => {

            if (!sound)
                return


            sound.currentTime =
                0


            const promise =
                sound.play()


            if (
                promise &&
                typeof promise.catch ===
                    'function'
            ) {

                promise.catch(
                    () => {}
                )
            }
        }
    )
}


// =========================================================
// STOP GAME SOUNDS
// =========================================================

function stopGameSounds() {

    gameSoundsStarted =
        false


    const backgroundSounds = [

        sounds.clock,

        sounds.detak,

        sounds.backsound

    ]


    backgroundSounds.forEach(
        sound => {

            if (!sound)
                return


            sound.pause()


            try {

                sound.currentTime =
                    0

            } catch (error) {}

        }
    )
}


// =========================================================
// RANDOM ENEMY LAUGH
// =========================================================

function playRandomEnemyLaugh() {

    const laughs = [

        sounds.enemyLaugh1,

        sounds.enemyLaugh2,

        sounds.enemyLaugh3

    ]


    const sound =
        laughs[
            Math.floor(
                Math.random() *
                laughs.length
            )
        ]


    playSound(
        sound
    )
}


// =========================================================
// GAME CONSTANTS
// =========================================================

const MAX_CHAMBERS =
    6


const MAX_SHUFFLE_PER_ROUND =
    2


const SHOOT_DELAY =
    5000


const ENEMY_THINK_DELAY =
    1500


// =========================================================
// GAME STATE
// =========================================================

let gameStarted =
    false

let gameOver =
    false

let gunHolder =
    null

let playerCoinGuess =
    null

let coinAlreadyFlipped =
    false

let actionLocked =
    false


// =========================================================
// CHAMBERS
// =========================================================

let chambers =
    []

let currentChamber =
    0

let currentRound =
    1

let roundBulletCount =
    0

let roundBlankCount =
    0


// =========================================================
// SHUFFLE STATE
// =========================================================

let playerShuffleCount =
    0

let enemyShuffleCount =
    0


// =========================================================
// ENEMY TAUNT SYSTEM
// =========================================================

const enemyTaunts = [

    "You're getting nervous?",

    "Haha... is that all you've got?",

    "Come on... pick carefully.",

    "Are you sure about that?",

    "This is getting interesting...",

    "Hehehe...",

    "Don't disappoint me.",

    "You look scared.",

    "Your turn...",

    "Let's see what happens.",

    "You really want to try that?",

    "I hope you're ready.",

    "Getting cold feet?",

    "You should have thought twice.",

    "Don't blink.",

    "I wonder how brave you really are.",

    "That hesitation gave you away.",

    "Go ahead... I'm waiting.",

    "This could be your last mistake.",

    "Heh... you're making this too easy.",

    "Main epep aja dekk."

]


// =========================================================
// TAUNT VARIABLES
// =========================================================

let enemyTauntTimer = null
let enemyTalkHideTimer = null

let enemyIsTalking = false


// =========================================================
// RANDOM LAUGH
// =========================================================

function playRandomEnemyLaugh() {

    const laughs = [
        sounds.enemyLaugh1,
        sounds.enemyLaugh2,
        sounds.enemyLaugh3
    ]

    const randomIndex =
        Math.floor(
            Math.random() * laughs.length
        )

    playSound(
        laughs[randomIndex]
    )
}


// =========================================================
// ENEMY TALK
// =========================================================

function enemyTalk() {

   



    enemyIsTalking = true


    // =====================================================
    // RANDOM TEXT
    // =====================================================

    const randomIndex =
        Math.floor(
            Math.random() *
            enemyTaunts.length
        )


    const message =
        enemyTaunts[randomIndex]


    


    // =====================================================
    // RANDOM LAUGH
    // =====================================================

    playRandomEnemyLaugh()


    // =====================================================
    // TEXT
    // =====================================================

    enemyText.textContent =
        message


    // =====================================================
    // RESET ANIMATION
    // =====================================================

    enemyText.style.opacity =
        '0'

    enemyText.style.transform =
        'translateY(10px) scale(.98)'


    /*
    Force browser reflow.
    */

    void enemyText.offsetWidth


    // =====================================================
    // SHOW
    // =====================================================

    enemyText.style.opacity =
        '1'

    enemyText.style.transform =
        'translateY(0) scale(1)'


    // =====================================================
    // CLEAR TIMER LAMA
    // =====================================================

    if (
        enemyTalkHideTimer !== null
    ) {

        clearTimeout(
            enemyTalkHideTimer
        )

    }


    // =====================================================
    // HIDE SETELAH 3 DETIK
    // =====================================================

    enemyTalkHideTimer =
        setTimeout(() => {

            if (!enemyText)
                return


            enemyText.style.opacity =
                '0'

            enemyText.style.transform =
                'translateY(10px) scale(.98)'


            enemyIsTalking =
                false


            enemyTalkHideTimer =
                null


        }, 3000)

}


// =========================================================
// START TAUNT
// =========================================================

function startEnemyTaunts() {

    


    /*
    Hapus timer sebelumnya.
    */

    stopEnemyTaunts()


    if (gameOver)
        return


    /*
    =====================================================
    TAUNT PERTAMA

    Jangan menunggu 5-10 detik.
    Enemy langsung ngomong setelah 2 detik.
    =====================================================
    */

    enemyTauntTimer =
        setTimeout(() => {

            if (gameOver)
                return


            enemyTalk()


            scheduleEnemyTaunt()


        }, 2000)

}


// =========================================================
// SCHEDULE TAUNT BERIKUTNYA
// =========================================================

function scheduleEnemyTaunt() {

    if (gameOver)
        return


    /*
    5 - 10 detik.
    */

    const delay =
        Math.floor(
            Math.random() * 5000
        ) + 5000


    

    enemyTauntTimer =
        setTimeout(() => {

            if (gameOver)
                return


            enemyTalk()


            scheduleEnemyTaunt()


        }, delay)

}


// =========================================================
// STOP TAUNT
// =========================================================

function stopEnemyTaunts() {



    /*
    Stop main timer.
    */

    if (
        enemyTauntTimer !== null
    ) {

        clearTimeout(
            enemyTauntTimer
        )

        enemyTauntTimer =
            null

    }


    /*
    Stop hide timer.
    */

    if (
        enemyTalkHideTimer !== null
    ) {

        clearTimeout(
            enemyTalkHideTimer
        )

        enemyTalkHideTimer =
            null

    }


    enemyIsTalking =
        false


    /*
    Hide text.
    */

    if (enemyText) {

        enemyText.style.opacity =
            '0'

        enemyText.style.transform =
            'translateY(10px) scale(.98)'

    }

}
// =========================================================
// FORCE REFLOW
// =========================================================

function forceReflow(
    element
) {

    if (!element)
        return


    void element.offsetWidth
}


// =========================================================
// PLAYER ACTION UI
// =========================================================

function showPlayerActions() {

    if (coinChoices) {

        coinChoices.classList.add(
            'hidden'
        )
    }


    if (playerActions) {

        playerActions.classList.remove(
            'hidden'
        )
    }


    updatePlayerButtons()
}


function hidePlayerActions() {

    if (playerActions) {

        playerActions.classList.add(
            'hidden'
        )
    }


    if (coinChoices) {

        coinChoices.classList.add(
            'hidden'
        )
    }
}


// =========================================================
// SHOW COIN UI
// =========================================================

function showCoinUI() {

    if (coinChoices) {

        coinChoices.classList.remove(
            'hidden'
        )
    }


    if (playerActions) {

        playerActions.classList.add(
            'hidden'
        )
    }


    if (headsButton) {

        headsButton.disabled =
            false
    }


    if (tailsButton) {

        tailsButton.disabled =
            false
    }
}


// =========================================================
// UPDATE PLAYER BUTTONS
// =========================================================

function updatePlayerButtons() {

    const canPlay =
        gameStarted &&
        !gameOver &&
        !actionLocked &&
        gunHolder === 'player'


    if (shotMeButton) {

        shotMeButton.disabled =
            !canPlay
    }


    if (shotEnemyButton) {

        shotEnemyButton.disabled =
            !canPlay
    }


    if (shuffleButton) {

        shuffleButton.disabled =
            !canPlay ||
            playerShuffleCount >=
                MAX_SHUFFLE_PER_ROUND
    }


    if (shuffleCount) {

        shuffleCount.textContent =
            playerShuffleCount
    }
}


// =========================================================
// UPDATE TURN UI
// =========================================================

function updateTurnUI() {

    if (!turnInfo ||
        !actionInfo
    ) {

        return
    }


    if (gameOver) {

        turnInfo.textContent =
            'GAME OVER'

        actionInfo.textContent =
            ''

        return
    }


    if (
        gunHolder ===
        'player'
    ) {

        turnInfo.textContent =
            'YOUR TURN'

        turnInfo.style.color =
            '#e7c87a'

        actionInfo.textContent =
            'Choose your target...'

        return
    }


    if (
        gunHolder ===
        'enemy'
    ) {

        turnInfo.textContent =
            'ENEMY TURN'

        turnInfo.style.color =
            '#b64040'

        actionInfo.textContent =
            'The enemy is deciding...'

        return
    }


    turnInfo.textContent =
        'WAITING'

    turnInfo.style.color =
        '#e7c87a'

    actionInfo.textContent =
        'The coin decides who goes first.'
}


// =========================================================
// ENEMY ACTION TEXT
// =========================================================

function setEnemyAction(
    text
) {

    if (!enemyAction)
        return


    enemyAction.style.opacity =
        '0'


    setTimeout(
        () => {

            if (!enemyAction)
                return


            enemyAction.textContent =
                text


            enemyAction.style.opacity =
                '1'

        },
        100
    )
}


// =========================================================
// SHUFFLE ARRAY
// =========================================================

function shuffleArray(
    array
) {

    for (
        let i =
            array.length - 1;

        i > 0;

        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
            )


        ;[
            array[i],
            array[j]
        ] = [
            array[j],
            array[i]
        ]
    }


    return array
}


// =========================================================
// CREATE NEW ROUND
// =========================================================

function createNewRound() {

    chambers =
        []

    currentChamber =
        0


    playerShuffleCount =
        0

    enemyShuffleCount =
        0


    // -----------------------------------------------------
    // 1 - 5 BULLETS
    // -----------------------------------------------------

    roundBulletCount =
        Math.floor(
            Math.random() * 5
        ) + 1


    roundBlankCount =
        MAX_CHAMBERS -
        roundBulletCount


    // -----------------------------------------------------
    // CREATE BULLETS
    // -----------------------------------------------------

    for (
        let i = 0;

        i <
        roundBulletCount;

        i++
    ) {

        chambers.push(
            'bullet'
        )
    }


    // -----------------------------------------------------
    // CREATE BLANKS
    // -----------------------------------------------------

    for (
        let i = 0;

        i <
        roundBlankCount;

        i++
    ) {

        chambers.push(
            'blank'
        )
    }


    // -----------------------------------------------------
    // SHUFFLE
    // -----------------------------------------------------

    shuffleArray(
        chambers
    )


    updateChamberUI()



}


// =========================================================
// SHUFFLE REMAINING CHAMBERS
// =========================================================

function shuffleChambers() {

    const remaining =
        chambers.slice(
            currentChamber
        )


    shuffleArray(
        remaining
    )


    chambers.splice(
        currentChamber,

        remaining.length,

        ...remaining
    )


   
}


// =========================================================
// PLAYER SHUFFLE
// =========================================================

function playerShuffle() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (
        gunHolder !==
        'player'
    )
        return


    if (
        playerShuffleCount >=
        MAX_SHUFFLE_PER_ROUND
    )
        return


    const remaining =
        chambers.length -
        currentChamber


    if (remaining <= 1)
        return


    playerShuffleCount++


    shuffleChambers()


    playSound(
        sounds.shuffle
    )


    setEnemyAction(
        'You shuffled the chamber...'
    )


    if (actionInfo) {

        actionInfo.textContent =
            'The remaining chambers were shuffled.'
    }


    updatePlayerButtons()
}


// =========================================================
// ENEMY SHUFFLE
// =========================================================

function enemyShuffle() {

    if (gameOver)
        return false


    if (
        enemyShuffleCount >=
        MAX_SHUFFLE_PER_ROUND
    )
        return false


    const remaining =
        chambers.length -
        currentChamber


    if (remaining <= 1)
        return false


    enemyShuffleCount++


    shuffleChambers()


    playSound(
        sounds.shuffle
    )


    return true
}


// =========================================================
// RANDOM BULLET / BLANK
// =========================================================

function randomResult() {

    // -----------------------------------------------------
    // NEW ROUND WHEN ALL CHAMBERS ARE USED
    // -----------------------------------------------------

    if (
        currentChamber >=
        chambers.length
    ) {

        currentRound++

        createNewRound()
    }


    const result =
        chambers[
            currentChamber
        ]


    


    currentChamber++


    updateChamberUI()


    return result
}


// =========================================================
// UPDATE CHAMBER UI
// =========================================================

function updateChamberUI() {

    if (chambersLeft) {

        chambersLeft.textContent =
            Math.max(
                MAX_CHAMBERS -
                currentChamber,
                0
            )
    }


    if (bulletsLeft) {

        bulletsLeft.textContent =
            roundBulletCount
    }


    if (blanksLeft) {

        blanksLeft.textContent =
            roundBlankCount
    }


    if (roundNumber) {

        roundNumber.textContent =
            currentRound
    }


    if (shuffleCount) {

        shuffleCount.textContent =
            playerShuffleCount
    }
}


// =========================================================
// GUN VISUAL HELPERS
// =========================================================

function hideGun(
    element
) {

    if (!element)
        return


    element.classList.remove(
        'gun-visible',
        'gun-idle'
    )


    element.classList.add(
        'gun-hidden'
    )
}


function showGun(
    element,
    idle = false
) {

    if (!element)
        return


    hideGun(
        element
    )


    forceReflow(
        element
    )


    element.classList.remove(
        'gun-hidden'
    )


    element.classList.add(
        'gun-visible'
    )


    if (idle) {

        element.classList.add(
            'gun-idle'
        )
    }
}


// =========================================================
// HIDE ALL GUNS
// =========================================================

function hideAllGuns() {

    hideGun(
        playerGun
    )

    hideGun(
        playerGunShotHimself
    )

    hideGun(
        enemyGunShotPlayer
    )

    hideGun(
        enemyGunShotHimself
    )
}


function playerHideGun() {

    hideGun(
        playerGun
    )

    hideGun(
        playerGunShotHimself
    )
}


function enemyHideGun() {

    hideGun(
        enemyGunShotPlayer
    )

    hideGun(
        enemyGunShotHimself
    )
    }


// =========================================================
// PLAYER SHOOT VISUAL
// =========================================================

function playerShotEnemy() {

    hideGun(
        playerGunShotHimself
    )


    showGun(
        playerGun,
        true
    )


    playSound(
        sounds.showGun
    )
}


function playerShotHimself() {

    hideGun(
        playerGun
    )


    showGun(
        playerGunShotHimself,
        true
    )


    playSound(
        sounds.showGun
    )
}


// =========================================================
// ENEMY SHOOT VISUAL
// =========================================================

function enemyShotPlayer() {

    hideGun(
        enemyGunShotHimself
    )


    showGun(
        enemyGunShotPlayer
    )


    playSound(
        sounds.showGun
    )
}


function enemyShotHimself() {

    hideGun(
        enemyGunShotPlayer
    )


    showGun(
        enemyGunShotHimself
    )


    playSound(
        sounds.showGun
    )
}


// =========================================================
// SET TURN
// =========================================================

function setTurn(
    holder
) {

    if (gameOver)
        return


    gunHolder =
        holder


    actionLocked =
        false


    playerHideGun()
    enemyHideGun()


    if (coinDown) {

        coinDown.style.opacity =
            '0'
    }


    if (coinHead) {

        coinHead.style.opacity =
            '0'
    }


    if (coinTails) {

        coinTails.style.opacity =
            '0'
    }


    updateTurnUI()


    if (
        holder ===
        'player'
    ) {

        setEnemyAction(
            'Waiting for your move...'
        )


        showPlayerActions()

    } else {

        hidePlayerActions()


        setEnemyAction(
            'Enemy is thinking...'
        )
    }


    updatePlayerButtons()
}


// =========================================================
// SET COIN DOWN
// =========================================================

function setCoinDown() {

    if (coinDown) {

        coinDown.style.display =
            'block'

        coinDown.style.opacity =
            '1'
    }


    if (coinHead) {

        coinHead.style.display =
            'block'

        coinHead.style.opacity =
            '0'
    }


    if (coinTails) {

        coinTails.style.display =
            'block'

        coinTails.style.opacity =
            '0'
    }
}


// =========================================================
// CHOOSE HEADS
// =========================================================

function chooseHeads() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (coinAlreadyFlipped)
        return


    playerCoinGuess =
        'heads'


    startGameSounds()


    flipCoinOnce()
}


// =========================================================
// CHOOSE TAILS
// =========================================================

function chooseTails() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (coinAlreadyFlipped)
        return


    playerCoinGuess =
        'tails'


    startGameSounds()


    flipCoinOnce()
}


// =========================================================
// COIN FLIP
// =========================================================

function flipCoinOnce() {

    if (coinAlreadyFlipped)
        return


    coinAlreadyFlipped =
        true


    actionLocked =
        true


    hidePlayerActions()


    if (coinDown) {

        coinDown.style.display =
            'block'

        coinDown.style.opacity =
            '1'
    }


    if (coinHead) {

        coinHead.style.opacity =
            '0'
    }


    if (coinTails) {

        coinTails.style.opacity =
            '0'
    }


    forceReflow(
        coinDown
    )


    playSound(
        sounds.coinFlip
    )


    const result =
        Math.random() < 0.5
            ? 'heads'
            : 'tails'


   


    // -----------------------------------------------------
    // FLIP ANIMATION
    // -----------------------------------------------------

    setTimeout(
        () => {

            if (gameOver)
                return


            if (coinDown) {

                coinDown.style.opacity =
                    '0'
            }


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    if (
                        result ===
                        'heads'
                    ) {

                        if (coinHead) {

                            coinHead.style.opacity =
                                '1'
                        }

                    } else {

                        if (coinTails) {

                            coinTails.style.opacity =
                                '1'
                        }
                    }


                    playSound(
                        sounds.coinResult
                    )


                    // -------------------------------------------------
                    // SHOW RESULT FOR 2 SEC
                    // -------------------------------------------------

                    setTimeout(
                        () => {

                            if (coinHead) {

                                coinHead.style.opacity =
                                    '0'
                            }


                            if (coinTails) {

                                coinTails.style.opacity =
                                    '0'
                            }


                            setTimeout(
                                () => {

                                    if (gameOver)
                                        return


                                    if (
                                        playerCoinGuess ===
                                        result
                                    ) {

                                      


                                        setTurn(
                                            'player'
                                        )


                                    } else {

                                     


                                        setTurn(
                                            'enemy'
                                        )


                                        setTimeout(
                                            () => {

                                                if (!gameOver) {

                                                    enemyTurn()
                                                }

                                            },
                                            1000
                                        )
                                    }

                                },
                                500
                            )

                        },
                        2000
                    )

                },
                600
            )

        },
        1800
    )
}


// =========================================================
// PLAYER SHOOT SELF
// =========================================================

function playerShootSelf() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (
        gunHolder !==
        'player'
    )
        return


    actionLocked =
        true


    updatePlayerButtons()


    if (turnInfo) {

        turnInfo.textContent =
            'YOUR TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'You are aiming at yourself...'
    }


    setEnemyAction(
        'He is pointing it at himself...'
    )


    playerShotHimself()


    const result =
        randomResult()


    setTimeout(
        () => {

            if (gameOver)
                return


            // -------------------------------------------------
            // BULLET
            // -------------------------------------------------

            if (
                result ===
                'bullet'
            ) {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'PLAYER HIT'
                )


                setTimeout(
                    () => {

                        playerLostGame()

                    },
                    700
                )


                return
            }


            // -------------------------------------------------
            // BLANK
            // -------------------------------------------------

            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    setTurn(
                        'player'
                    )


                    if (actionInfo) {

                        actionInfo.textContent =
                            'The chamber was empty. You get another turn.'
                    }


                    updatePlayerButtons()

                },
                500
            )

        },
        SHOOT_DELAY
    )
}


// =========================================================
// PLAYER SHOOT ENEMY
// =========================================================

function playerShootEnemy() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (
        gunHolder !==
        'player'
    )
        return


    actionLocked =
        true


    updatePlayerButtons()


    if (turnInfo) {

        turnInfo.textContent =
            'YOUR TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'Aiming at the enemy...'
    }


    setEnemyAction(
        'You are aiming at me?'
    )


    playerShotEnemy()


    const result =
        randomResult()


    setTimeout(
        () => {

            if (gameOver)
                return


            // -------------------------------------------------
            // BULLET
            // -------------------------------------------------

            if (
                result ===
                'bullet'
            ) {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'ENEMY HIT'
                )


                setTimeout(
                    () => {

                        playerWonGame()

                    },
                    700
                )


                return
            }


            // -------------------------------------------------
            // BLANK
            // -------------------------------------------------

            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    setTurn(
                        'enemy'
                    )


                    setTimeout(
                        () => {

                            if (!gameOver) {

                                enemyTurn()
                            }

                        },
                        1000
                    )

                },
                500
            )

        },
        SHOOT_DELAY
    )
}
// =========================================================
// PLAYER SHOOT SELF
// =========================================================

function playerShootSelf() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (gunHolder !== 'player')
        return


    actionLocked = true

    updatePlayerButtons()


    if (turnInfo) {

        turnInfo.textContent =
            'YOUR TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'You are aiming at yourself...'
    }


    setEnemyAction(
        'He is pointing it at himself...'
    )


    playerShotHimself()


    const result =
        randomResult()


    setTimeout(
        () => {

            if (gameOver)
                return


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'PLAYER HIT'
                )


                setTimeout(
                    () => {

                        playerLostGame()

                    },
                    700
                )


                return
            }


            // =================================================
            // BLANK
            // =================================================

            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    // Player menembak dirinya sendiri
                    // dan mendapat blank.
                    // Player mendapatkan turn lagi.

                    setTurn(
                        'player'
                    )


                    if (actionInfo) {

                        actionInfo.textContent =
                            'The chamber was empty. You get another turn.'
                    }


                    updatePlayerButtons()

                },
                500
            )

        },
        SHOOT_DELAY
    )
}


// =========================================================
// PLAYER SHOOT ENEMY
// =========================================================

function playerShootEnemy() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (gunHolder !== 'player')
        return


    actionLocked = true

    updatePlayerButtons()


    if (turnInfo) {

        turnInfo.textContent =
            'YOUR TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'Aiming at the enemy...'
    }


    setEnemyAction(
        'You are aiming at me?'
    )


    playerShotEnemy()


    const result =
        randomResult()


    setTimeout(
        () => {

            if (gameOver)
                return


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'ENEMY HIT'
                )


                setTimeout(
                    () => {

                        playerWonGame()

                    },
                    700
                )


                return
            }


            // =================================================
            // BLANK
            // =================================================

            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    setTurn(
                        'enemy'
                    )


                    setTimeout(
                        () => {

                            if (!gameOver)
                                enemyTurn()

                        },
                        1000
                    )

                },
                500
            )

        },
        SHOOT_DELAY
    )
}


// =========================================================
// ENEMY TURN
// =========================================================

function enemyTurn() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (gunHolder !== 'enemy')
        return

    if (actionLocked)
        return


    hidePlayerActions()


    if (turnInfo) {

        turnInfo.textContent =
            'ENEMY TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'The enemy is deciding...'
    }


    setEnemyAction(
        'Enemy is thinking...'
    )


    enemyHideGun()


    actionLocked = true


    setTimeout(
        () => {

            if (gameOver)
                return


            const remaining =
                chambers.length -
                currentChamber


            const canShuffle =
                enemyShuffleCount <
                    MAX_SHUFFLE_PER_ROUND &&
                remaining > 1


            // =================================================
            // ENEMY SHUFFLE
            // =================================================

            if (
                canShuffle &&
                Math.random() < 0.30
            ) {

                setEnemyAction(
                    'Enemy is shuffling the chamber...'
                )


                if (actionInfo) {

                    actionInfo.textContent =
                        'The enemy is rearranging the chambers...'
                }


                enemyShuffle()


                setTimeout(
                    () => {

                        if (gameOver)
                            return


                        actionLocked = false


                        enemyTurn()

                    },
                    1000
                )


                return
            }


            // =================================================
            // ENEMY CHOOSES TARGET
            // =================================================

            actionLocked = false


            if (Math.random() < 0.5) {

                setEnemyAction(
                    'Enemy is aiming at you...'
                )


                enemyShootPlayer()

            } else {

                setEnemyAction(
                    'Enemy is aiming at himself...'
                )


                enemyShootSelf()
            }

        },
        ENEMY_THINK_DELAY
    )
}


// =========================================================
// ENEMY SHOOT PLAYER
// =========================================================

function enemyShootPlayer() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (gunHolder !== 'enemy')
        return


    actionLocked = true


    if (turnInfo) {

        turnInfo.textContent =
            'ENEMY TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'Enemy is aiming at you...'
    }


    setEnemyAction(
        'Enemy is pointing the gun at you.'
    )


    enemyShotPlayer()


    const result =
        randomResult()


    setTimeout(
        () => {

            if (gameOver)
                return


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'BANG!'
                )


                setTimeout(
                    () => {

                        playerLostGame()

                    },
                    700
                )


                return
            }


            // =================================================
            // BLANK
            // =================================================

            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    setTurn(
                        'player'
                    )


                    updatePlayerButtons()

                },
                500
            )

        },
        SHOOT_DELAY
    )
}


// =========================================================
// ENEMY SHOOT SELF
// =========================================================

function enemyShootSelf() {

    if (!gameStarted)
        return

    if (gameOver)
        return

    if (actionLocked)
        return

    if (gunHolder !== 'enemy')
        return


    actionLocked = true


    if (turnInfo) {

        turnInfo.textContent =
            'ENEMY TURN'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'Enemy is aiming at himself...'
    }


    setEnemyAction(
        'Enemy pulls the trigger...'
    )


    enemyShotHimself()


    const result =
        randomResult()


    setTimeout(
        () => {

            if (gameOver)
                return


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'BANG!'
                )


                setTimeout(
                    () => {

                        playerWonGame()

                    },
                    700
                )


                return
            }


            // =================================================
            // BLANK
            // =================================================

            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(
                () => {

                    if (gameOver)
                        return


                    // Enemy menembak dirinya sendiri
                    // dan mendapat blank.
                    // Enemy mendapatkan turn lagi.

                    setTurn(
                        'enemy'
                    )


                    if (actionInfo) {

                        actionInfo.textContent =
                            'The chamber was empty. Enemy gets another turn.'
                    }


                    setTimeout(
                        () => {

                            if (!gameOver)
                                enemyTurn()

                        },
                        1000
                    )

                },
                500
            )

        },
        SHOOT_DELAY
    )
}


// =========================================================
// GUNSHOT EFFECT
// =========================================================

function gunshotEffect() {

    if (!game)
        return


    game.classList.remove(
        'gunshot-shake'
    )


    forceReflow(
        game
    )


    game.classList.add(
        'gunshot-shake'
    )


    if (gunshotFlash) {

        gunshotFlash.classList.remove(
            'gunshot-flash'
        )


        forceReflow(
            gunshotFlash
        )


        gunshotFlash.classList.add(
            'gunshot-flash'
        )
    }


    setTimeout(
        () => {

            if (game) {

                game.classList.remove(
                    'gunshot-shake'
                )
            }


            if (gunshotFlash) {

                gunshotFlash.classList.remove(
                    'gunshot-flash'
                )
            }

        },
        500
    )
}

// =========================================================
// PLAYER WON
// =========================================================

async function playerWonGame() {

    if (gameOver)
        return


    gameOver =
        true

    actionLocked =
        true


    stopGameSounds()
    stopEnemyTaunts()


    // ==============================
    // SAVE WIN TO SERVER
    // ==============================

    const winSaved =
        await addPlayerWin()


    // ==============================
    // GET UPDATED WINS
    // ==============================

    const currentWins =
        await getPlayerWins()


    console.log(
        'Win saved:',
        winSaved
    )

    console.log(
        'Current wins:',
        currentWins
    )


    if (enemy) {

        enemy.classList.add(
            'enemy-death'
        )
    }


    if (enemyGunShotPlayer) {

        enemyGunShotPlayer.classList.add(
            'enemy-death'
        )
    }


    if (enemyGunShotHimself) {

        enemyGunShotHimself.classList.add(
            'enemy-death'
        )
    }


    setTimeout(
        () => {

            enemyHideGun()


            if (gameOverScreen) {

                gameOverScreen.style.pointerEvents =
                    'auto'

                gameOverScreen.style.opacity =
                    '1'

                gameOverScreen.style.background =
                    'rgba(0, 0, 0, .88)'
            }


            if (gameOverTitle) {

                gameOverTitle.textContent =
                    'Just Luck..'
            }


            if (newChallengerButton) {

                newChallengerButton.style.display =
                    'block'
            }


            if (continueText) {

                continueText.style.display =
                    'none'
            }


            if (winStats) {

                winStats.textContent =
                    currentWins
            }


            if (gameOverContent) {

                setTimeout(
                    () => {

                        gameOverContent.style.opacity =
                            '1'

                        gameOverContent.style.transform =
                            'translateY(0) scale(1)'

                    },
                    300
                )
            }

        },
        800
    )
}
// =========================================================
// GET PLAYER WINS
// =========================================================

async function getPlayerWins() {

    if (!supabaseClient)
        return 0


    const username =
        String(
            playerUsername || ''
        ).trim()


    if (!username)
        return 0


    const {
        data,
        error
    } =
        await supabaseClient
            .from('leaderboard')
            .select('wins')
            .eq(
                'username',
                username
            )
            .maybeSingle()


    if (error) {

        console.error(
            'GET PLAYER WINS ERROR:',
            error
        )

        return 0
    }


    if (!data)
        return 0


    return (
        Number(
            data.wins
        ) || 0
    )
}


// =========================================================
// PLAYER LOST
// =========================================================

function playerLostGame() {

    if (gameOver)
        return


    gameOver = true

    actionLocked = true


    stopGameSounds()
    stopEnemyTaunts()


    playerHideGun()


    if (gameOverScreen) {

        gameOverScreen.style.pointerEvents =
            'auto'

        gameOverScreen.style.opacity =
            '1'

        gameOverScreen.style.background =
            'rgba(0, 0, 0, .94)'
    }


    if (gameOverTitle) {

        gameOverTitle.textContent =
            "Maybe in another life, you'll be luckier."
    }


    if (newChallengerButton) {

        newChallengerButton.style.display =
            'none'
    }


    if (continueText) {

        continueText.style.display =
            'block'
    }


    if (winStats) {

        winStats.textContent =
            ''
    }


    if (gameOverContent) {

        setTimeout(
            () => {

                gameOverContent.style.opacity =
                    '1'

                gameOverContent.style.transform =
                    'translateY(0) scale(1)'

            },
            500
        )
    }
}


// =========================================================
// RESET VISUAL STATE
// =========================================================

function resetVisualState() {

    if (enemy) {

        enemy.classList.remove(
            'enemy-death'
        )

        enemy.style.opacity =
            '1'
    }


    if (enemyGunShotPlayer) {

        enemyGunShotPlayer.classList.remove(
            'enemy-death'
        )

        enemyGunShotPlayer.style.opacity =
            '1'
    }


    if (enemyGunShotHimself) {

        enemyGunShotHimself.classList.remove(
            'enemy-death'
        )

        enemyGunShotHimself.style.opacity =
            '1'
    }


    if (playerGun) {

        playerGun.style.opacity =
            '1'
    }


    if (playerGunShotHimself) {

        playerGunShotHimself.style.opacity =
            '1'
    }


    hideAllGuns()


    setCoinDown()
}


// =========================================================
// RESTART GAME
// =========================================================

function restartGame() {

    stopEnemyTaunts()
    stopGameSounds()


    if (gameOverContent) {

        gameOverContent.style.opacity =
            '0'

        gameOverContent.style.transform =
            'translateY(20px) scale(.95)'
    }


    if (gameOverScreen) {

        gameOverScreen.style.opacity =
            '0'

        gameOverScreen.style.background =
            'rgba(0, 0, 0, 0)'

        gameOverScreen.style.pointerEvents =
            'none'
    }


    resetVisualState()


    // =====================================================
    // RESET STATE
    // =====================================================

    gameOver = false

    actionLocked = false

    gunHolder = null

    playerCoinGuess = null

    coinAlreadyFlipped = false


    startGame()
}


// =========================================================
// NEW CHALLENGER BUTTON
// =========================================================

if (newChallengerButton) {

    newChallengerButton.addEventListener(
        'click',
        (event) => {

            event.preventDefault()
            event.stopPropagation()


            restartGame()
        }
    )
}


// =========================================================
// CONTINUE AFTER LOSS
// =========================================================

if (gameOverScreen) {

    gameOverScreen.addEventListener(
        'click',
        () => {

            if (!continueText)
                return


            if (
                continueText.style.display !==
                'none'
            ) {

                restartGame()
            }

        }
    )
}


// =========================================================
// ESCAPE HTML
// =========================================================

function escapeHTML(text) {

    const div =
        document.createElement(
            'div'
        )


    div.textContent =
        text ?? ''


    return div.innerHTML
}


// =========================================================
// UPDATE USERNAME UI
// =========================================================

function updateUsernameUI() {

    if (usernameInput) {

        usernameInput.value =
            playerUsername || ''
    }


    if (currentUsernameElement) {

        currentUsernameElement.textContent =
            playerUsername || 'Guest'
    }
}


// =========================================================
// SET PLAYER USERNAME
// =========================================================

function setPlayerUsername(username) {

    username =
        String(
            username ?? ''
        ).trim()


    if (!username)
        return false


    // =====================================================
    // BATASI 20 KARAKTER
    // =====================================================

    username =
        username.substring(
            0,
            20
        )


    playerUsername =
        username


    localStorage.setItem(
        'playerUsername',
        playerUsername
    )


    localStorage.setItem(
        'playerLoggedIn',
        'true'
    )


    // Kompatibilitas sistem lama

    localStorage.setItem(
        'playerHasLoggedIn',
        'true'
    )


    updateUsernameUI()


    return true
}


// =========================================================
// WELCOME SCREEN
// =========================================================

function showWelcomeScreen() {

    if (!welcomeScreen)
        return


    welcomeScreen.style.display =
        'flex'


    requestAnimationFrame(
        () => {

            welcomeScreen.style.opacity =
                '1'

            welcomeScreen.style.pointerEvents =
                'auto'
        }
    )


    if (game) {

        game.style.pointerEvents =
            'none'
    }


    // =====================================================
    // JIKA SUDAH ADA USERNAME
    // =====================================================

    if (playerUsername) {

        if (welcomeUsernameInput) {

            welcomeUsernameInput.value =
                playerUsername
        }

    } else {

        if (welcomeUsernameInput) {

            welcomeUsernameInput.value =
                ''


            setTimeout(
                () => {

                    welcomeUsernameInput.focus()

                },
                300
            )
        }
    }
}


// =========================================================
// HIDE WELCOME SCREEN
// =========================================================

function hideWelcomeScreen() {

    if (!welcomeScreen)
        return


    welcomeScreen.style.opacity =
        '0'

    welcomeScreen.style.pointerEvents =
        'none'


    if (game) {

        game.style.pointerEvents =
            'auto'
    }


    setTimeout(
        () => {

            if (!welcomeScreen)
                return


            welcomeScreen.style.display =
                'none'

        },
        500
    )
}


// =========================================================
// WELCOME ERROR
// =========================================================

function showWelcomeError(message) {

    const errorElement =
        welcomeError ||
        document.getElementById(
            'welcomeError'
        )


    if (!errorElement)
        return


    errorElement.textContent =
        message


    errorElement.classList.add(
        'show'
    )
}


// =========================================================
// HIDE WELCOME ERROR
// =========================================================

function hideWelcomeError() {

    const errorElement =
        welcomeError ||
        document.getElementById(
            'welcomeError'
        )


    if (!errorElement)
        return


    errorElement.textContent =
        ''


    errorElement.classList.remove(
        'show'
    )
}


// =========================================================
// VALIDATE USERNAME
// =========================================================

function validateUsername(username) {

    username =
        String(
            username || ''
        ).trim()


    if (!username) {

        return {
            valid: false,
            message:
                'Please enter your username.'
        }
    }


    if (username.length < 2) {

        return {
            valid: false,
            message:
                'Username must contain at least 2 characters.'
        }
    }


    if (username.length > 20) {

        return {
            valid: false,
            message:
                'Username must be 20 characters or less.'
        }
    }


    // =====================================================
    // HANYA BOLEH:
    //
    // a-z
    // A-Z
    // 0-9
    // underscore
    // spasi
    // =====================================================

    if (
        !/^[a-zA-Z0-9_ ]+$/.test(
            username
        )
    ) {

        return {
            valid: false,
            message:
                'Username can only contain letters, numbers, spaces, and _.'
        }
    }


    return {
        valid: true,
        username:
            username
    }
}


// =========================================================
// PLAY FROM WELCOME
// =========================================================

function playFromWelcome() {

    if (gameStarted)
        return


    hideWelcomeError()


    let username =
        playerUsername


    if (welcomeUsernameInput) {

        username =
            welcomeUsernameInput.value.trim()
    }


    const result =
        validateUsername(
            username
        )


    if (!result.valid) {

        showWelcomeError(
            result.message
        )


        if (welcomeUsernameInput) {

            welcomeUsernameInput.focus()


            welcomeUsernameInput.classList.add(
                'input-error'
            )


            setTimeout(
                () => {

                    welcomeUsernameInput.classList.remove(
                        'input-error'
                    )

                },
                500
            )
        }


        return
    }


    // =====================================================
    // SIMPAN USERNAME
    // =====================================================

    setPlayerUsername(
        result.username
    )


    hasLoggedIn =
        true


    localStorage.setItem(
        'playerLoggedIn',
        'true'
    )


    localStorage.setItem(
        'playerHasLoggedIn',
        'true'
    )


    // =====================================================
    // AUDIO
    //
    // Dipanggil dari click PLAY sehingga browser
    // menganggapnya sebagai user interaction.
    // =====================================================

    startGameSounds()


    hideWelcomeScreen()


    // =====================================================
    // START GAME
    // =====================================================

    startGame()
}


// =========================================================
// WELCOME PLAY BUTTON
// =========================================================

const playButton =
    document.getElementById(
        'welcomePlayButton'
    )


if (playButton) {



    playButton.addEventListener(
        'click',
        function (event) {

            event.preventDefault()
            event.stopPropagation()



            playFromWelcome()

        }
    )

} else {

    console.error(
        'ERROR: #welcomePlayButton tidak ditemukan!'
    )
}

// =========================================================
// ENTER TO PLAY
// =========================================================

if (welcomeUsernameInput) {

    welcomeUsernameInput.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key ===
                'Enter'
            ) {

                event.preventDefault()


                playFromWelcome()
            }
        }
    )
}


// =========================================================
// SAVE USERNAME BUTTON
// =========================================================

if (saveUsername) {

    saveUsername.addEventListener(
        'click',
        () => {

            if (!usernameInput)
                return


            const result =
                validateUsername(
                    usernameInput.value
                )


            if (!result.valid) {

                usernameInput.focus()

                return
            }


            setPlayerUsername(
                result.username
            )


            loadLeaderboard()
        }
    )
}


// =========================================================
// ENTER USERNAME
// =========================================================

if (usernameInput) {

    usernameInput.addEventListener(
        'keydown',
        (event) => {

            if (
                event.key ===
                'Enter'
            ) {

                event.preventDefault()


                if (saveUsername) {

                    saveUsername.click()
                }
            }
        }
    )
}


// =========================================================
// LOAD LEADERBOARD
// =========================================================

async function loadLeaderboard() {

    if (!leaderboardList)
        return


    if (!supabaseClient) {

        leaderboardList.innerHTML = `
            <div class="leaderboard-error">
                Supabase is not available.
            </div>
        `

        return
    }


    leaderboardList.innerHTML = `
        <div class="leaderboard-loading">
            Loading...
        </div>
    `


    const {
        data,
        error
    } =
        await supabaseClient
            .from('leaderboard')
            .select(
                'username, wins'
            )
            .order(
                'wins',
                {
                    ascending: false
                }
            )
            .limit(10)


    if (error) {

        console.error(
            'Load leaderboard error:',
            error
        )


        leaderboardList.innerHTML = `
            <div class="leaderboard-error">
                Failed to load leaderboard.
            </div>
        `

        return
    }


    renderLeaderboard(
        data
    )
}


// =========================================================
// RENDER LEADERBOARD
// =========================================================

function renderLeaderboard(data) {

    if (!leaderboardList)
        return


    leaderboardList.innerHTML =
        ''


    if (
        !data ||
        data.length === 0
    ) {

        leaderboardList.innerHTML = `
            <div class="leaderboard-empty">
                No players yet.
            </div>
        `

        return
    }


    data.forEach(
        (player, index) => {

            const row =
                document.createElement(
                    'div'
                )


            row.classList.add(
                'leaderboard-row'
            )


            if (index === 0) {

                row.classList.add(
                    'rank-first'
                )
            }


            if (index === 1) {

                row.classList.add(
                    'rank-second'
                )
            }


            if (index === 2) {

                row.classList.add(
                    'rank-third'
                )
            }


            const username =
                escapeHTML(
                    player.username
                )


            const wins =
                Number(
                    player.wins
                ) || 0


            row.innerHTML = `
                <span class="leaderboard-rank">
                    #${index + 1}
                </span>

                <span class="leaderboard-username">
                    ${username}
                </span>

                <span class="leaderboard-wins">
                    ${wins}
                </span>
            `


            leaderboardList.appendChild(
                row
            )
        }
    )
}


// =========================================================
// ADD PLAYER WIN
// SERVER VERSION
// =========================================================

async function addPlayerWin() {

    if (!gameSessionId)
        return false


    try {

        const {
            data,
            error
        } =
            await supabaseClient.functions.invoke(
                'add-player-win',
                {
                    body: {
                        session_id:
                            gameSessionId
                    }
                }
            )


        if (error) {

            console.error(
                'Win error:',
                error
            )

            return false
        }


        if (!data?.success) {

            console.error(
                'Win rejected:',
                data?.error
            )

            return false
        }


        return true

    } catch (error) {

        console.error(
            error
        )

        return false
    }
}
// =========================================================
// TEST SUPABASE
// =========================================================

async function testSupabase() {

    if (!supabaseClient) {

        console.error(
            'Supabase client is not available.'
        )

        return
    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from('leaderboard')
            .select(
                'username, wins'
            )
            .limit(10)


    if (error) {

        console.error(
            'Supabase error:',
            error
        )

        return
    }


}


// =========================================================
// PARALLAX RECT
// =========================================================

let rect =
    table
        ? table.getBoundingClientRect()
        : null


window.addEventListener(
    'resize',
    () => {

        if (!table)
            return


        rect =
            table.getBoundingClientRect()
    }
)


// =========================================================
// PARALLAX OPTIMIZED FOR DESKTOP + MOBILE
// =========================================================

let parallaxX = 0
let parallaxY = 0

let parallaxRunning = false

const isMobile =
    window.matchMedia(
        '(max-width: 768px)'
    ).matches


function updateParallax() {

    if (!rect)
        return


    const centerX =
        isMobile
            ? window.innerWidth / 2
            : rect.left + rect.width / 2


    const centerY =
        isMobile
            ? window.innerHeight / 2
            : rect.top + rect.height / 2


    const posX =
        (parallaxX - centerX) / centerX


    const posY =
        (parallaxY - centerY) / centerY


    // =====================================================
    // BACKGROUND
    // =====================================================

    if (background) {

        background.style.backgroundPosition =
            `calc(50% + ${-posX * 20}px)
             calc(50% + ${-posY * 10}px)`
    }


    // =====================================================
    // TABLE
    // =====================================================

    if (table) {

        table.style.backgroundPosition =
            `calc(50% + ${posX * 5}px)
             calc(50% + ${posY * 2.5}px)`
    }


    // =====================================================
    // DESKTOP ONLY
    // =====================================================

    if (!isMobile) {

        // PLAYER GUN

        if (playerGun) {

            playerGun.style.backgroundPosition =
                `calc(50% + ${posX * 10}px)
                 calc(50% + ${posY * 10}px)`
        }


        // PLAYER GUN SELF

        if (playerGunShotHimself) {

            playerGunShotHimself.style.backgroundPosition =
                `calc(50% + ${posX * 10}px)
                 calc(50% + ${posY * 10}px)`
        }


        // COIN DOWN

        if (coinDown) {

            coinDown.style.backgroundPosition =
                `calc(50% + ${posX * 5}px)
                 calc(50% + ${posY * 2.5}px)`
        }


        // COIN HEAD

        if (coinHead) {

            coinHead.style.backgroundPosition =
                `calc(50% + ${posX * 6}px)
                 calc(50% + ${posY * 3}px)`
        }


        // COIN TAILS

        if (coinTails) {

            coinTails.style.backgroundPosition =
                `calc(50% + ${posX * 6}px)
                 calc(50% + ${posY * 3}px)`
        }


        // ENEMY

        if (enemy) {

            enemy.style.backgroundPosition =
                `calc(50% + ${-posX * 5}px)
                 calc(50% + ${-posY * 2}px)`
        }


        // ENEMY GUN

        if (enemyGunShotPlayer) {

            enemyGunShotPlayer.style.backgroundPosition =
                `calc(50% + ${-posX * 1.5}px)
                 calc(50% + ${-posY * 1.5}px)`
        }


        if (enemyGunShotHimself) {

            enemyGunShotHimself.style.backgroundPosition =
                `calc(50% + ${-posX * 1.5}px)
                 calc(50% + ${-posY * 1.5}px)`
        }

    }
}


// =========================================================
// DESKTOP
// =========================================================

window.addEventListener(
    'mousemove',
    (e) => {

        if (isMobile)
            return


        parallaxX =
            e.clientX

        parallaxY =
            e.clientY


        if (parallaxRunning)
            return


        parallaxRunning =
            true


        requestAnimationFrame(
            () => {

                parallaxRunning =
                    false

                updateParallax()

            }
        )

    }
)


// =========================================================
// MOBILE
// =========================================================

window.addEventListener(
    'touchmove',
    (e) => {

        if (!isMobile)
            return


        if (
            !e.touches ||
            !e.touches[0]
        )
            return


        parallaxX =
            e.touches[0].clientX

        parallaxY =
            e.touches[0].clientY


        if (parallaxRunning)
            return


        parallaxRunning =
            true


        requestAnimationFrame(
            () => {

                parallaxRunning =
                    false

                updateParallax()

            }
        )

    },
    {
        passive: true
    }
)

// =========================================================
// START GAME
// =========================================================

function startGame() {

    stopEnemyTaunts()
    
    gameStarted =
        true


    gameOver =
        false


    gunHolder =
        null


    playerCoinGuess =
        null


    coinAlreadyFlipped =
        false


    actionLocked =
        false


    currentRound =
        1


    currentChamber =
        0


    playerShuffleCount =
        0


    enemyShuffleCount =
        0


    // =====================================================
    // RESET VISUAL
    // =====================================================

    resetVisualState()


    // =====================================================
    // CREATE ROUND
    // =====================================================

    createNewRound()


    setCoinDown()


    hidePlayerActions()


    showCoinUI()


    if (turnInfo) {

        turnInfo.textContent =
            'COIN FLIP'

        turnInfo.style.color =
            '#e7c87a'
    }


    if (actionInfo) {

        actionInfo.textContent =
            'Choose HEADS or TAILS'
    }


    setEnemyAction(
        'Waiting for the coin...'
    )


    updateChamberUI()


    updatePlayerButtons()

    // =====================================================
// START ENEMY TAUNT
// =====================================================

setTimeout(() => {

    if (!gameOver) {

        startEnemyTaunts()

    }

}, 2000)
}


// =========================================================
// GLOBAL FUNCTIONS
// =========================================================

window.playerShootEnemy =
    playerShootEnemy


window.playerShootSelf =
    playerShootSelf


window.playerShuffle =
    playerShuffle


window.chooseHeads =
    chooseHeads


window.chooseTails =
    chooseTails


window.playFromWelcome =
    playFromWelcome


window.restartGame =
    restartGame


// =========================================================
// INITIALIZE USERNAME
// =========================================================

updateUsernameUI()


// =========================================================
// INITIALIZE WELCOME
// =========================================================

if (playerUsername) {

    console.log(
        'Saved player:',
        playerUsername
    )

} else {

    console.log(
        'No saved player.'
    )
}


// =========================================================
// SHOW WELCOME
// =========================================================

if (welcomeScreen) {

    showWelcomeScreen()

} else {

    console.warn(
        'welcomeScreen element not found.'
    )


    // Fallback
    startGame()
}


// =========================================================
// LOAD LEADERBOARD
// =========================================================

loadLeaderboard()


// =========================================================
// TEST SUPABASE
// =========================================================

testSupabase()