const readline = require('readline')
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
})

console.log('Parking System is ready to receive input!\n')

rl.prompt()

let parkingSlots = 0
let parkingSlotsLeft = 0
let parking = []

const checkPlateExists = (plate) => {
  let isAllow = true
  for (let i=0;i<parking.length;++i) {
    if (parking[i].plate === plate) {
      isAllow = false
      break
    }
  }
  return isAllow
}

const setParkingSlots = (number) => {
  if (isNaN(number)) return 'Invalid input parameter.'
  if (parkingSlots > 0) {
    return 'You already set parking slots. Please check "status".'
  } else {
    parkingSlots = number
    parkingSlotsLeft = number

    for(let i=0;i<parkingSlots;++i) {
      parking.push({})
    }

    return `Created a parking lot with ${number} slots`
  }
}

const parkCar = (plate, colour) => {
  let allocatedNumber = 0
  if (parkingSlotsLeft > 0) {
    if (checkPlateExists(plate)) {
      for (let i=0;i<parking.length;++i) {
        if (!parking[i].hasOwnProperty('plate')) {
          parking[i] = {
            plate: plate,
            colour: colour
          }

          allocatedNumber = i
          break
        }
      }
      --parkingSlotsLeft
      return `Allocated slot number: ${allocatedNumber}`
    } else {
      return `Plate ${plate} already exists. Please try again.`
    }
  }

  return 'Sorry, parking lot is full.'
}

const parkStatus = () => {
  let msg = 'Parking is full.'
  if (parkingSlotsLeft <= parkingSlots) {
    msg = 'Slot No.\tRegistration No\t\tColour\n'
    for (let i=0;i<parking.length;++i) {
      if (parking[i].hasOwnProperty('plate')) {
        msg += `${i+1}\t\t${parking[i].plate}\t\t\t${parking[i].colour}\n`
      }
    }
    return msg
  } else {
    return 'Parking is full.'
  }
}

const parkLeave = (number) => {
  if (isNaN(number)) return 'Invalid input parameter.'
  if (number > 0 && number <= parkingSlots) {
    parking[(number - 1)] = {}
    ++parkingSlotsLeft
    return `Slot number ${number} is free`
  } else {
    return 'Invalid number of parking slot.'
  }
}

const findCarByColour = (colour, type) => {
  let slots = []
  for (let i=0;i<parking.length;++i) {
    if (type === 1) {
      if (parking[i].colour.toLowerCase() === colour.toLowerCase()) {
        slots.push(i + 1)
      }
    } else {
      slots.push(parking[i].plate)
    }
  }
  if (slots.length > 0) {
    return slots.join(', ')
  } else {
    return `Car with colour ${colour} is not exists.`
  }
}

const findCarByPlate = (plate) => {
  let slot = 0
  for (let i=0;i<parking.length;++i) {
    if (parking[i].plate.toLowerCase() === plate.toLowerCase()) {
      slot = i + 1
      break
    }
  }

  if (slot > 0) {
    return slot.toString()
  } else {
    return `Car with plate ${plate} is not exists.`
  }
}

const CommandHelp = () => {
  let msg = 'Options:\n'
  msg += 'create_parking_lot <number> \t :To Create total number of parking slots\n'
  msg += 'status \t\t\t\t :To Check for parking status. eg: all cars parked.\n'
  msg += 'leave <number>\t\t\t :Leave a car from parking state.\n'
  return msg
}

rl.on('line', (line) => {
  let command = line.trim().split(' ')
  switch (command[0]) {
    case 'create_parking_lot':
      console.log(setParkingSlots(command[1]))
      break
    case 'park':
      if (command.length  === 3) {
        console.log(parkCar(command[1], command[2]))
      } else {
        console.log('Invalid command for parking.')
      }
      break
    case 'leave':
      console.log(parkLeave(command[1]))
      break
    case 'status':
      console.log(parkStatus())
      break
    case 'registration_numbers_for_cars_with_colour':
      console.log(findCarByColour(command[1], 2))
      break
    case 'slot_numbers_for_cars_with_colour':
      console.log(findCarByColour(command[1], 1))
      break
    case 'slot_number_for_registration_number':
      console.log(findCarByPlate(command[1]))
      break
    case 'help':
      console.log(CommandHelp())
      break
    case 'exit':
      rl.close()
      break
    case '':
      break
    default:
      console.log(`Invalid command.`)
      break
  }

  rl.prompt()
}).on('close', () => {
  console.log('Have a great day!')
  process.exit(0)
})
