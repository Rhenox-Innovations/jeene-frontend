export const getDateTime = (dateTimeString, onlyDate = false) => {
    const date = new Date(dateTimeString);
    let options = {}
    if(onlyDate) {
        options = {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        }
    }
    else{
        options = {
            weekday: 'short',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        }
    }
    

    return date.toLocaleString('en-US', options).replaceAll(',', '').replace(' at ', ' ');
}