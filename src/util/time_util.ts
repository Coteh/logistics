export function hoursToTimeString(hour: number) {
    let label: string = "AM";
    if (hour >= 12) {
        if (hour > 12) {
            hour -= 12;
        }
        label = "PM";
    } else if (hour === 0) {
        hour = 12;
    }
    return hour.toString().padStart(2, "0") + ":00 " + label;
}

export function createHoursArr(): number[] {
    return new Array(24).fill(0).map((_, index) => {
        return index;
    });
}
