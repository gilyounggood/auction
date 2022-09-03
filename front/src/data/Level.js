import level1 from '../assets/images/level/1.gif'
import level2 from '../assets/images/level/10.gif'
import level3 from '../assets/images/level/20.gif'
import level4 from '../assets/images/level/30.gif'
import level5 from '../assets/images/level/40.gif'
import level6 from '../assets/images/level/50.gif'
import level7 from '../assets/images/level/60.gif'
import level8 from '../assets/images/level/70.gif'
import level9 from '../assets/images/level/80.gif'
import level10 from '../assets/images/level/90.gif'
import level11 from '../assets/images/level/100.gif'
import levelAdmin from '../assets/images/level/102.gif'

let setLevel = (num) => {
    if(num<=10) {
        return level1;
    } else if (num<=20) {
        return level2;
    } else if (num<=30) {
        return level3;
    } else if (num<=40) {
        return level4;
    } else if (num<=50) {
        return level5;
    } else if (num<=60) {
        return level6;
    } else if (num<=70) {
        return level7;
    } else if (num<=80) {
        return level8;
    } else if (num<=90) {
        return level9;
    } else if (num<=100) {
        return level10;
    } else if (num<=99999) {
        return level11;
    } else if (1000000 <= num) {
        return levelAdmin;
    } else {
        return 0;
    }
}
export default setLevel