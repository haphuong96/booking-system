import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

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

async function main() {
  console.log('Seeding drivers...');
  await prisma.driver.deleteMany();
  await prisma.driver.createMany({ data: DRIVERS.map((name) => ({ name })) });
  console.log(`  ✓ ${DRIVERS.length} drivers`);

  console.log('Seeding routes...');
  await prisma.route.deleteMany();
  await prisma.route.createMany({ data: ROUTES });
  console.log(`  ✓ ${ROUTES.length} routes (${ZONES.length} zones × 4 each)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
