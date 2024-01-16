

class UtilityService {
    static convertWeekDayToCode(weekDays){
        const formattedWeekDays = []
        weekDays.forEach(weekDay=>{
        weekDay = weekDay.toLowerCase()
        switch (weekDay) {
            case 'sunday':
                formattedWeekDays.push(0)
                break;
            case 'monday':
                formattedWeekDays.push(1)
                break;
            case 'tuesday':
                formattedWeekDays.push(2)
                break;
            case 'wednesday':
                formattedWeekDays.push(3)
                break;
            case 'thursday':
                formattedWeekDays.push(4)
                break;
            case 'friday':
                formattedWeekDays.push(5)
                break;
            case 'saturday':
                formattedWeekDays.push(6)
                break;
        
            default:
                return
                break;
        }
    })
    return formattedWeekDays
    }

    static getNextOccurrencesForWeeks(targetWeekdays, numOfWeeks) {
        const today = new Date();
        const upcomingDates = [];
      
        for (let i = 0; i < numOfWeeks; i++) {
          targetWeekdays.forEach((targetWeekday) => {
            const daysToAdd = (targetWeekday - today.getDay() + 7) % 7;
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + daysToAdd + i * 7);
            upcomingDates.push(nextDate.toISOString().split('T')[0]);
          });
        }
      
        return upcomingDates.sort();
      }
}

module.exports = UtilityService