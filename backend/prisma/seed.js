const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@company.com' },
    update: {},
    create: {
      email: 'admin@company.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin user created:', { id: adminUser.id, email: adminUser.email, role: adminUser.role });

  // Create sample employees with PostgreSQL Decimal handling
  const employees = [
    {
      name: 'John Doe',
      email: 'john.doe@company.com',
      position: 'Software Developer',
      department: 'Engineering',
      salary: 75000.00,
      hireDate: new Date('2023-01-15'),
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@company.com',
      position: 'Product Manager',
      department: 'Product',
      salary: 85000.00,
      hireDate: new Date('2022-08-20'),
    },
    {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      position: 'HR Manager',
      department: 'Human Resources',
      salary: 70000.00,
      hireDate: new Date('2023-06-01'),
    },
    {
      name: 'David Brown',
      email: 'david.brown@company.com',
      position: 'Marketing Specialist',
      department: 'Marketing',
      salary: 60000.00,
      hireDate: new Date('2023-09-15'),
    },
    {
      name: 'Emily Davis',
      email: 'emily.davis@company.com',
      position: 'UI/UX Designer',
      department: 'Design',
      salary: 72000.00,
      hireDate: new Date('2023-04-12'),
    },
    {
      name: 'Robert Taylor',
      email: 'robert.taylor@company.com',
      position: 'DevOps Engineer',
      department: 'Engineering',
      salary: 88000.00,
      hireDate: new Date('2022-11-08'),
    },
    {
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      position: 'Sales Manager',
      department: 'Sales',
      salary: 78000.00,
      hireDate: new Date('2023-02-20'),
    }
  ];

  console.log('Creating sample employees...');

  for (const employeeData of employees) {
    const employee = await prisma.employee.upsert({
      where: { email: employeeData.email },
      update: {},
      create: {
        ...employeeData,
        salary: employeeData.salary.toString() 
      }
    });
    console.log('Employee created:', { id: employee.id, name: employee.name, email: employee.email });
  }

  console.log('Database seeding completed successfully!');
  console.log('\n--- Login Credentials ---');
  console.log('Email: admin@company.com');
  console.log('Password: admin123');
  console.log('Role: ADMIN');
  console.log('------------------------\n');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });