const express = require('express')
const bodyParser = require('body-parser')
const dataSource = require('./db.js');
const Clinic = require('./entity/clinic.entity.js');
const Doctor = require('./entity/doctor.entity.js');
const TimeSlot = require('./entity/timeslot.entity.js');
const Appointment = require('./entity/appointment.entity.js');
const moment = require('moment')


const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/doctors', async (req, res) => {
  const doctors = await dataSource.getRepository(Doctor).find();
  res.json({doctors})
})

app.get('/clinics', async (req, res) => {
  const clinics = await dataSource.getRepository(Clinic).find();
  res.json({clinics})
})

app.get('/timeSlots', async (req, res) => {
  let timeSlots = await dataSource.getRepository(TimeSlot)
    .createQueryBuilder('timeSlot')
    .select('DISTINCT timeSlot.slotStart', 'slotStart')
    .getRawMany()
  timeSlots = timeSlots.map( slot => {
    return {
      slotStart: slot.slotStart,
      slotEnd: moment(slot.slotStart, 'HH:mm').add(1, 'hour').format('HH:mm')
    }
  })
  res.json({slots: timeSlots})
})


app.post('/search-slots', async (req, res) => {
  const {date, doctorId, clinicId, slotStart} = req.body;
  if(!date){
    res.status(400).send('date is required');
    return;
  }
  const slotsQuery = dataSource.getRepository(TimeSlot)
    .createQueryBuilder('timeSlot')
    .leftJoin('timeSlot.doctor', 'doctor')
    .leftJoin('timeSlot.clinic', 'clinic')
    .where((qb) => {
      const subQuery = qb.subQuery()
        .select('appointment.timeSlotId')
        .from(Appointment, 'appointment')
        .where('appointment.date = :date', {date})
        .getQuery()
      return 'timeSlot.id NOT IN' + subQuery
    })
    // .select(['doctor.name', 'clinic.name', 'timeSlot.slotStart'])
    .select('doctor.name', 'doctor')
    .addSelect('clinic.name', 'clinic')
    .addSelect('timeSlot.id', 'timeSlotId')
    .addSelect('timeSlot.slotStart', 'slotStart')
  
  if(doctorId){
    slotsQuery.andWhere('doctor.id = :doctorId', {doctorId})
  }
  if(clinicId){
    slotsQuery.andWhere('clinic.id = :clinicId', {clinicId})
  }
  if(slotStart){
    slotsQuery.andWhere('timeSlot.slotStart = :slotStart', {slotStart})
  }

  const slots = await slotsQuery.getRawMany();
  slots.forEach(slot => {
    slot.slotEnd = moment(slot.slotStart, 'HH:mm').add(1, 'hour').format('HH:mm');
  })
  res.json(slots);
})

app.post('/book', async (req, res) => {
  const {date, timeSlotId, patientName, patientEmail} = req.body;
  if(!date){
    res.status(400).send('date is required');
    return;
  }
  if(!timeSlotId){
    res.status(400).send('timeSlotId is required');
    return;
  }
  if(!patientName){
    res.status(400).send('patientName is required');
    return;
  }
  if(!patientEmail){
    res.status(400).send('patientEmail is required');
    return;
  }
  await dataSource.getRepository(Appointment).save({
    date, timeSlotId, patientName, patientEmail
  })
  res.send('Booking successful')
})

app.listen(3000)