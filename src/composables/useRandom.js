export default function useRandom() {
    
    function turnToParse() {
        const parsedElement = document.querySelector('[data-onparse]')
        if (parsedElement) {
            const atPattern = /[ \n](@)+[A-Za-z0-9_]{1,}/gim
            const hashtagPattern = /(#)+[A-Za-z0-9_]{1,}/gim
            const urlPattern = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gim

            parsedElement.innerText = ' ' + parsedElement.innerText

            let replacedText = parsedElement.innerText.replace(urlPattern, (c) => {
                return `<a href="${c}" target="_blank" class="at-link">${c}</a>`
            })

            replacedText = replacedText.replace(atPattern, (c) => {
                return ` <a href="/${c.toLowerCase().replace(' ', '')}" class='at-link'>${c.replace(' ', '')}</a>`
            })

            replacedText = replacedText.replace(hashtagPattern, (c) => {
                return `<a href="/search?q=${c.replace('#', '').toLowerCase()}" class='at-link'>${c}</a>`
            })

            parsedElement.innerHTML = replacedText.replace(' ', '')
        }
    }

    function onParse() {
        /*
            CODE BY: https://stackoverflow.com/users/3897775/rounin
        */
        let parseEvent = new Event('parse')
        const initialiseParseableElements = () => {
            let elementsWithParseEventListener = document.querySelectorAll('[data-onparse]');
            elementsWithParseEventListener.forEach((elementWithParseEventListener) => {
                elementWithParseEventListener.addEventListener('parse', updateParseEventTarget, false);
                elementWithParseEventListener.dataset.onparsed = elementWithParseEventListener.dataset.onparse;
                elementWithParseEventListener.removeAttribute('data-onparse');
                elementWithParseEventListener.dispatchEvent(parseEvent);
            })
        }
        const updateParseEventTarget = (e) => {
            switch (e.target.dataset.onparsed) {
                case ('createAt()') : createAt(e.target.id)
            }
        }
        initialiseParseableElements();
        setTimeout(() => {
            initialiseParseableElements();
        }, 3000);
    }

    function styleDate(timestamp) {
        const date = new Date(timestamp.seconds * 1000)
        let readableDate = date.toString().split(' ').splice(1, 3).join(' ')
    
        if (readableDate == Date().toString().split(' ').splice(1, 3).join(' ')) {
            readableDate = date.toString().split(' ').splice(4, 1).join(' ').split(':').splice(0, 2).join(':')
    
            const [hourString, minute] = readableDate.split(":");
            const hour = +hourString % 24;
            readableDate = 'Today at ' + (hour % 12 || 12) + ":" + minute + (hour < 12 ? " AM" : " PM")
        }
    
        return readableDate
    }

    return {
        styleDate,
        turnToParse,
        onParse
    }
}