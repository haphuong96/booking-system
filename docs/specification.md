Booking System Specification
Jitsu is a last-mile logistics company that provides a comprehensive solution from receiving
shipping orders, sorting, to final delivery. You only need to submit the shipping information for
the orders you want to deliver—Jitsu will take care of the rest, from sorting to delivery.
Everyday we have a lot of assignments (routes) that need to be delivered. So we need to create
a booking system that allows drivers to book tickets on it and each ticket can claim 1
assignment in a specific zone.
Please design and implement to support the following requirements (database you are free to determine).

Booking session need to include following informations:
-​ Region code: identifier of booking session region, eg: SFO,LAX…
-​ Name: Specific name of it.
-​ Target date: this booking session is served for which date?
-​ Target drivers: specific which driver can access this booking.
-​ Start booking time: which time that driver can start to book.
-​ End booking time: which time that this booking will end, no longer can book tickets.
-​ Latest cancellation time: the latest time that driver can cancel the booked ticket, after
that time, driver cannot unbook the booked ticket.
-​ Max tickets per driver: maximum number of tickets that driver can book.
Tickets/Assignments:
-​ Has a zone tie with them, like: Z1, Z2 … Drivers can only claim assignments have same
zone as booked tickets
-​ Target date: date of the assignments/tickets.
API Requirements:
-​ APIs for admin to list/create/delete booking sessions.
-​ APIs for admin to list/add/delete tickets from booking.
-​ APIs for drivers to book/unbook tickets. (a lot of drivers can book tickets at the same
time, only the first one gets it).
-​ APIs for drivers to claim/unclaim assignments after booked tickets. (a lot of drivers can
claim assignments at the same time, only the first one gets it).
-​ APIs for admin to book/unbook tickets of drivers. (can override if the ticket is already
booked).
-​ APIs for admin to claim/unclaim assignments of drivers tickets. (can override if the
assignment is already claimed).
-​ Create a schedule to clean unclaimed tickets after booking end time. (optional, nice to
have)
