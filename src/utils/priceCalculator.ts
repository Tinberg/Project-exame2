// Totalprice for booked venues (tab view and manage Bookings)
export function calculateTotalPrice(
    dateFrom: Date,
    dateTo: Date,
    pricePerNight: number
  ): number {
    const oneDay = 1000 * 60 * 60 * 24;
    let numberOfDays = (dateTo.getTime() - dateFrom.getTime()) / oneDay;
  
    numberOfDays = Math.round(numberOfDays);
  
    if (numberOfDays < 0) {
      return 0;
    }
    if (numberOfDays === 0) {
      numberOfDays = 1;
    }
  
    return numberOfDays * pricePerNight;
  }
  