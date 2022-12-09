import { day1 } from './solutions/day1';
import { day2 } from './solutions/day2';
import { day3 } from './solutions/day3';
import { day4 } from './solutions/day4';
import { day5 } from './solutions/day5';
import { day6 } from './solutions/day6';
import { day7 } from './solutions/day7';


(async () => {
    const day1res = await day1();
    const day2res = await day2();
    const day3res = await day3();
    const day4res = await day4();
    const day5res = await day5();
    const day6res = await day6();
    const day7res = await day7();

    const res = {
        day1: day1res,
        day2: day2res,
        day3: day3res,
        day4: day4res,
        day5: day5res,
        day6: day6res,
        day7: day7res
    }
    console.log(res);
})();