export function getDuration(begin, end) {
    if (begin == null || isNaN(begin) || end == null || isNaN(end)) {
        return printDuration(0, 0, 0);
    }

    const totalTicks = end - begin;
    const totalSeconds = totalTicks / 1000;

    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor(totalSeconds / 3600);

    return printDuration(hours, minutes, seconds);
}

export function printDuration(hours, minutes, seconds) {
    return `${_padDigit(hours)}:${_padDigit(minutes)}:${_padDigit(seconds)}`;
}

export function hour24ToDate(time) {
    const hour = time.split(':')[0];
    const minute = time.split(':')[1];
    const second = time.split(':')[2];

    const date = new Date();
    date.setHours(Number(hour));
    date.setMinutes(Number(minute));
    date.setSeconds(Number(second));

    return date;
}

function _padDigit(digit) {
    if (digit == null || isNaN(digit)) {
        return '00';
    }

    return digit.toString().padStart(2, '0');
}