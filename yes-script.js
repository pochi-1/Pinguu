let musicPlaying = false
let audioContext
let melodyTimer
const music = document.getElementById('bg-music')
const musicToggle = document.getElementById('music-toggle')

function setMusicIcon() {
    musicToggle.textContent = musicPlaying ? '🔊' : '🔇'
}

function playFallbackMusic() {
    if (!window.AudioContext && !window.webkitAudioContext) return false
    audioContext ||= new (window.AudioContext || window.webkitAudioContext)()
    audioContext.resume()
    if (melodyTimer) return true
    const notes = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23]
    let index = 0
    const playNote = () => {
        if (!musicPlaying) return
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
    music.volume = 0.3
    try {
        await music.play()
        musicPlaying = true
    } catch {
        musicPlaying = false
    }
    setMusicIcon()
}

async function toggleMusic() {
    if (musicPlaying) {
        music.pause()
        if (melodyTimer) { clearInterval(melodyTimer); melodyTimer = null }
        musicPlaying = false
    } else {
        try {
            await music.play()
            musicPlaying = true
        } catch {
            musicPlaying = playFallbackMusic()
        }
    }
    setMusicIcon()
}

musicToggle.addEventListener('click', toggleMusic)
music.addEventListener('error', () => { musicPlaying = false; setMusicIcon() })
window.addEventListener('load', () => {
    if (typeof confetti === 'function') {
        confetti({ particleCount: 150, spread: 100, origin: { x: 0.5, y: 0.3 } })
        const end = Date.now() + 6000
        const interval = setInterval(() => {
            if (Date.now() > end) return clearInterval(interval)
            confetti({ particleCount: 40, angle: 60, spread: 55, origin: { x: 0, y: 0.6 } })
            confetti({ particleCount: 40, angle: 120, spread: 55, origin: { x: 1, y: 0.6 } })
        }, 300)
    }
    startMusic()
})
