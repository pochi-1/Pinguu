const gifStages = [
    "https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif",    // 0 normal
    "https://media1.tenor.com/m/-ozRS87uGPsAAAAC/chiikawa-cute.gif",  // 1 confused
    "https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif",             // 2 pleading
    "https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif",             // 3 sad
    "https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif",       // 4 sadder
    "https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif",             // 5 devastated
    "https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif",               // 6 very devastated
    "https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif"  // 7 crying runaway
]

const noMessages = [
     "try saying no first... I bet you want to know what happens 😏",
    "Bati na pala tayo 🥰",
    "Try mo lang 😔",
    "click no, I dare you 😏"


]

const yesTeasePokes = [
    "Yes",
    "Are you positive? 🤔",
    "Tampororot ka pa rin? ",
    "I'm sorry po 😙 ",
    "Okay, I undestand. 🥺 ",
    "Sure na sure ka na ba? 😫",
    "NOOOOOOOO..",
    "Last chance! 😭",
    "Last resort. 😜"

]

let yesTeasedCount = 0

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = true

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

// Autoplay: audio starts muted (bypasses browser policy), unmute immediately
music.muted = true
music.volume = 0.3
music.play().then(() => {
    music.muted = false
}).catch(() => {
    // Fallback: unmute on first interaction
    document.addEventListener('click', () => {
        music.muted = false
        music.play().catch(() => {})
    }, { once: true })
})

function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        musicPlaying = false
        document.getElementById('music-toggle').textContent = '🔇'
    } else {
        music.muted = false
        music.play()
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

function handleYesClick() {
    if (!runawayEnabled) {
        // Tease her to try Yes first
        const msg = noTeasePokes[Math.min(noTeasedCount, noTeasePokes.length - 1)]
        noTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'no.html'
}

function showTeaseMessage(msg) {
    let toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

function handleNoClick() {
    yesClickCount++

    // Cycle through guilt-trip messages
    const msgIndex = Math.min(yesClickCount, yesMessages.length - 1)
    yesBtn.textContent = yesMessages[msgIndex]

    // Grow the No button bigger each time
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    noBtn.style.fontSize = `${currentSize * 1.35}px`
    const padY = Math.min(18 + yesClickCount * 5, 60)
    const padX = Math.min(45 + yesClickCount * 10, 120)
    noBtn.style.padding = `${padY}px ${padX}px`

    // Shrink Yes button to contrast
    if (yesClickCount >= 2) {
        const yesSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
        yesBtn.style.fontSize = `${Math.max(yesSize * 0.85, 10)}px`
    }

    // Swap cat GIF through stages
    const gifIndex = Math.min(noClickCount, gifStages.length - 1)
    swapGif(gifStages[gifIndex])

    // Runaway starts at click 5
    if (yesClickCount >= 5 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

function swapGif(src) {
    catGif.style.opacity = '0'
    setTimeout(() => {
        catGif.src = src
        catGif.style.opacity = '1'
    }, 200)
}

function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = yesBtn.offsetWidth
    const btnH = yesBtn.offsetHeight
    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    yesBtn.style.position = 'fixed'
    yesBtn.style.left = `${randomX}px`
    yesBtn.style.top = `${randomY}px`
    yesBtn.style.zIndex = '50'
}
