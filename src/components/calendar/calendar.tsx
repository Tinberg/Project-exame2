// import { useEffect, useState, useContext } from "react";
// import { Form, Button, Row, Col, Alert } from "react-bootstrap";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";
// import { useForm } from "react-hook-form";
// import { useCreateBooking } from "../../hooks/apiHooks/useBookings";
// import dayjs from "dayjs";
// import isBetween from "dayjs/plugin/isBetween";
// import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
// import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
// dayjs.extend(isBetween);
// dayjs.extend(isSameOrAfter);
// dayjs.extend(isSameOrBefore);
// import { Venue } from "../../schemas/venue";
// import { UserContext } from "../../contexts/UserContext";
// import { Link } from "react-router-dom";
// import { calculateTotalPrice } from "../..//utils/priceCalculator";
// import "./calendar.scss";

// // Types for BookingSection
// type BookingFormData = {
//   guests: number;
// };

// type BookingSectionProps = {
//   venue: Venue;
// };

// function BookingSection({ venue }: BookingSectionProps) {
//   const { user } = useContext(UserContext);
//   const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
//   const [totalPrice, setTotalPrice] = useState<number>(0);
//   const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
//   const [bookingError, setBookingError] = useState<string | null>(null);
//   const [dateError, setDateError] = useState<string | null>(null);

//   const { register, handleSubmit } = useForm<BookingFormData>({
//     defaultValues: {
//       guests: 1,
//     },
//   });

//   const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

//   // Collect booked date ranges from venue data
//   const bookedDatesRanges =
//     venue.bookings?.map((booking) => {
//       return {
//         from: dayjs(booking.dateFrom).startOf("day"),
//         to: dayjs(booking.dateTo).endOf("day"),
//       };
//     }) || [];

//   // Disable calendar dates that are already booked
//   const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
//     if (view !== "month") return false;
//     return bookedDatesRanges.some((range) =>
//       dayjs(date).isBetween(range.from, range.to, "day", "[]")
//     );
//   };

//   // Add custom class to booked dates
//   const tileClassName = ({ date, view }: { date: Date; view: string }) => {
//     if (view !== "month") return "";
//     // Booked dates
//     if (
//       bookedDatesRanges.some((range) =>
//         dayjs(date).isBetween(range.from, range.to, "day", "[]")
//       )
//     ) {
//       return "";
//     }
//     // Selected dates
//     if (
//       selectedDates &&
//       dayjs(date).isBetween(selectedDates[0], selectedDates[1], "day", "[]")
//     ) {
//       return "bg-primary text-white";
//     }
//     return "";
//   };

//   // Handle date selection
//   const handleDateSelection = (value: Date) => {
//     if (!selectedDates) {
//       setSelectedDates([value, value]);
//     } else {
//       const [fromDate, toDate] = selectedDates;
//       if (dayjs(value).isBefore(fromDate) || dayjs(value).isAfter(toDate)) {
//         setSelectedDates([value, value]);
//       } else {
//         setSelectedDates([fromDate, value]);
//       }
//     }
//   };

//   // Calculate the total price based on selected dates
//   useEffect(() => {
//     if (selectedDates) {
//       const [fromDate, toDate] = selectedDates;
//       if (fromDate && toDate) {
//         setTotalPrice(calculateTotalPrice(fromDate, toDate, venue.price));
//       } else {
//         setTotalPrice(0);
//         setDateError("Please select valid dates.");
//       }
//     } else {
//       setTotalPrice(0);
//     }
//   }, [selectedDates, venue.price]);

//   // Check for overlapping dates
//   const isOverlap = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs) => {
//     return bookedDatesRanges.some((range) => {
//       return (
//         (fromDate.isSameOrAfter(range.from) &&
//           fromDate.isSameOrBefore(range.to)) ||
//         (toDate.isSameOrAfter(range.from) && toDate.isSameOrBefore(range.to)) ||
//         (fromDate.isBefore(range.from) && toDate.isAfter(range.to))
//       );
//     });
//   };

//   // Submit form data after validating dates
//   const onSubmit = (data: BookingFormData) => {
//     setDateError(null);
//     setBookingError(null);

//     if (!selectedDates || !selectedDates[0] || !selectedDates[1]) {
//       setDateError("Please select both a start and end date before booking.");
//       return;
//     }

//     const [fromDateRaw, toDateRaw] = selectedDates;
//     const fromDate = dayjs(fromDateRaw).startOf("day");
//     const toDate = dayjs(toDateRaw).endOf("day");

//     let nights = toDate.diff(fromDate, "day");

//     if (nights < 0) {
//       setDateError("Invalid date range.");
//       return;
//     }
//     if (nights === 0) {
//       nights = 1;
//     }

//     if (isOverlap(fromDate, toDate)) {
//       setDateError(
//         "Selected dates are unavailable. Please choose a different range."
//       );
//       return;
//     }

//     const bookingData = {
//       dateFrom: fromDate.toISOString(),
//       dateTo: toDate.toISOString(),
//       guests: data.guests,
//       venueId: venue.id,
//     };

//     createBooking(bookingData, {
//       onSuccess: () => {
//         setBookingSuccess(true);
//         setBookingError(null);
//       },
//       onError: (error) => {
//         if ((error as any).response && (error as any).response.status === 409) {
//           setBookingError(
//             "Selected dates are unavailable. Please choose a different range."
//           );
//         } else {
//           setBookingError(
//             error.message || "An error occurred. Please try again."
//           );
//         }
//       },
//     });
//   };

//   const isLoggedIn = !!user.accessToken;

//   return (
//     <section aria-labelledby="book-now">
//       <h2 id="book-now" className="mb-4">
//         Book Now
//       </h2>
//       <Form onSubmit={handleSubmit(onSubmit)}>
//         <Row>
//           <Col lg={8} md={12}>
//             <Form.Group className="me-0 me-lg-3" controlId="dates">
//               <Form.Label>Select Dates</Form.Label>
//               <Calendar
//                 selectRange
//                 onChange={(dates: any) => setSelectedDates(dates)}
//                 onClickDay={(value: Date) => handleDateSelection(value)}
//                 tileDisabled={tileDisabled}
//                 tileClassName={tileClassName}
//                 minDate={new Date()}
//                 className="w-100"
//               />{" "}
//               {/* Color Legend */}
//               <Row className="mt-2 mb-4 mb-lg-0">
//                 <Col
//                   xs="auto"
//                   className="d-flex align-items-center px-1 px-sm-3"
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="legend-circle today me-2 border border-dark"
//                   ></span>
//                   <span>Today</span>
//                 </Col>
//                 <Col
//                   xs="auto"
//                   className="d-flex align-items-center px-1 px-sm-3"
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="legend-circle unavailable me-2 border border-dark"
//                   ></span>
//                   <span>Unavailable</span>
//                 </Col>
//                 <Col
//                   xs="auto"
//                   className="d-flex align-items-center px-1 px-sm-3"
//                 >
//                   <span
//                     aria-hidden="true"
//                     className="legend-circle selected me-2 border border-dark"
//                   ></span>
//                   <span>Selected</span>
//                 </Col>
//               </Row>
//             </Form.Group>
//           </Col>
//           <Col lg={4} md={12}>
//             <Form.Group controlId="guests">
//               <Form.Label>Number of Guests (max {venue.maxGuests})</Form.Label>
//               <Form.Control
//                 as="select"
//                 {...register("guests", {
//                   valueAsNumber: true,
//                 })}
//               >
//                 {Array.from({ length: venue.maxGuests }, (_, i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {i + 1}
//                   </option>
//                 ))}
//               </Form.Control>
//             </Form.Group>
//             <p className="mt-3">
//               <span className="fw-bold">Total Price: ${totalPrice}</span>
//             </p>
//             {/* Display alerts */}
//             {dateError && <Alert variant="danger">{dateError}</Alert>}
//             {bookingSuccess && (
//               <Alert variant="success">Booking successful!</Alert>
//             )}
//             {bookingError && <Alert variant="danger">{bookingError}</Alert>}

//             {isLoggedIn ? (
//               <Button
//                 className="px-4 py-2"
//                 aria-label="Book now"
//                 variant="primary"
//                 type="submit"
//                 disabled={isBooking}
//               >
//                 {isBooking ? "Booking..." : "Book Now"}
//               </Button>
//             ) : (
//               <div>
//                 <Button
//                   variant="secondary"
//                   disabled
//                   className="mb-2 me-2 px-4 py-2"
//                 >
//                   Book Now
//                 </Button>
//                 <p className="mt-2">
//                   Please{" "}
//                   <Link
//                     className="text-decoration-underline fw-bold"
//                     to="/login"
//                   >
//                     log in
//                   </Link>{" "}
//                   or{" "}
//                   <Link
//                     className="text-decoration-underline fw-bold"
//                     to="/register"
//                   >
//                     sign up
//                   </Link>{" "}
//                   to book this venue, view owner details, or access other venues
//                   from this owner.
//                 </p>
//               </div>
//             )}
//           </Col>
//         </Row>
//       </Form>
//     </section>
//   );
// }

// export default BookingSection;

import { useEffect, useState, useContext } from "react";
import { Form, Button, Row, Col, Alert } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useForm } from "react-hook-form";
import { useCreateBooking } from "../../hooks/apiHooks/useBookings";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
dayjs.extend(isBetween);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
import { Venue } from "../../schemas/venue";
import { UserContext } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { calculateTotalPrice } from "../../utils/priceCalculator";
import "./calendar.scss";

// Types for BookingSection
type BookingFormData = {
  guests: number;
};

type BookingSectionProps = {
  venue: Venue;
};

function BookingSection({ venue }: BookingSectionProps) {
  const { user } = useContext(UserContext);
  const [selectedDates, setSelectedDates] = useState<[Date, Date] | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [dateError, setDateError] = useState<string | null>(null);

  const { register, handleSubmit } = useForm<BookingFormData>({
    defaultValues: {
      guests: 1,
    },
  });

  const { mutate: createBooking, isPending: isBooking } = useCreateBooking();

  const navigate = useNavigate();

  // Collect booked date ranges from venue data
  const bookedDatesRanges =
    venue.bookings?.map((booking) => {
      return {
        from: dayjs(booking.dateFrom).startOf("day"),
        to: dayjs(booking.dateTo).endOf("day"),
      };
    }) || [];

  // Disable calendar dates that are already booked
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return false;
    return bookedDatesRanges.some((range) =>
      dayjs(date).isBetween(range.from, range.to, "day", "[]")
    );
  };

  // Custom class to booked dates
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return "";
    // Booked dates
    if (
      bookedDatesRanges.some((range) =>
        dayjs(date).isBetween(range.from, range.to, "day", "[]")
      )
    ) {
      return "";
    }
    // Selected dates
    if (
      selectedDates &&
      dayjs(date).isBetween(selectedDates[0], selectedDates[1], "day", "[]")
    ) {
      return "bg-primary text-white";
    }
    return "";
  };

  // Handle date selection
  const handleDateSelection = (value: Date) => {
    if (!selectedDates) {
      setSelectedDates([value, value]);
    } else {
      const [fromDate, toDate] = selectedDates;
      if (dayjs(value).isBefore(fromDate) || dayjs(value).isAfter(toDate)) {
        setSelectedDates([value, value]);
      } else {
        setSelectedDates([fromDate, value]);
      }
    }
  };

  // Calculate the total price based on selected dates
  useEffect(() => {
    if (selectedDates) {
      const [fromDate, toDate] = selectedDates;
      if (fromDate && toDate) {
        setTotalPrice(calculateTotalPrice(fromDate, toDate, venue.price));
      } else {
        setTotalPrice(0);
        setDateError("Please select valid dates.");
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedDates, venue.price]);

  // Check for overlapping dates
  const isOverlap = (fromDate: dayjs.Dayjs, toDate: dayjs.Dayjs) => {
    return bookedDatesRanges.some((range) => {
      return (
        (fromDate.isSameOrAfter(range.from) &&
          fromDate.isSameOrBefore(range.to)) ||
        (toDate.isSameOrAfter(range.from) && toDate.isSameOrBefore(range.to)) ||
        (fromDate.isBefore(range.from) && toDate.isAfter(range.to))
      );
    });
  };

  // Submit form data after validating dates
  const onSubmit = (data: BookingFormData) => {
    setDateError(null);
    setBookingError(null);

    if (!selectedDates || !selectedDates[0] || !selectedDates[1]) {
      setDateError("Please select both a start and end date before booking.");
      return;
    }

    const [fromDateRaw, toDateRaw] = selectedDates;
    const fromDate = dayjs(fromDateRaw).startOf("day");
    const toDate = dayjs(toDateRaw).endOf("day");

    let nights = toDate.diff(fromDate, "day");

    if (nights < 0) {
      setDateError("Invalid date range.");
      return;
    }
    if (nights === 0) {
      nights = 1;
    }

    if (isOverlap(fromDate, toDate)) {
      setDateError(
        "Selected dates are unavailable. Please choose a different range."
      );
      return;
    }

    const bookingData = {
      dateFrom: fromDate.toISOString(),
      dateTo: toDate.toISOString(),
      guests: data.guests,
      venueId: venue.id,
    };

    createBooking(bookingData, {
      onSuccess: () => {
        navigate("/myProfile", { state: { message: "Booking successful!" } });
      },
      onError: (error) => {
        if ((error as any).response && (error as any).response.status === 409) {
          setBookingError(
            "Selected dates are unavailable. Please choose a different range."
          );
        } else {
          setBookingError(
            error.message || "An error occurred. Please try again."
          );
        }
      },
    });
  };

  const isLoggedIn = !!user.accessToken;

  return (
    <section aria-labelledby="book-now">
      <h2 id="book-now" className="mb-4">
        Book Now
      </h2>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col lg={8} md={12}>
            <Form.Group className="me-0 me-lg-3" controlId="dates">
              <Form.Label>Select Dates</Form.Label>
              <Calendar
                selectRange
                onChange={(dates: any) => setSelectedDates(dates)}
                onClickDay={(value: Date) => handleDateSelection(value)}
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                minDate={new Date()}
                className="w-100"
              />
              {/* Color Legend */}
              <Row className="mt-2 mb-4 mb-lg-0">
                <Col
                  xs="auto"
                  className="d-flex align-items-center px-1 px-sm-3"
                >
                  <span
                    aria-hidden="true"
                    className="legend-circle today me-2 border border-dark"
                  ></span>
                  <span>Today</span>
                </Col>
                <Col
                  xs="auto"
                  className="d-flex align-items-center px-1 px-sm-3"
                >
                  <span
                    aria-hidden="true"
                    className="legend-circle unavailable me-2 border border-dark"
                  ></span>
                  <span>Unavailable</span>
                </Col>
                <Col
                  xs="auto"
                  className="d-flex align-items-center px-1 px-sm-3"
                >
                  <span
                    aria-hidden="true"
                    className="legend-circle selected me-2 border border-dark"
                  ></span>
                  <span>Selected</span>
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col lg={4} md={12}>
            <Form.Group controlId="guests">
              <Form.Label>Number of Guests (max {venue.maxGuests})</Form.Label>
              <Form.Control
                as="select"
                {...register("guests", {
                  valueAsNumber: true,
                })}
              >
                {Array.from({ length: venue.maxGuests }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <p className="mt-3">
              <span className="fw-bold">Total Price: ${totalPrice}</span>
            </p>
            {/* Display alerts */}
            {dateError && <Alert variant="danger">{dateError}</Alert>}
            {bookingError && <Alert variant="danger">{bookingError}</Alert>}

            {isLoggedIn ? (
              <Button
                className="px-4 py-2"
                aria-label="Book now"
                variant="primary"
                type="submit"
                disabled={isBooking}
              >
                {isBooking ? "Booking..." : "Book Now"}
              </Button>
            ) : (
              <div>
                <Button
                  variant="secondary"
                  disabled
                  className="mb-2 me-2 px-4 py-2"
                >
                  Book Now
                </Button>
                <p className="mt-2">
                  Please{" "}
                  <Link
                    className="text-decoration-underline fw-bold"
                    to="/login"
                  >
                    log in
                  </Link>{" "}
                  or{" "}
                  <Link
                    className="text-decoration-underline fw-bold"
                    to="/register"
                  >
                    sign up
                  </Link>{" "}
                  to book this venue, view owner details, or access other venues
                  from this owner.
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </section>
  );
}

export default BookingSection;
