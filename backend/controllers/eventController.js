const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel.js");

const createEvent = asyncHandler(async (req, res) => {
  console.log("createEvent arrived on server");
  const { typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes } = req.body;

  // check if coordinate exists in db

  const eventExists = await Event.findOne({ coordinate });

  if (eventExists) {
    res.status(409);
    res.json({ message: "Event already exists" });
    throw new Error("Event already exists");
  }


  // create new event document in db
  const event = await Event.create({
    typeOfCrime,
    crimeDescription,
    coordinate,
    date,
    email,
    upvotes,
    downvotes,
  });

  if (event) {
    res.status(201).json({
      _id: event._id,
      event: {
        typeOfCrime: event.typeOfCrime,
        crimeDescription: event.crimeDescription,
        coordinate: event.coordinate,
        date: event.date,
        email: event.email,
        upvotes: event.upvotes,
        downvotes: event.downvotes,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid event data");
  }
});


const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);
    
    if (event) {
        await event.remove();
        res.json({ message: "Event removed" });
    } else {
        res.status(404);
        throw new Error("Event not found");
    }
});

const getAllEvents = asyncHandler(async (req, res) => {
  console.log("getAllEvents arrived on server");
  const events = await Event.find({});
  res.json(events);
});

const updateEvent = asyncHandler(async (req, res) => {
  console.log("updateEvent arrived on server");
  const { typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) {
	event.typeOfCrime = typeOfCrime;
	event.crimeDescription = crimeDescription;
	event.coordinate = coordinate;
	event.date = date;
	event.email = email;
	event.upvotes = upvotes;
	event.downvotes = downvotes;
	await event.save();

	// console.log(event);

	res.status(200).json({
			  _id: event._id,
			  event: {
				typeOfCrime: event.typeOfCrime,
				crimeDescription: event.crimeDescription,
				coordinate: event.coordinate,
				date: event.date,
				email: event.email,
				upvotes: event.upvotes,
				downvotes: event.downvotes,
				},
	});
  } else {
	res.status(404);
	throw new Error("Event not found");
  }
});


module.exports = { createEvent, deleteEvent, getAllEvents, updateEvent };