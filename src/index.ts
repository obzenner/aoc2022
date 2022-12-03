import { day1 } from './solutions/day1';
import { day2 } from './solutions/day2';
import { day3 } from './solutions/day3';


(async () => {
    const day1res = await day1();
    const day2res = await day2();
    const day3res = await day3();

    const res = {
        day1: day1res,
        day2: day2res,
        day3: day3res,
    }
    console.log(res);
})();