const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/-ozRS87uGPsAAAAC/chiikawa-cute.gif",      // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
    "No",
    "Are you positive? 🤔",
    "Pookie please... 🥺",
    "If you say no, I will be really sad...",
    "I will be very sad... 😢",
    "Please??? 💔",
    "Don't do this to me...",
    "Last chance! 😭",
    "You can't catch me anyway 😜"
]

const yesTeasePokes = [
    "try saying no first... I bet you want to know what happens 😏",
    "go on, hit no... just once 👀",
    "you're missing out 😈",
    "click no, I dare you 😏"
]

let yesTeasedCount = 0
let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const musicToggle = document.getElementById('music-toggle')

function startMusic() {
    if (!music) return

    music.muted = true
    music.volume = 0.3

    music.play().then(() => {
        music.muted = false
        if (musicToggle) musicToggle.textContent = '🔊'
    }).catch(() => {
        const enableAudio = () => {
            music.muted = false
            music.play().catch(() => {})
            document.removeEventListener('click', enableAudio)
            document.removeEventListener('pointerdown', enableAudio)
        }

        document.addEventListener('click', enableAudio, { once: true })
        document.addEventListener('pointerdown', enableAudio, { once: true })
    })
}

startMusic()

function toggleMusic() {
    if (!music) return

    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        if (musicToggle) musicToggle.textContent = '🔇'
    } else {
        music.muted = false
        music.play().catch(() => {})
        musicPlaying = true
        if (musicToggle) musicToggle.textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }

    window.location.href = 'yes.html'
}

function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')
    if (!toast) return

    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    noClickCount++

    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`

    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    if (noClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    if (!catGif) return

    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    if (!noBtn) return

    noBtn.addEventListener('pointerenter', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    if (!noBtn) return

    const margin = 20
    const btnW = noBtn.offsetWidth || 120
    const btnH = noBtn.offsetHeight || 44

    const maxX = Math.max(margin, window.innerWidth - btnW - margin)
    const maxY = Math.max(margin, window.innerHeight - btnH - margin)

    const randomX = margin + Math.random() * (maxX - margin)
    const randomY = margin + Math.random() * (maxY - margin)

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}
