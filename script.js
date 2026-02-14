/* ===========================
   STAGES (GIF + VIDEO)
   =========================== */
const gifStages = [
    "https://media.tenor.com/cBiRfjAlMgYAAAAm/bongocat-happy.webp", // 0 normal
    "video/1.mp4", // 1 confused
    "video/2.mp4", // 2 pleading
    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExemlqbmZlaWI4dml6eG5qdDhldzE1NHBmOW5peWduYzE0a29pMjZpaSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/p1CFQl9lojksco3jjO/200w.webp", // 3 sad
    "video/3.mp4", // 4 sadder
    "video/4.mp4", // 5 devastated
    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGo1dmRhMHNiczV6NnR5MHVxeWk0YTBmdmhwdWFxNDU2ZDNmdDhrciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fFa05KbZowXiEIyRse/giphy.gif", // 6 very devastated
    "video/5.mp4", // 7 extremely devastated
    "https://media.tenor.com/y2YrSU4GhUQAAAAM/kabuuur-run.gif" // 8 crying runaway
]

const noMessages = [
    "No",
    "你确定吗? 🙁",
    "My bb pleaseeeeee... 🥺",
    "我要emotional damage le.....",
    "杀了我就算了吧... 😢",
    "Please??? 💔",
    "你不可以这样对我bbbbb...",
    "最后一次机会要不要! 😭",
    "来抓我呀 你抓不到我的 你手速没那么快 😜"
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

/* ===========================
   ELEMENTS
   =========================== */
const yesBtn = document.getElementById('yes-btn')
const noBtn = document.getElementById('no-btn')
const music = document.getElementById('bg-music')

/* ===========================
   MUSIC AUTOPLAY SAFE START
   =========================== */
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
        music.play().catch(() => {})
        musicPlaying = true
        document.getElementById('music-toggle').textContent = '🔊'
    }
}

/* ===========================
   YES CLICK
   =========================== */
function handleYesClick() {
    if (!runawayEnabled) {
        const msg = yesTeasePokes[Math.min(yesTeasedCount, yesTeasePokes.length - 1)]
        yesTeasedCount++
        showTeaseMessage(msg)
        return
    }
    window.location.href = 'yes.html'
}

/* ===========================
   TOAST MESSAGE
   =========================== */
function showTeaseMessage(msg) {
    const toast = document.getElementById('tease-toast')
    toast.textContent = msg
    toast.classList.add('show')
    clearTimeout(toast._timer)
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2500)
}

/* ===========================
   NO CLICK
   =========================== */
function handleNoClick() {
    noClickCount++

    // Change NO button text
    const msgIndex = Math.min(noClickCount, noMessages.length - 1)
    noBtn.textContent = noMessages[msgIndex]

    // Grow YES button
    const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize)
    yesBtn.style.fontSize = `${currentSize * 1.35}px`

    const padY = Math.min(18 + noClickCount * 5, 60)
    const padX = Math.min(45 + noClickCount * 10, 120)
    yesBtn.style.padding = `${padY}px ${padX}px`

    // Shrink NO button slightly
    if (noClickCount >= 2) {
        const noSize = parseFloat(window.getComputedStyle(noBtn).fontSize)
        noBtn.style.fontSize = `${Math.max(noSize * 0.85, 10)}px`
    }

    // Swap GIF/VIDEO stage
    const stageIndex = Math.min(noClickCount, gifStages.length - 1)
    swapMedia(gifStages[stageIndex])

    // Runaway starts at click 8
    if (noClickCount >= 8 && !runawayEnabled) {
        enableRunaway()
        runawayEnabled = true
    }
}

/* ===========================
   SWAP MEDIA (IMG <-> VIDEO)
   =========================== */
function swapMedia(src) {
    const container = document.querySelector('.gif-container')
    if (!container) return

    // Fade old media
    const current = document.getElementById('cat-gif')
    if (current) current.style.opacity = '0'

    setTimeout(() => {
        container.innerHTML = ""

        const isVideo = /\.(mp4|webm|ogg)$/i.test(src)

        if (isVideo) {
            const video = document.createElement("video")
            video.src = src
            video.autoplay = true
            video.loop = true
            video.muted = true
            video.playsInline = true
            video.id = "cat-gif"

            video.style.width = "220px"
            video.style.height = "220px"
            video.style.objectFit = "contain"
            video.style.filter = "drop-shadow(0 8px 18px rgba(0,0,0,0.15))"
            video.style.opacity = "1"

            // Just in case autoplay is blocked
            video.play().catch(() => {})

            container.appendChild(video)
        } else {
            const img = document.createElement("img")
            img.src = src
            img.id = "cat-gif"
            img.alt = "cute character"

            img.style.width = "220px"
            img.style.height = "220px"
            img.style.objectFit = "contain"
            img.style.filter = "drop-shadow(0 8px 18px rgba(0,0,0,0.15))"
            img.style.opacity = "1"
            img.style.transition = "opacity 0.3s ease"

            container.appendChild(img)
        }
    }, 200)
}

/* ===========================
   RUNAWAY NO BUTTON
   =========================== */
function enableRunaway() {
    noBtn.addEventListener('mouseover', runAway)
    noBtn.addEventListener('touchstart', runAway, { passive: true })
}

function runAway() {
    const margin = 20
    const btnW = noBtn.offsetWidth
    const btnH = noBtn.offsetHeight

    const maxX = window.innerWidth - btnW - margin
    const maxY = window.innerHeight - btnH - margin

    const randomX = Math.random() * maxX + margin / 2
    const randomY = Math.random() * maxY + margin / 2

    noBtn.style.position = 'fixed'
    noBtn.style.left = `${randomX}px`
    noBtn.style.top = `${randomY}px`
    noBtn.style.zIndex = '50'
}

/* ===========================
   FLOATING HEARTS BACKGROUND
   =========================== */
const heartsContainer = document.querySelector('.hearts-bg')
const heartEmojis = ["💗","💖","💘","💕","💞","❤️"]

function spawnHeart() {
    if (!heartsContainer) return

    const heart = document.createElement("div")
    heart.className = "heart"
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)]

    const left = Math.random() * 100
    const duration = 5 + Math.random() * 5
    const size = 16 + Math.random() * 25

    heart.style.left = left + "vw"
    heart.style.animationDuration = duration + "s"
    heart.style.fontSize = size + "px"

    heartsContainer.appendChild(heart)

    setTimeout(() => heart.remove(), duration * 1000)
}

setInterval(spawnHeart, 250)
