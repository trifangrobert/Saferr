const asyncHandler = require("express-async-handler");
const Event = require("../models/eventModel.js");

const createEvent = asyncHandler(async (req, res) => {
  console.log("createEvent arrived on server");
  const { typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes } = req.body;

  // check if coordinate exists in db

  const eventExists = await Event.findOne({ coordinate });

  if (eventExists) {
    res.status(409).json({ message: "Event already exists" });
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

const getAllEvents = asyncHandler(async (req, res) => { // get all events from db
  console.log("getAllEvents arrived on server");
  const events = await Event.find({});
  res.json(events);
});

const updateEvent = asyncHandler(async (req, res) => {
  console.log("updateEvent arrived on server");
  const { typeOfCrime, crimeDescription, coordinate, date, email, upvotes, downvotes } = req.body;

  const event = await Event.findById(req.params.id);

  if (event) { // if event exists then update it
    event.typeOfCrime = typeOfCrime;
    event.crimeDescription = crimeDescription;
    event.coordinate = coordinate;
    event.date = date;
    event.email = email;

    console.log(upvotes, downvotes);
    console.log(event.upvotes, event.downvotes);

    // check if upvotes or downvotes have changed and if so, update them
    if(event.downvotes != downvotes || event.upvotes != upvotes) {
      const upVoted = event.usersThatUpvoted.includes(email);
      const downVoted = event.usersThatDownvoted.includes(email)

      console.log(upVoted, downVoted);

      if(!upVoted && !downVoted) {
        if(event.downvotes != downvotes) {
          event.usersThatDownvoted.push(email);
        }
        else {
          event.usersThatUpvoted.push(email);
        }

        event.upvotes = upvotes;
        event.downvotes = downvotes;

      }
      else if(upVoted && !downVoted && event.downvotes != downvotes) {
        event.upvotes -= 1;
        event.usersThatUpvoted.splice(event.usersThatUpvoted.indexOf(email), 1);

        event.downvotes = downvotes;
        event.usersThatDownvoted.push(email);

      }
      else if(!upVoted && downVoted && event.upvotes != upvotes) {
        event.downvotes -= 1;
        event.usersThatDownvoted.splice(event.usersThatDownvoted.indexOf(email), 1);

        event.upvotes = upvotes;
        event.usersThatUpvoted.push(email);

      }
    }

    await event.save();

    console.log(event);

    // send succes message with the updated event
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

const deleteEvent = asyncHandler(async (req, res) => {
  console.log("deleteEvent arrived on server");
  const event = await Event.findById(req.params.id);
  
  if (event) {
      await event.deleteOne();
      // send succes message with the deleted event id
      res.status(200).json({
        _id: req.params.id,
        message: "Event removed succesfully"
      });
  } else {
      res.status(404);
      throw new Error("Event not found");
  }
});

// export functions to be used in routes
module.exports = { createEvent, deleteEvent, getAllEvents, updateEvent };