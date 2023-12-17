export const getIntegerOfUsedTime = (startDate: Date, endDate: Date) => {
    const HOUR13: Date = new Date(startDate);
    const HOUR18: Date = new Date(endDate);
    HOUR13.setHours(13, 0, 0, 0);
    HOUR18.setHours(18, 0, 0, 0);
    let byteValue: number = 0b0;

    if ((startDate <= HOUR13) && endDate >= HOUR18) {
        return 0b11111111111111111111;
    } else if (endDate <= HOUR13 || startDate >= HOUR18) {
        return 0b0;
    } else {
        if (startDate < HOUR13) {
            startDate.setHours(13, 0, 0, 0);
        }
        if (endDate > HOUR18) {
            endDate.setHours(18, 0, 0, 0);
        }
        const pipot = new Date(startDate.getTime());

        while (pipot < endDate) {
            byteValue = byteValue * 0b10 + 0b1;
            pipot.setMinutes(pipot.getMinutes() + 15);
        }
        while (pipot < HOUR18) {
            byteValue *= 0b10;
            pipot.setMinutes(pipot.getMinutes() + 15);
        }

        return byteValue;
    }
};

export const getStringOfFreeTime = (value: number) => {
    const TIME: string[] = [
        "13:00", "13:15", "13:30", "13:45",
        "14:00", "14:15", "14:30", "14:45",
        "15:00", "15:15", "15:30", "15:45",
        "16:00", "16:15", "16:30", "16:45",
        "17:00", "17:15", "17:30", "17:45",
        "18:00"];
    let pipot: number = 0b10000000000000000000;
    let index: number = 0;
    let startFlag: boolean = true;
    const results: string[] = [];
    let result: string = "";

    while (pipot >= 1) {
        if ((value - value % pipot) / pipot === 0) {
            if (startFlag) {
                result += `${TIME[index]}~`;
                startFlag = false;
            }
        } else {
            if (!startFlag) {
                result += TIME[index];
                results.push(result);
                result = "";
                startFlag = true;
            }
            value -= pipot;
        }
        index++;
        pipot /= 0b10;
    }
    if (!startFlag) {
        result += TIME[index];
        results.push(result);
    }
    return results;
}