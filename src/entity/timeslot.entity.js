const typeorm = require('typeorm');

const TimeSlot = new typeorm.EntitySchema({
    name: 'TimeSlot',
    columns: {
        id: {
            primary: true,
            type: 'int',
            generated: true
        },
        doctorId: {
            type: 'int',
            nullable: false,
        },
        clinicId: {
            type: 'int',
            nullable: false,
        },
        slotStart: {
            type: 'varchar',
            nullable: false,
        }
    },
    relations: {
        doctor: {
            target: "Doctor",
            type: 'many-to-one',
            joinColumn: 'doctorId'
        },
        clinic: {
            target: "Clinic",
            type: 'many-to-one',
            joinColumn: 'clinicId'
        },
        appointments: {
            target: 'Appointment',
            type: 'one-to-many',
        },
    }
})

module.exports = TimeSlot;