// =========================================================
// RUSSIAN ROULETTE
// PRIVATE / PROTECTED CLIENT VERSION
// GITHUB PAGES COMPATIBLE
// PART 1 / 2
// =========================================================

(() => {

    'use strict'


    // =====================================================
    // CONFIG
    // =====================================================

    const SUPABASE_URL =
        'https://kasewgqrkfjiqqjqdvjm.supabase.co'

    const SUPABASE_KEY =
        'sb_publishable_YXo3nrxsvx_uwof30ogQVg_x-ufLtwY'


    // =====================================================
    // ASSET HELPER
    // =====================================================
    //
    // IMPORTANT:
    // Jangan menggunakan:
    //
    // new Audio('./sounds/file.mp3')
    //
    // secara manual untuk setiap audio.
    //
    // document.baseURI membuat path bekerja di:
    //
    // localhost
    // GitHub Pages
    //
    // =====================================================

    function asset(path) {

        return new URL(
            path,
            document.baseURI
        ).href

    }


    // =====================================================
    // SUPABASE
    // =====================================================

    let supabaseClient = null


    if (
        window.supabase &&
        typeof window.supabase.createClient === 'function'
    ) {

        try {

            supabaseClient =
                window.supabase.createClient(
                    SUPABASE_URL,
                    SUPABASE_KEY
                )

            console.log(
                'Supabase client initialized.'
            )

        } catch (error) {

            console.error(
                'Supabase initialization error:',
                error
            )

        }

    } else {

        console.error(
            'Supabase library was not loaded.'
        )

    }


    // =====================================================
    // GAME SESSION
    // =====================================================

    let gameSessionId = null


    // =====================================================
    // DOM HELPER
    // =====================================================

    function $(id) {

        return document.getElementById(id)

    }


    // =====================================================
    // GAME DOM
    // =====================================================

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


    // =====================================================
    // PLAYER ACTION UI
    // =====================================================

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


    // =====================================================
    // TURN UI
    // =====================================================

    const turnInfo =
        $('turnInfo')

    const actionInfo =
        $('actionInfo')

    const enemyAction =
        $('enemyAction')


    // =====================================================
    // CHAMBER UI
    // =====================================================

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


    // =====================================================
    // GUNS
    // =====================================================

    const playerGun =
        $('gun')

    const playerGunShotHimself =
        $('gunshotme')

    const enemyGunShotPlayer =
        $('enemygun')

    const enemyGunShotHimself =
        $('enemygunshot')


    // =====================================================
    // COINS
    // =====================================================

    const coinDown =
        $('coindown')

    const coinHead =
        $('coinhead')

    const coinTails =
        $('cointails')


    // =====================================================
    // GAME OVER
    // =====================================================

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


    // =====================================================
    // USERNAME
    // =====================================================

    const usernameInput =
        $('usernameInput')

    const saveUsername =
        $('saveUsername')

    const currentUsernameElement =
        $('currentUsername')


    // =====================================================
    // WELCOME
    // =====================================================

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


    // =====================================================
    // LEADERBOARD
    // =====================================================

    const leaderboardList =
        $('leaderboardList')


    // =====================================================
    // USERNAME STATE
    // =====================================================

    let playerUsername =
        localStorage.getItem(
            'playerUsername'
        ) || ''


    // =====================================================
    // CONSTANTS
    // =====================================================

    const MAX_CHAMBERS = 6

    const MAX_SHUFFLE_PER_ROUND = 2

    const SHOOT_DELAY = 5000

    const ENEMY_THINK_DELAY = 1500


    // =====================================================
    // GAME STATE
    // =====================================================

    let gameStarted = false

    let gameOver = false

    let gunHolder = null

    let playerCoinGuess = null

    let coinAlreadyFlipped = false

    let actionLocked = false


    // =====================================================
    // CHAMBER STATE
    // =====================================================

    let chambers = []

    let currentChamber = 0

    let currentRound = 1

    let roundBulletCount = 0

    let roundBlankCount = 0


    // =====================================================
    // SHUFFLE STATE
    // =====================================================

    let playerShuffleCount = 0

    let enemyShuffleCount = 0


    // =====================================================
    // ENEMY TAUNTS
    // =====================================================

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


    let enemyTauntTimer = null

    let enemyTalkHideTimer = null

    let enemyIsTalking = false


    // =====================================================
    // AUDIO
    // =====================================================

    const sounds = {

        coinFlip:
            new Audio(
                asset('sounds/coinflip.mp3')
            ),

        coinResult:
            new Audio(
                asset('sounds/resultcoinflip.mp3')
            ),

        showGun:
            new Audio(
                asset('sounds/showgun.mp3')
            ),

        clock:
            new Audio(
                asset('sounds/clock.mp3')
            ),

        detak:
            new Audio(
                asset('sounds/detak.mp3')
            ),

        blank:
            new Audio(
                asset('sounds/blank.mp3')
            ),

        shot:
            new Audio(
                asset('sounds/shot.mp3')
            ),

        shuffle:
            new Audio(
                asset('sounds/shuffle.mp3')
            ),

        enemyLaugh1:
            new Audio(
                asset('sounds/enemylaugh.mp3')
            ),

        enemyLaugh2:
            new Audio(
                asset('sounds/enemylaugh2.mp3')
            ),

        enemyLaugh3:
            new Audio(
                asset('sounds/enemylaugh3.mp3')
            ),

        backsound:
            new Audio(
                asset('sounds/backsound.mp3')
            )

    }


    sounds.clock.loop = true
    sounds.detak.loop = true
    sounds.backsound.loop = true

    sounds.clock.volume = 1
    sounds.detak.volume = 0.5
    sounds.backsound.volume = 1

    sounds.shuffle.volume = 0.8

    sounds.enemyLaugh1.volume = 0.8
    sounds.enemyLaugh2.volume = 0.8
    sounds.enemyLaugh3.volume = 0.8


    let gameSoundsStarted = false


    // =====================================================
    // PLAY SOUND
    // =====================================================

    function playSound(sound) {

        if (!sound) {
            return
        }


        try {

            sound.currentTime = 0

            const promise =
                sound.play()


            if (
                promise &&
                typeof promise.catch === 'function'
            ) {

                promise.catch(() => {})

            }

        } catch (error) {

            console.warn(
                'Audio error:',
                error
            )

        }

    }


    // =====================================================
    // START GAME SOUNDS
    // =====================================================

    function startGameSounds() {

        if (gameSoundsStarted) {
            return
        }


        gameSoundsStarted = true


        const audioList = [

            sounds.clock,
            sounds.detak,
            sounds.backsound

        ]


        audioList.forEach(sound => {

            if (!sound) {
                return
            }


            try {

                sound.currentTime = 0

                const promise =
                    sound.play()


                if (
                    promise &&
                    typeof promise.catch === 'function'
                ) {

                    promise.catch(() => {})

                }

            } catch (error) {

                console.warn(
                    'Background audio error:',
                    error
                )

            }

        })

    }


    // =====================================================
    // STOP GAME SOUNDS
    // =====================================================

    function stopGameSounds() {

        gameSoundsStarted = false


        const audioList = [

            sounds.clock,
            sounds.detak,
            sounds.backsound

        ]


        audioList.forEach(sound => {

            if (!sound) {
                return
            }


            try {

                sound.pause()

                sound.currentTime = 0

            } catch (error) {}

        })

    }


    // =====================================================
    // RANDOM ENEMY LAUGH
    // =====================================================

    function playRandomEnemyLaugh() {

        const laughs = [

            sounds.enemyLaugh1,
            sounds.enemyLaugh2,
            sounds.enemyLaugh3

        ]


        const randomIndex =
            Math.floor(
                Math.random() *
                laughs.length
            )


        playSound(
            laughs[randomIndex]
        )

    }


    // =====================================================
    // SHUFFLE ARRAY
    // =====================================================

    function shuffleArray(array) {

        for (
            let i = array.length - 1;
            i > 0;
            i--
        ) {

            const j =
                Math.floor(
                    Math.random() *
                    (i + 1)
                )


            const temp =
                array[i]

            array[i] =
                array[j]

            array[j] =
                temp

        }


        return array

    }


    // =====================================================
    // CREATE NEW ROUND
    // =====================================================

    function createNewRound() {

        chambers = []

        currentChamber = 0

        playerShuffleCount = 0

        enemyShuffleCount = 0


        roundBulletCount =
            Math.floor(
                Math.random() * 5
            ) + 1


        roundBlankCount =
            MAX_CHAMBERS -
            roundBulletCount


        for (
            let i = 0;
            i < roundBulletCount;
            i++
        ) {

            chambers.push(
                'bullet'
            )

        }


        for (
            let i = 0;
            i < roundBlankCount;
            i++
        ) {

            chambers.push(
                'blank'
            )

        }


        shuffleArray(
            chambers
        )


        updateChamberUI()

    }


    // =====================================================
    // SHUFFLE REMAINING CHAMBERS
    // =====================================================

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


    // =====================================================
    // PLAYER SHUFFLE
    // =====================================================

    function playerShuffle() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (gunHolder !== 'player') return


        if (
            playerShuffleCount >=
            MAX_SHUFFLE_PER_ROUND
        ) {

            return

        }


        playerShuffleCount++


        shuffleChambers()


        playSound(
            sounds.shuffle
        )


        updateChamberUI()

        updatePlayerButtons()


        if (actionInfo) {

            actionInfo.textContent =
                'You shuffled the remaining chambers.'

        }


        setEnemyAction(
            'The player is rearranging the chambers...'
        )

    }


    // =====================================================
    // ENEMY SHUFFLE
    // =====================================================

    function enemyShuffle() {

        if (gameOver) {
            return
        }


        enemyShuffleCount++

        shuffleChambers()

        playSound(
            sounds.shuffle
        )

        updateChamberUI()

    }


    // =====================================================
    // RANDOM CHAMBER RESULT
    // =====================================================

    function randomResult() {

        if (
            currentChamber >=
            chambers.length
        ) {

            currentRound++

            createNewRound()

        }


        const result =
            chambers[currentChamber]


        currentChamber++


        updateChamberUI()


        return result

    }


    // =====================================================
    // UPDATE CHAMBER UI
    // =====================================================

    function updateChamberUI() {

        const remaining =
            Math.max(
                0,
                chambers.length -
                currentChamber
            )


        if (chambersLeft) {

            chambersLeft.textContent =
                remaining

        }


        if (bulletsLeft) {

            const remainingBullets =
                chambers
                    .slice(currentChamber)
                    .filter(
                        value =>
                            value === 'bullet'
                    )
                    .length


            bulletsLeft.textContent =
                remainingBullets

        }


        if (blanksLeft) {

            const remainingBlanks =
                chambers
                    .slice(currentChamber)
                    .filter(
                        value =>
                            value === 'blank'
                    )
                    .length


            blanksLeft.textContent =
                remainingBlanks

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


    // =====================================================
    // FORCE REFLOW
    // =====================================================

    function forceReflow(element) {

        if (!element) {
            return
        }


        void element.offsetWidth

    }


    // =====================================================
    // PLAYER ACTION UI
    // =====================================================

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


    // =====================================================
    // COIN UI
    // =====================================================

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


    // =====================================================
    // UPDATE PLAYER BUTTONS
    // =====================================================

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


        if (headsButton) {

            headsButton.disabled =
                !gameStarted ||
                gameOver ||
                actionLocked ||
                coinAlreadyFlipped

        }


        if (tailsButton) {

            tailsButton.disabled =
                !gameStarted ||
                gameOver ||
                actionLocked ||
                coinAlreadyFlipped

        }


        if (shuffleCount) {

            shuffleCount.textContent =
                playerShuffleCount

        }

    }


    // =====================================================
    // UPDATE TURN UI
    // =====================================================

    function updateTurnUI() {

        if (
            !turnInfo ||
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


        if (gunHolder === 'player') {

            turnInfo.textContent =
                'YOUR TURN'

            turnInfo.style.color =
                '#e7c87a'

            actionInfo.textContent =
                'Choose your target...'

            return

        }


        if (gunHolder === 'enemy') {

            turnInfo.textContent =
                'ENEMY TURN'

            turnInfo.style.color =
                '#e7c87a'

            actionInfo.textContent =
                'The enemy is deciding...'

            return

        }


        turnInfo.textContent =
            'COIN FLIP'

        turnInfo.style.color =
            '#e7c87a'

        actionInfo.textContent =
            'Choose HEADS or TAILS'

    }


    // =====================================================
    // ENEMY ACTION
    // =====================================================

    function setEnemyAction(message) {

        if (!enemyAction) {
            return
        }


        enemyAction.textContent =
            message

    }


    // =====================================================
    // SET TURN
    // =====================================================

    function setTurn(holder) {

        if (gameOver) {
            return
        }


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


        if (holder === 'player') {

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


    // =====================================================
    // GUN HELPERS
    // =====================================================

    function hideGun(element) {

        if (!element) {
            return
        }


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

        if (!element) {
            return
        }


        hideGun(element)

        forceReflow(element)


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


    function hideAllGuns() {

        hideGun(playerGun)

        hideGun(playerGunShotHimself)

        hideGun(enemyGunShotPlayer)

        hideGun(enemyGunShotHimself)

    }


    function playerHideGun() {

        hideGun(playerGun)

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


    // =====================================================
    // PLAYER GUN VISUAL
    // =====================================================

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


    // =====================================================
    // ENEMY GUN VISUAL
    // =====================================================

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


    // =====================================================
    // COIN RESET
    // =====================================================

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


    // =====================================================
    // CHOOSE HEADS
    // =====================================================

    function chooseHeads() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (coinAlreadyFlipped) return


        playerCoinGuess =
            'heads'


        startGameSounds()

        flipCoinOnce()

    }


    // =====================================================
    // CHOOSE TAILS
    // =====================================================

    function chooseTails() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (coinAlreadyFlipped) return


        playerCoinGuess =
            'tails'


        startGameSounds()

        flipCoinOnce()

    }


    // =====================================================
    // COIN FLIP
    // =====================================================

    function flipCoinOnce() {

        if (coinAlreadyFlipped) {
            return
        }


        coinAlreadyFlipped =
            true

        actionLocked =
            true


        hidePlayerActions()


        if (headsButton) {

            headsButton.disabled =
                true

        }


        if (tailsButton) {

            tailsButton.disabled =
                true

        }


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


        setTimeout(() => {

            if (gameOver) {
                return
            }


            if (coinDown) {

                coinDown.style.opacity =
                    '0'

            }


            setTimeout(() => {

                if (gameOver) {
                    return
                }


                if (result === 'heads') {

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


                setTimeout(() => {

                    if (coinHead) {

                        coinHead.style.opacity =
                            '0'

                    }


                    if (coinTails) {

                        coinTails.style.opacity =
                            '0'

                    }


                    setTimeout(() => {

                        if (gameOver) {
                            return
                        }


                        startEnemyTaunts()


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


                            setTimeout(() => {

                                if (!gameOver) {

                                    enemyTurn()

                                }

                            }, 1000)

                        }

                    }, 500)

                }, 2000)

            }, 600)

        }, 1800)

    }


    // =====================================================
    // ENEMY TALK
    // =====================================================

    function enemyTalk() {

        if (gameOver) {
            return
        }


        if (enemyIsTalking) {
            return
        }


        enemyIsTalking =
            true


        const randomIndex =
            Math.floor(
                Math.random() *
                enemyTaunts.length
            )


        const message =
            enemyTaunts[randomIndex]


        playRandomEnemyLaugh()


        if (enemyText) {

            enemyText.textContent =
                message

            enemyText.style.opacity =
                '0'

            enemyText.style.transform =
                'translateY(10px) scale(.98)'


            forceReflow(
                enemyText
            )


            enemyText.style.opacity =
                '1'

            enemyText.style.transform =
                'translateY(0) scale(1)'

        }


        if (
            enemyTalkHideTimer !==
            null
        ) {

            clearTimeout(
                enemyTalkHideTimer
            )

        }


        enemyTalkHideTimer =
            setTimeout(() => {

                if (enemyText) {

                    enemyText.style.opacity =
                        '0'

                    enemyText.style.transform =
                        'translateY(10px) scale(.98)'

                }


                enemyIsTalking =
                    false

                enemyTalkHideTimer =
                    null

            }, 3000)

    }


    // =====================================================
    // START ENEMY TAUNTS
    // =====================================================

    function startEnemyTaunts() {

        stopEnemyTaunts()


        if (gameOver) {
            return
        }


        scheduleEnemyTaunt()

    }


    // =====================================================
    // SCHEDULE ENEMY TAUNT
    // =====================================================

    function scheduleEnemyTaunt() {

        if (gameOver) {
            return
        }


        const delay =
            Math.floor(
                Math.random() * 5000
            ) + 5000


        enemyTauntTimer =
            setTimeout(() => {

                if (gameOver) {
                    return
                }


                enemyTalk()

                scheduleEnemyTaunt()

            }, delay)

    }


    // =====================================================
    // STOP ENEMY TAUNTS
    // =====================================================

    function stopEnemyTaunts() {

        if (
            enemyTauntTimer !==
            null
        ) {

            clearTimeout(
                enemyTauntTimer
            )

            enemyTauntTimer =
                null

        }


        if (
            enemyTalkHideTimer !==
            null
        ) {

            clearTimeout(
                enemyTalkHideTimer
            )

            enemyTalkHideTimer =
                null

        }


        enemyIsTalking =
            false


        if (enemyText) {

            enemyText.style.opacity =
                '0'

            enemyText.style.transform =
                'translateY(10px) scale(.98)'

        }

    }


    // =====================================================
    // GUNSHOT EFFECT
    // =====================================================

    function gunshotEffect() {

        if (!game) {
            return
        }


        game.classList.remove(
            'gunshot-shake'
        )


        forceReflow(game)


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


        setTimeout(() => {

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

        }, 500)

    }


    // =====================================================
    // PLAYER SHOOT SELF
    // =====================================================

    function playerShootSelf() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (gunHolder !== 'player') return


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


        setTimeout(() => {

            if (gameOver) {
                return
            }


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'PLAYER HIT'
                )


                setTimeout(() => {

                    playerLostGame()

                }, 700)


                return

            }


            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(() => {

                if (gameOver) {
                    return
                }


                setTurn(
                    'player'
                )


                if (actionInfo) {

                    actionInfo.textContent =
                        'The chamber was empty. You get another turn.'

                }

            }, 500)

        }, SHOOT_DELAY)

    }


    // =====================================================
    // PLAYER SHOOT ENEMY
    // =====================================================

    function playerShootEnemy() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (gunHolder !== 'player') return


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


        setTimeout(() => {

            if (gameOver) {
                return
            }


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'ENEMY HIT'
                )


                setTimeout(() => {

                    playerWonGame()

                }, 700)


                return

            }


            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(() => {

                if (gameOver) {
                    return
                }


                setTurn(
                    'enemy'
                )


                setTimeout(() => {

                    if (!gameOver) {

                        enemyTurn()

                    }

                }, 1000)

            }, 500)

        }, SHOOT_DELAY)

    }


    // =====================================================
    // ENEMY TURN
    // =====================================================

    function enemyTurn() {

        if (!gameStarted) return
        if (gameOver) return
        if (gunHolder !== 'enemy') return
        if (actionLocked) return


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


        actionLocked =
            true


        setTimeout(() => {

            if (gameOver) {
                return
            }


            const remaining =
                chambers.length -
                currentChamber


            const canShuffle =
                enemyShuffleCount <
                MAX_SHUFFLE_PER_ROUND &&
                remaining > 1


            if (
                canShuffle &&
                Math.random() < 0.3
            ) {

                setEnemyAction(
                    'Enemy is shuffling the chamber...'
                )


                if (actionInfo) {

                    actionInfo.textContent =
                        'The enemy is rearranging the chambers...'

                }


                enemyShuffle()


                setTimeout(() => {

                    if (gameOver) {
                        return
                    }


                    actionLocked =
                        false


                    enemyTurn()

                }, 1000)


                return

            }


            actionLocked =
                false


            if (
                Math.random() < 0.5
            ) {

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

        }, ENEMY_THINK_DELAY)

    }


    // =====================================================
    // ENEMY SHOOT PLAYER
    // =====================================================

    function enemyShootPlayer() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (gunHolder !== 'enemy') return


        actionLocked =
            true


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


        setTimeout(() => {

            if (gameOver) {
                return
            }


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'BANG!'
                )


                setTimeout(() => {

                    playerLostGame()

                }, 700)


                return

            }


            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(() => {

                if (gameOver) {
                    return
                }


                setTurn(
                    'player'
                )

            }, 500)

        }, SHOOT_DELAY)

    }


    // =====================================================
    // ENEMY SHOOT SELF
    // =====================================================

    function enemyShootSelf() {

        if (!gameStarted) return
        if (gameOver) return
        if (actionLocked) return
        if (gunHolder !== 'enemy') return


        actionLocked =
            true


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


        setTimeout(() => {

            if (gameOver) {
                return
            }


            if (result === 'bullet') {

                playSound(
                    sounds.shot
                )


                gunshotEffect()


                setEnemyAction(
                    'BANG!'
                )


                setTimeout(() => {

                    playerWonGame()

                }, 700)


                return

            }


            playSound(
                sounds.blank
            )


            setEnemyAction(
                'CLICK... BLANK'
            )


            setTimeout(() => {

                if (gameOver) {
                    return
                }


                setTurn(
                    'enemy'
                )


                if (actionInfo) {

                    actionInfo.textContent =
                        'The chamber was empty. Enemy gets another turn.'

                }


                setTimeout(() => {

                    if (!gameOver) {

                        enemyTurn()

                    }

                }, 1000)

            }, 500)

        }, SHOOT_DELAY)

    }
// =========================================================
// RUSSIAN ROULETTE
// PRIVATE / PROTECTED CLIENT VERSION
// PART 2 / 2
// =========================================================


// =========================================================
// PARALLAX
// =========================================================

let rect =
    table
        ? table.getBoundingClientRect()
        : null


let parallaxX = 0

let parallaxY = 0

let parallaxRunning = false


function updateParallax() {

    if (!rect) {
        return
    }


    const isMobile =
        window.innerWidth <= 768


    const centerX =
        isMobile
            ? window.innerWidth / 2
            : rect.left +
              rect.width / 2


    const centerY =
        isMobile
            ? window.innerHeight / 2
            : rect.top +
              rect.height / 2


    const safeCenterX =
        centerX || 1


    const safeCenterY =
        centerY || 1


    const posX =
        (
            parallaxX -
            safeCenterX
        ) /
        safeCenterX


    const posY =
        (
            parallaxY -
            safeCenterY
        ) /
        safeCenterY


    // =====================================================
    // BACKGROUND
    // =====================================================

    if (background) {

        background.style.backgroundPosition =
            `calc(50% + ${-posX * 20}px) calc(50% + ${-posY * 10}px)`

    }


    // =====================================================
    // TABLE
    // =====================================================

    if (table) {

        table.style.backgroundPosition =
            `calc(50% + ${posX * 5}px) calc(50% + ${posY * 2.5}px)`

    }


    // =====================================================
    // PLAYER GUN
    // =====================================================

    if (playerGun) {

        playerGun.style.backgroundPosition =
            `calc(50% + ${posX * 10}px) calc(50% + ${posY * 10}px)`

    }


    if (playerGunShotHimself) {

        playerGunShotHimself.style.backgroundPosition =
            `calc(50% + ${posX * 10}px) calc(50% + ${posY * 10}px)`

    }


    // =====================================================
    // COIN
    // =====================================================

    if (coinDown) {

        coinDown.style.backgroundPosition =
            `calc(50% + ${posX * 5}px) calc(50% + ${posY * 2.5}px)`

    }


    if (coinHead) {

        coinHead.style.backgroundPosition =
            `calc(50% + ${posX * 6}px) calc(50% + ${posY * 3}px)`

    }


    if (coinTails) {

        coinTails.style.backgroundPosition =
            `calc(50% + ${posX * 6}px) calc(50% + ${posY * 3}px)`

    }


    // =====================================================
    // ENEMY
    // =====================================================

    if (enemy) {

        enemy.style.backgroundPosition =
            `calc(50% + ${-posX * 5}px) calc(50% + ${-posY * 2}px)`

    }


    if (enemyGunShotPlayer) {

        enemyGunShotPlayer.style.backgroundPosition =
            `calc(50% + ${-posX * 1.5}px) calc(50% + ${-posY * 1.5}px)`

    }


    if (enemyGunShotHimself) {

        enemyGunShotHimself.style.backgroundPosition =
            `calc(50% + ${-posX * 1.5}px) calc(50% + ${-posY * 1.5}px)`

    }

}


// =========================================================
// RESIZE
// =========================================================

window.addEventListener(
    'resize',
    () => {

        if (!table) {
            return
        }


        rect =
            table.getBoundingClientRect()


        updateParallax()

    }
)


// =========================================================
// MOUSE MOVE
// =========================================================

window.addEventListener(
    'mousemove',
    event => {

        parallaxX =
            event.clientX

        parallaxY =
            event.clientY


        if (parallaxRunning) {
            return
        }


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
// TOUCH MOVE
// =========================================================

window.addEventListener(
    'touchmove',
    event => {

        if (
            !event.touches ||
            !event.touches[0]
        ) {
            return
        }


        parallaxX =
            event.touches[0].clientX

        parallaxY =
            event.touches[0].clientY


        if (parallaxRunning) {
            return
        }


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
// TOUCH START
// =========================================================

window.addEventListener(
    'touchstart',
    event => {

        if (
            !event.touches ||
            !event.touches[0]
        ) {
            return
        }


        parallaxX =
            event.touches[0].clientX

        parallaxY =
            event.touches[0].clientY


        updateParallax()

    },
    {
        passive: true
    }
)


// =========================================================
// INTERNAL EVENT LISTENERS
// =========================================================
//
// PENTING:
//
// HTML TIDAK BOLEH LAGI MENGGUNAKAN:
//
// onclick="playerShootEnemy()"
// onclick="playerShootSelf()"
// onclick="playerShuffle()"
// onclick="chooseHeads()"
// onclick="chooseTails()"
//
// Semua event dipasang dari JavaScript.
//
// Function tetap berada di dalam IIFE.
// Jadi function tidak menjadi:
//
// window.playerShootEnemy
// window.playerShootSelf
// window.playerShuffle
// window.chooseHeads
// window.chooseTails
//
// =========================================================


// =========================================================
// SHOOT ENEMY
// =========================================================

if (shotEnemyButton) {

    shotEnemyButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            playerShootEnemy()

        }
    )

}


// =========================================================
// SHOOT SELF
// =========================================================

if (shotMeButton) {

    shotMeButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            playerShootSelf()

        }
    )

}


// =========================================================
// SHUFFLE
// =========================================================

if (shuffleButton) {

    shuffleButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            playerShuffle()

        }
    )

}


// =========================================================
// HEADS
// =========================================================

if (headsButton) {

    headsButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            chooseHeads()

        }
    )

}


// =========================================================
// TAILS
// =========================================================

if (tailsButton) {

    tailsButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            chooseTails()

        }
    )

}


// =========================================================
// NEW CHALLENGER
// =========================================================

if (newChallengerButton) {

    newChallengerButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            restartGame()

        }
    )

}


// =========================================================
// CHANGE USERNAME
// =========================================================

if (changeUsernameButton) {

    changeUsernameButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()

            changePlayerUsername()

        }
    )

}


// =========================================================
// GAME OVER SCREEN
// =========================================================
//
// Saat player kalah, klik continue akan
// memulai game baru.
//
// =========================================================

if (gameOverScreen) {

    gameOverScreen.addEventListener(
        'click',
        event => {

            if (!continueText) {
                return
            }


            // Jangan restart kalau tombol
            // New Challenger yang diklik.

            if (
                newChallengerButton &&
                newChallengerButton.contains(
                    event.target
                )
            ) {

                return

            }


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
// SAVE USERNAME
// =========================================================

if (saveUsername) {

    saveUsername.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()


            if (!usernameInput) {
                return
            }


            const result =
                validateUsername(
                    usernameInput.value
                )


            if (!result.valid) {

                showWelcomeError(
                    result.message
                )


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
// USERNAME ENTER
// =========================================================

if (usernameInput) {

    usernameInput.addEventListener(
        'keydown',
        event => {

            if (event.key !== 'Enter') {
                return
            }


            event.preventDefault()


            if (saveUsername) {

                saveUsername.click()

            }

        }
    )

}


// =========================================================
// WELCOME PLAY BUTTON
// =========================================================

if (welcomePlayButton) {

    welcomePlayButton.addEventListener(
        'click',
        event => {

            event.preventDefault()

            event.stopPropagation()


            playFromWelcome()

        }
    )

} else {

    console.error(
        'ERROR: #welcomePlayButton tidak ditemukan.'
    )

}


// =========================================================
// WELCOME USERNAME ENTER
// =========================================================

if (welcomeUsernameInput) {

    welcomeUsernameInput.addEventListener(
        'keydown',
        event => {

            if (event.key !== 'Enter') {
                return
            }


            event.preventDefault()


            playFromWelcome()

        }
    )

}


// =========================================================
// PREVENT DOUBLE CLICK
// =========================================================

document.addEventListener(
    'dblclick',
    event => {

        const target =
            event.target


        if (
            target &&
            (
                target === shotEnemyButton ||
                target === shotMeButton ||
                target === shuffleButton ||
                target === headsButton ||
                target === tailsButton
            )
        ) {

            event.preventDefault()

        }

    }
)


// =========================================================
// LOAD LEADERBOARD
// =========================================================

async function loadLeaderboard() {

    if (!leaderboardList) {
        return
    }


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


    try {

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

    } catch (error) {

        console.error(
            'Leaderboard exception:',
            error
        )


        leaderboardList.innerHTML = `
            <div class="leaderboard-error">
                Failed to load leaderboard.
            </div>
        `

    }

}


// =========================================================
// RENDER LEADERBOARD
// =========================================================

function renderLeaderboard(
    data
) {

    if (!leaderboardList) {
        return
    }


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
// ESCAPE HTML
// =========================================================

function escapeHTML(
    text
) {

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
            playerUsername

    }


    if (currentUsernameElement) {

        currentUsernameElement.textContent =
            playerUsername ||
            'Guest'

    }

}


// =========================================================
// VALIDATE USERNAME
// =========================================================

function validateUsername(
    username
) {

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
// SET PLAYER USERNAME
// =========================================================

function setPlayerUsername(
    username
) {

    const result =
        validateUsername(
            username
        )


    if (!result.valid) {
        return false
    }


    playerUsername =
        result.username


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


    hasLoggedIn =
        true


    updateUsernameUI()


    return true

}


// =========================================================
// WELCOME ERROR
// =========================================================

function showWelcomeError(
    message
) {

    if (!welcomeError) {
        return
    }


    welcomeError.textContent =
        message


    welcomeError.classList.add(
        'show'
    )

}


function hideWelcomeError() {

    if (!welcomeError) {
        return
    }


    welcomeError.textContent =
        ''


    welcomeError.classList.remove(
        'show'
    )

}


// =========================================================
// SHOW WELCOME
// =========================================================

function showWelcomeScreen() {

    if (!welcomeScreen) {
        return
    }


    welcomeScreen.style.display =
        'flex'


    requestAnimationFrame(() => {

        welcomeScreen.style.opacity =
            '1'

        welcomeScreen.style.pointerEvents =
            'auto'

    })


    if (game) {

        game.style.pointerEvents =
            'none'

    }


    if (welcomeUsernameInput) {

        welcomeUsernameInput.value =
            playerUsername


        if (!playerUsername) {

            setTimeout(() => {

                welcomeUsernameInput.focus()

            }, 250)

        }

    }

}


// =========================================================
// HIDE WELCOME
// =========================================================

function hideWelcomeScreen() {

    if (!welcomeScreen) {
        return
    }


    welcomeScreen.style.opacity =
        '0'


    welcomeScreen.style.pointerEvents =
        'none'


    if (game) {

        game.style.pointerEvents =
            'auto'

    }


    setTimeout(() => {

        if (welcomeScreen) {

            welcomeScreen.style.display =
                'none'

        }

    }, 500)

}


// =========================================================
// PLAY FROM WELCOME
// =========================================================

async function playFromWelcome() {

    if (gameStarted) {
        return
    }


    hideWelcomeError()


    let username =
        playerUsername || ''


    if (welcomeUsernameInput) {

        username =
            welcomeUsernameInput.value.trim()

    }


    const validation =
        validateUsername(
            username
        )


    if (!validation.valid) {

        showWelcomeError(
            validation.message
        )


        if (welcomeUsernameInput) {

            welcomeUsernameInput.focus()


            welcomeUsernameInput.classList.add(
                'input-error'
            )


            setTimeout(() => {

                welcomeUsernameInput.classList.remove(
                    'input-error'
                )

            }, 500)

        }


        return

    }


    if (
        !setPlayerUsername(
            validation.username
        )
    ) {

        return

    }


    // =====================================================
    // START AUDIO
    // =====================================================

    startGameSounds()


    // =====================================================
    // SUPABASE CHECK
    // =====================================================

    if (!supabaseClient) {

        console.error(
            'Supabase client tidak tersedia.'
        )


        showWelcomeError(
            'Supabase is unavailable.'
        )


        stopGameSounds()

        return

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.functions.invoke(
                'start-game',
                {
                    body: {
                        player_name:
                            playerUsername
                    }
                }
            )


        if (error) {

            console.error(
                'START GAME ERROR:',
                error
            )


            if (error.context) {

                try {

                    console.error(
                        'START GAME ERROR BODY:',
                        await error.context.text()
                    )

                } catch (e) {}

            }


            showWelcomeError(
                'Failed to start game.'
            )


            stopGameSounds()

            return

        }


        if (
            !data ||
            data.success !== true ||
            !data.session_id
        ) {

            console.error(
                'INVALID START GAME RESPONSE:',
                data
            )


            showWelcomeError(
                'Game session was not created.'
            )


            stopGameSounds()

            return

        }


        // =================================================
        // SAVE SERVER SESSION
        // =================================================

        gameSessionId =
            data.session_id


        // =================================================
        // ENTER GAME
        // =================================================

        hideWelcomeScreen()

        startGame()

    } catch (error) {

        console.error(
            'START GAME EXCEPTION:',
            error
        )


        showWelcomeError(
            'Failed to start game.'
        )


        stopGameSounds()

    }

}


// =========================================================
// CHANGE USERNAME
// =========================================================

function changePlayerUsername() {

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


    gameSessionId =
        null


    if (welcomeUsernameInput) {

        welcomeUsernameInput.value =
            ''

        welcomeUsernameInput.focus()

    }


    showWelcomeScreen()

    updateUsernameUI()

}


// =========================================================
// ADD PLAYER WIN
// =========================================================
//
// PENTING:
//
// Function ini PRIVATE.
//
// User TIDAK BISA memanggil:
//
// addPlayerWin()
//
// langsung dari Console.
//
// TAPI:
//
// Ini BUKAN berarti database sudah aman.
//
// Keamanan sebenarnya harus ada di:
//
// Supabase RPC
// Edge Function
// RLS
// Database permission
//
// =========================================================

async function addPlayerWin() {

    if (!supabaseClient) {
        return false
    }


    const username =
        String(
            playerUsername || ''
        ).trim()


    if (!username) {
        return false
    }


    try {

        const {
            error
        } =
            await supabaseClient.rpc(
                'submit_win',
                {
                    p_username:
                        username
                }
            )


        if (error) {

            console.error(
                'Error submit win:',
                error
            )


            return false

        }


        await loadLeaderboard()


        return true

    } catch (error) {

        console.error(
            'SUBMIT WIN EXCEPTION:',
            error
        )


        return false

    }

}


// =========================================================
// GET PLAYER WINS
// =========================================================

async function getPlayerWins() {

    if (!supabaseClient) {
        return 0
    }


    if (!playerUsername) {
        return 0
    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from('leaderboard')
                .select(
                    'wins'
                )
                .eq(
                    'username',
                    playerUsername
                )
                .maybeSingle()


        if (error) {

            console.error(
                'GET PLAYER WINS ERROR:',
                error
            )


            return 0

        }


        if (!data) {
            return 0
        }


        return Number(
            data.wins
        ) || 0

    } catch (error) {

        console.error(
            'GET PLAYER WINS EXCEPTION:',
            error
        )


        return 0

    }

}


// =========================================================
// TEST SUPABASE
// =========================================================

async function testSupabase() {

    if (!supabaseClient) {

        console.error(
            'Supabase client tidak tersedia.'
        )

        return

    }


    try {

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
                'Supabase test error:',
                error
            )

            return

        }


        console.log(
            'Supabase connection OK.'
        )

    } catch (error) {

        console.error(
            'Supabase test exception:',
            error
        )

    }

}


// =========================================================
// START GAME FROM EXISTING LOGIN
// =========================================================

async function startGameFromExistingLogin() {

    if (!playerUsername) {

        showWelcomeScreen()

        return

    }


    if (!supabaseClient) {

        console.error(
            'Supabase client tidak tersedia.'
        )

        return

    }


    try {

        const {
            data,
            error
        } =
            await supabaseClient.functions.invoke(
                'start-game',
                {
                    body: {
                        player_name:
                            playerUsername
                    }
                }
            )


        if (error) {

            console.error(
                'START GAME ERROR:',
                error
            )


            if (error.context) {

                try {

                    console.error(
                        'START GAME ERROR BODY:',
                        await error.context.text()
                    )

                } catch (e) {}

            }


            return

        }


        if (
            !data ||
            data.success !== true ||
            !data.session_id
        ) {

            console.error(
                'INVALID START GAME RESPONSE:',
                data
            )

            return

        }


        gameSessionId =
            data.session_id


        startGameSounds()

        startGame()

    } catch (error) {

        console.error(
            'START GAME EXCEPTION:',
            error
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


    gameOver =
        false

    actionLocked =
        false

    gunHolder =
        null

    playerCoinGuess =
        null

    coinAlreadyFlipped =
        false


    gameSessionId =
        null


    startGameFromExistingLogin()

}


// =========================================================
// START GAME
// =========================================================

function startGame() {

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


    stopEnemyTaunts()

    resetVisualState()

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

}


// =========================================================
// AUDIO UNLOCK
// =========================================================
//
// Beberapa browser terutama Android
// membutuhkan user gesture.
//
// Welcome Play sudah memanggil startGameSounds(),
// tetapi listener ini membantu unlock audio.
//
// =========================================================

document.addEventListener(
    'pointerdown',
    () => {

        if (!gameSoundsStarted) {
            return
        }


        const audio =
            sounds.backsound


        if (!audio) {
            return
        }


        try {

            const promise =
                audio.play()


            if (
                promise &&
                typeof promise.catch ===
                'function'
            ) {

                promise.catch(() => {})

            }

        } catch (error) {}

    },
    {
        once: true,
        passive: true
    }
)


// =========================================================
// INITIALIZE USERNAME
// =========================================================

updateUsernameUI()


// =========================================================
// INITIALIZE WELCOME
// =========================================================

if (welcomeScreen) {

    showWelcomeScreen()

} else {

    console.warn(
        '#welcomeScreen tidak ditemukan.'
    )

}


// =========================================================
// INITIALIZE LEADERBOARD
// =========================================================

loadLeaderboard()


// =========================================================
// TEST SUPABASE
// =========================================================

testSupabase()


// =========================================================
// INITIAL PARALLAX
// =========================================================

if (table) {

    rect =
        table.getBoundingClientRect()

    parallaxX =
        window.innerWidth / 2

    parallaxY =
        window.innerHeight / 2

    updateParallax()

}


// =========================================================
// SECURITY NOTE
// =========================================================
//
// IIFE membuat function seperti:
//
// playerShootEnemy()
// playerShootSelf()
// playerShuffle()
// addPlayerWin()
//
// TIDAK menjadi property window.
//
// Namun:
//
// JAVASCRIPT CLIENT TIDAK PERNAH BISA
// DISEMBUNYIKAN 100% DARI USER.
//
// Browser tetap harus menerima source code.
//
// Jadi perlindungan WIN wajib berada di server.
//
// Jangan mengandalkan:
//
// if (typeof addPlayerWin === ...)
// Object.freeze()
// disable console
// obfuscation
// IIFE
//
// untuk keamanan database.
//
// =========================================================


// =========================================================
// END OF PRIVATE SCOPE
// =========================================================

})()