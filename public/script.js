if (localStorage.comicsans) {
    checkComicSans()
}

function getId(id) {
    return document.getElementById(id)
}

function createAt(id) {
    const atPattern = / (@)+[A-Za-z0-9_]{1,}/gim
    const hashtagPattern = /(#)+[A-Za-z0-9_]{1,}/gim
    const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gim

    getId(id).innerHTML = ' ' + getId(id).innerHTML

    let replacedText = getId(id).innerHTML.replace(urlPattern, (c) => {
        return `<a href="${c.toLowerCase()}" target="_blank" class="at-link">${c}</a>`
    })

    replacedText = replacedText.replace(atPattern, (c) => {
        return ` <a href="/${c.toLowerCase().replace(' ', '')}" class='at-link'>${c.replace(' ', '')}</a>`
    });

    replacedText = replacedText.replace(hashtagPattern, (c) => {
        return `<a href="/search?q=${c.replace('#', '').toLowerCase()}" class='at-link'>${c}</a>`
    })

    getId(id).innerHTML = replacedText.trim()
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