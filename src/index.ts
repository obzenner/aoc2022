import { day1 } from './solutions/day1';
import { day2 } from './solutions/day2';


(async () => {
    const day1res = await day1();
    const day2res = await day2();

    const res = {
        day1: day1res,
        day2: day2res
    }
    console.log(res);
})();