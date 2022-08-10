let TimeLeft = (time) => {
    let Time = new Date(time);
    let todayTime = new Date();
    
    let diff = Time - todayTime;

    let diffDay = String(Math.floor(diff / (1000*60*60*24)));
    let diffHour =String( Math.floor((diff / (1000*60*60)) % 24));
    let diffMin = String(Math.floor((diff / (1000*60)) % 60));
    let diffSec = String(Math.floor(diff / 1000 % 60));    
    return `${diffDay}일 ${diffHour}시간`;
}

export default TimeLeft
