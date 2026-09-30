const gifStages = [
    'https://media.tenor.com/EBV7OT7ACfwAAAAj/u-u-qua-qua-u-quaa.gif',
    'https://media1.tenor.com/m/-ozRS87uGPsAAAAC/chiikawa-cute.gif',
    'https://media.tenor.com/f_rkpJbH1s8AAAAj/somsom1012.gif',
    'https://media.tenor.com/OGY9zdREsVAAAAAj/somsom1012.gif',
    'https://media1.tenor.com/m/WGfra-Y_Ke0AAAAd/chiikawa-sad.gif',
    'https://media.tenor.com/CivArbX7NzQAAAAj/somsom1012.gif',
    'https://media.tenor.com/5_tv1HquZlcAAAAj/chiikawa.gif',
    'https://media1.tenor.com/m/uDugCXK4vI4AAAAC/chiikawa-hachiware.gif'
]

const noMessages = ['No', 'Are you positive? 🤔', 'Pookie please... 🥺', 'If you say no, I will be really sad...', 'I will be very sad... 😢', 'Please??? 💔', "Don't do this to me...", 'Last chance! 😭', "You can't catch me anyway 😜"]

let noClickCount = 0
let runawayEnabled = false
let musicPlaying = false
let audioContext
let melodyTimer

const catGif = document.getElementById('cat-gif')
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')
const musicToggle = document.getElementById('music-toggle')

function setMusicIcon() {
    if (musicToggle) musicToggle.textContent = musicPlaying ? '🔊' : '🔇'
}

function playFallbackMusic() {
    if (!window.AudioContext && !window.webkitAudioContext) return false
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)()
    if (audioContext.state === 'suspended') audioContext.resume()
    if (melodyTimer) return true

    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23]
    let index = 0
    const playNote = () => {
        if (!musicPlaying || !audioContext) return
        const oscillator = audioContext.createOscillator()
        const gain = audioContext.createGain()
        oscillator.frequency.value = notes[index++ % notes.length]
        oscillator.type = 'sine'
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.06, audioContext.currentTime + 0.03)
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.45)
        oscillator.connect(gain).connect(audioContext.destination)
        oscillator.start()
        oscillator.stop(audioContext.currentTime + 0.5)
    }
    playNote()
    melodyTimer = setInterval(playNote, 500)
    return true
}

async function startMusic() {
    if (!music) return
    music.volume = 0.3
    try {
        await music.play()
        musicPlaying = true
    } catch {
        // Browsers require a gesture for audible autoplay; the first button/toggle click retries it.
        musicPlaying = false
    }
    setMusicIcon()
}

async function ensureMusic() {
    if (musicPlaying) return
    try {
        if (music && music.readyState > 0) {
            await music.play()
            musicPlaying = true
        } else {
            musicPlaying = playFallbackMusic()
        }
    } catch {
        musicPlaying = playFallbackMusic()
    }
    setMusicIcon()
}

async function toggleMusic() {
    if (musicPlaying) {
        music?.pause()
        if (melodyTimer) { clearInterval(melodyTimer); melodyTimer = null }
        musicPlaying = false
    } else {
        await ensureMusic()
    }
    setMusicIcon()
}

function handleYesClick() {
    void ensureMusic()
    window.location.href = 'yes.html'
}

function handleNoClick() {
    void ensureMusic()
    noClickCount++
    noBtn.textContent = noMessages[Math.min(noClickCount, noMessages.length - 1)]

    const currentSize = parseFloat(getComputedStyle(yesBtn).fontSize) || 25.6
    yesBtn.style.fontSize = `${Math.min(currentSize * 1.2, 64)}px`
    yesBtn.style.padding = `${Math.min(18 + noClickCount * 4, 48)}px ${Math.min(45 + noClickCount * 8, 100)}px`

    if (noClickCount >= 2) {
        const noSize = parseFloat(getComputedStyle(noBtn).fontSize) || 16
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }
    swapGif(gifStages[Math.min(noClickCount, gifStages.length - 1)])
    if (noClickCount >= 5 && !runawayEnabled) {
        runawayEnabled = true
        noBtn.addEventListener('pointerenter', runAway)
        noBtn.addEventListener('touchstart', runAway, { passive: true })
    }
}

function swapGif(src) {
    if (!catGif) return
    catGif.style.opacity = '0'
    setTimeout(() => { catGif.src = src; catGif.style.opacity = '1' }, 200)
}

function runAway() {
    const margin = 20
    const maxX = Math.max(margin, innerWidth - noBtn.offsetWidth - margin)
    const maxY = Math.max(margin, innerHeight - noBtn.offsetHeight - margin)
    noBtn.style.position = 'fixed'
    noBtn.style.left = `${margin + Math.random() * (maxX - margin)}px`
    noBtn.style.top = `${margin + Math.random() * (maxY - margin)}px`
    noBtn.style.zIndex = '50'
}

yesBtn?.addEventListener('click', handleYesClick)
noBtn?.addEventListener('click', handleNoClick)
musicToggle?.addEventListener('click', toggleMusic)
music?.addEventListener('error', () => { musicPlaying = false; setMusicIcon() })
startMusic()
