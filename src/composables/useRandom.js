import { onMounted } from 'vue'
export default function useRandom() {
    
    function turnToParse() {
        const parsedElement = document.querySelector('[data-onparse]')
        if (parsedElement) {
            const atPattern = /(@)+[A-Za-z0-9_]{1,}/gim
            console.log(parsedElement.innerText)
            const replacedText = parsedElement.innerText.replace(atPattern, (c) => {
                return `<a href="/${c.toLowerCase()}" class='at-link'>${c}</a>`
            });
            parsedElement.innerHTML = replacedText
        }
    }

    onMounted(() => {
        turnToParse()
    })

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
        turnToParse
    }
}