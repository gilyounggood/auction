import icon1 from '../assets/images/icon/다이아몬드.png'
import icon2 from '../assets/images/icon/돈다발.png'
import icon3 from '../assets/images/icon/메달.png'
import icon4 from '../assets/images/icon/메타몽.png'
import icon5 from '../assets/images/icon/상어.png'
import icon6 from '../assets/images/icon/왕관.png'
import icon7 from '../assets/images/icon/용.png'
import icon8 from '../assets/images/icon/종이비행기.png'
import icon9 from '../assets/images/icon/트로피.png'
import icon10 from '../assets/images/icon/황금벌레.png'
import icon11 from '../assets/images/icon/지구.png'
import icon12 from '../assets/images/icon/은하.png'

let setIcon = (name) => {
    if(name==="다이아몬드") {
        return icon1;
    } else if (name==="돈다발") {
        return icon2;
    } else if (name==="메달") {
        return icon3;
    } else if (name==="메타몽") {
        return icon4;
    } else if (name==="상어") {
        return icon5;
    } else if (name==="왕관") {
        return icon6;
    } else if (name==="용") {
        return icon7;
    } else if (name==="종이비행기") {
        return icon8;
    } else if (name==="트로피") {
        return icon9;
    } else if (name==="황금벌레") {
        return icon10;
    } else if (name==="지구") {
        return icon11;
    } else if (name==="은하") {
        return icon12;
    } else {
        return null;
    }
}

const IconList = [
    {
    pk: 1,
    name: "다이아몬드",
    point: 1000,
    image: icon1
    },
    {
    pk: 2,
    name: "돈다발",
    point: 1000,
    image: icon2
    },
    {
    pk: 3,
    name: "메달",
    point: 1000,
    image: icon3
    },
    {
    pk: 4,
    name: "메타몽",
    point: 2000,
    image: icon4
    },
    {
    pk: 5,
    name: "상어",
    point: 1500,
    image: icon5
    },
    {
    pk: 6,
    name: "왕관",
    point: 3000,
    image: icon6
    },
    {
    pk: 7,
    name: "용",
    point: 5000,
    image: icon7
    },
    {
    pk: 8,
    name: "종이비행기",
    point: 1000,
    image: icon8
    },
    {
    pk: 9,
    name: "트로피",
    point: 3000,
    image: icon9
    },
    {
    pk: 10,
    name: "황금벌레",
    point: 5000,
    image: icon10
    },
    {
    pk: 11,
    name: "지구",
    point: 2000,
    image: icon11
    },
    {
    pk: 12,
    name: "은하",
    point: 7000,
    image: icon12
    },
]
// export default IconList;
export { setIcon, IconList as default }