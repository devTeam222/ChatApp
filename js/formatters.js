class TimeFormatter {
    constructor(time, long = true) {
        this.long = long;
        this.time = new Date(time * 1000);
        this.period = time;
        this.currentDate = new Date();
    }

    formatNumber(number) {
        return number < 10 ? '0' + number : number;
    }

    getDocumentLang() {
        return document.documentElement.lang;
    }

    formatTime() {
        const yearOption = { day: 'numeric', month: 'long', year: 'numeric' };
        const monthOption = { day: 'numeric', month: 'long' };
        const weekOption = { weekday: 'long' };

        const sameYear = this.time.getFullYear() === this.currentDate.getFullYear();
        const timeDifferenceInDays = Math.floor((this.currentDate - this.time) / (24 * 60 * 60 * 1000));

        const hours = this.formatNumber(this.time.getHours());
        const minutes = this.formatNumber(this.time.getMinutes());

        const lang = this.getDocumentLang();

        let formattedTime = sameYear && this.time.toLocaleDateString() === this.currentDate.toLocaleDateString()
            ? hours + ':' + minutes
            : sameYear
                ? new Intl.DateTimeFormat(lang, (timeDifferenceInDays > 6 ? monthOption : weekOption)).format(this.time)
                : new Intl.DateTimeFormat(lang, yearOption).format(this.time);

        formattedTime = (formattedTime[0].toUpperCase() + formattedTime.slice(1));
        formattedTime = (!this.long) && /^[a-zA-Z]+$/.test(formattedTime) ? (formattedTime.slice(0, 3) + '.') : formattedTime;

        return formattedTime;
    }
    formatLongTime() {
        const yearOption = { day: 'numeric', month: 'long', year: 'numeric' };
        const monthOption = { day: 'numeric', month: 'long' };
        const weekOption = { weekday: 'long' };

        const sameYear = this.time.getFullYear() === this.currentDate.getFullYear();
        const timeDifferenceInDays = Math.floor((this.currentDate - this.time) / (24 * 60 * 60 * 1000));

        const hours = this.formatNumber(this.time.getHours());
        const minutes = this.formatNumber(this.time.getMinutes());

        const lang = this.getDocumentLang();
        let formattedTime =
            sameYear && this.time.toLocaleDateString() === this.currentDate.toLocaleDateString()
                ? hours + ':' + minutes
                : sameYear
                    ? new Intl.DateTimeFormat(lang, ((timeDifferenceInDays > 6)
                        ? monthOption : weekOption)).format(this.time) + ", " + hours + ':' + minutes
                    : new Intl.DateTimeFormat(lang, yearOption).format(this.time);
        formattedTime = formattedTime[0].toUpperCase() + formattedTime.slice(1);

        formattedTime = (formattedTime[0].toUpperCase() + formattedTime.slice(1));

        return formattedTime;
    }
    
}
class NumberFormatter {
    constructor(number) {
        this.number = number;
        this.lang = document.documentElement.lang || 'en-US';
    }
    formatTime(){
        const nombre = this.number;
        const conversions = [
            { seuil: 60, unite: 'second', diviseur: 1 },
            { seuil: 3600, unite: 'minute', diviseur: 60 },
            { seuil: (3600*24), unite: 'hour', diviseur: 3600 },
            { seuil: 604800, unite: 'day', diviseur: 86400 },
            { seuil: 2629800, unite: 'week', diviseur: 604800 },
            { seuil: 31557600, unite: 'month', diviseur: 2629800 },
            { seuil: Infinity, unite: 'year', diviseur: 31557600 }
        ];
    
        let valeurFormatee;
        let quotient;
    
        const { seuil, unite, diviseur } = conversions.find(({ seuil }) => nombre < seuil) || conversions[conversions.length - 1];
    
        if (seuil === Infinity) {
            quotient = nombre;
        } else {
            quotient = Math.floor(nombre / diviseur);
        }
    
        const options = {
            style: 'unit',
            unit: unite
        };
    
        const formateur = new Intl.NumberFormat(this.lang, options);
        valeurFormatee = formateur.format(quotient);
    
        return valeurFormatee;
    }
}
 
export { 
    NumberFormatter, 
    TimeFormatter
 }