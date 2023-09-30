if (localStorage.comicsans) {
    checkComicSans()
}

function getId(id) {
    return document.getElementById(id)
}

function createAt(id) {
    const atPattern = /(@)+[A-Za-z0-9_]{1,}/gim
    const hashtagPattern = /(#)+[A-Za-z0-9_]{1,}/gim

    let replacedText = getId(id).innerHTML.replace(atPattern, (c) => {
        return `<a href="/${c.toLowerCase()}" class='at-link'>${c}</a>`
    });

    replacedText = replacedText.replace(hashtagPattern, (c) => {
        return `<a href="/search?q=${c.replace('#', '').toLowerCase()}" class='at-link'>${c}</a>`
    })

    getId(id).innerHTML = replacedText
}

function checkComicSans() {
    if (JSON.parse(localStorage.comicsans)) {
        document.body.style.fontFamily = 'Comic Sans MS'
    } else {
        document.body.style.fontFamily = 'Arial, Helvetica, sans-serif'
    }
}

function toggleComicSans() {
    const comicSans = localStorage.comicsans
    localStorage.comicsans = comicSans ? !JSON.parse(comicSans) : true
    checkComicSans()
}