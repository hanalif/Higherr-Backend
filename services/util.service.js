
function makeId(length = 5) {
    var txt = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for(let i=0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
  }


  function getDeepCopy(item) {
    if (!item) {
    }
    return JSON.parse(JSON.stringify(item));
}

function debounce(func, wait = 500) {
    let timeout;

    return function executedFunction(...args) {
        const later = () => {
            console.log('Go search!');
            clearTimeout(timeout);
            func(...args);
        };

        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

 
module.exports = {
    makeId,
    getRandomInt,
    getDeepCopy,
    debounce
}

