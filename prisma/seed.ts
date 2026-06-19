import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Zone identifiers used across routes and tickets
export const ZONES = [
  'Z1',
  'Z2',
  'Z3',
  'Z4',
  'Z5',
  'Z6',
  'Z7',
  'Z8',
  'Z9',
  'Z10',
];

const DRIVERS = [
  'Alice Johnson',
  'Bob Smith',
  'Carlos Garcia',
  'Diana Lee',
  'Ethan Brown',
  'Fiona Davis',
  'George Wilson',
  'Hannah Martinez',
  'Ivan Chen',
  'Julia Kim',
  'Kevin Patel',
  'Laura Thompson',
  'Michael Nguyen',
  'Nina Rodriguez',
  'Oscar Taylor',
];

// 4 routes per zone = 40 routes total, named <zone>-<index> (e.g. Z1-1, Z1-2)
const ROUTES = ZONES.flatMap((zone) =>
  Array.from({ length: 4 }, (_, i) => ({ zone, name: `${zone}-${i + 1}` })),
);

// Seed tickets for the next 3 days, 5 tickets per zone per day = 150 tickets total
function buildTickets(): Prisma.TicketCreateManyInput[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dates = Array.from({ length: 3 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() + i + 1);
    return d;
  });

  return dates.flatMap((targetDate) =>
    ZONES.flatMap((zone) =>
      Array.from({ length: 5 }, () => ({ zone, targetDate })),
    ),
  );
}

async function main() {
  console.log('Seeding drivers...');
  await prisma.driver.deleteMany();
  await prisma.driver.createMany({ data: DRIVERS.map((name) => ({ name })) });
  console.log(`  ✓ ${DRIVERS.length} drivers`);

  console.log('Seeding routes...');
  await prisma.route.deleteMany();
  await prisma.route.createMany({ data: ROUTES });
  console.log(`  ✓ ${ROUTES.length} routes (${ZONES.length} zones × 4 each)`);

  console.log('Seeding tickets...');
  const tickets = buildTickets();
  await prisma.ticket.deleteMany();
  await prisma.ticket.createMany({ data: tickets });
  console.log(
    `  ✓ ${tickets.length} tickets (3 days × ${ZONES.length} zones × 5 each)`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
