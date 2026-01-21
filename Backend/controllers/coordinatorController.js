import Coordinator from '../models/Coordinator.js';
import Team from '../models/Team.js';
import Technocrat from '../models/Technocrat.js';
import Event from '../models/Event.js';
import Result from '../models/Result.js';
import { generateToken } from '../config/jwt.js';

// Coordinator Registration (seeded by admin)
export const registerCoordinator = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let coordinator = await Coordinator.findOne({ email });
    if (coordinator) {
      return res.status(400).json({
        success: false,
        message: 'Coordinator already exists'
      });
    }

    coordinator = await Coordinator.create({
      name,
      email,
      password,
      role: 'coordinator'
    });

    const token = generateToken(coordinator);

    res.status(201).json({
      success: true,
      message: 'Coordinator registered successfully',
      token,
      coordinator: {
        id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        role: coordinator.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Coordinator Login
export const loginCoordinator = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const coordinator = await Coordinator.findOne({ email }).select('+password');

    if (!coordinator) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await coordinator.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(coordinator);

    res.status(200).json({
      success: true,
      message: 'Coordinator logged in successfully',
      token,
      coordinator: {
        id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        role: coordinator.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Teams
export const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('owner')
      .populate('iconPlayer')
      .sort({ totalScore: -1 });

    res.status(200).json({
      success: true,
      totalTeams: teams.length,
      teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Technocrats
export const getAllTechnocrats = async (req, res) => {
  try {
    const technocrats = await Technocrat.find()
      .populate('team')
      .populate('assignedEvents');

    res.status(200).json({
      success: true,
      totalTechnocrats: technocrats.length,
      technocrats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Participation Details
export const getParticipationDetails = async (req, res) => {
  try {
    const teams = await Team.countDocuments();
    const technocrats = await Technocrat.countDocuments();
    const events = await Event.countDocuments();
    const results = await Result.countDocuments();

    const participationByEvent = await Result.aggregate([
      {
        $group: {
          _id: '$event',
          participatingTeams: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'eventDetails'
        }
      }
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalTeams: teams,
        totalTechnocrats: technocrats,
        totalEvents: events,
        totalResults: results
      },
      participationByEvent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { eventName, eventType, points } = req.body;

    if (!points.first || !points.second || !points.third) {
      return res.status(400).json({
        success: false,
        message: 'Please provide points for all positions'
      });
    }

    const event = await Event.create({
      eventName,
      eventType,
      points: {
        first: points.first,
        second: points.second,
        third: points.third
      }
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Edit Event
export const editEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { eventName, eventType, points } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        eventName,
        eventType,
        points,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if results exist for this event
    const results = await Result.find({ event: eventId });
    if (results.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete event with existing results'
      });
    }

    const event = await Event.findByIdAndDelete(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add Event Result
export const addResult = async (req, res) => {
  try {
    const { eventId, teamId, position, technocratIds } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get points based on position
    const positionMap = {
      '1st': event.points.first,
      '2nd': event.points.second,
      '3rd': event.points.third
    };

    if (!positionMap[position]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid position'
      });
    }

    // Check if result already exists
    const existingResult = await Result.findOne({
      event: eventId,
      team: teamId,
      position
    });

    if (existingResult) {
      return res.status(400).json({
        success: false,
        message: 'Result for this team and position already exists'
      });
    }

    const result = await Result.create({
      event: eventId,
      team: teamId,
      position,
      pointsAwarded: positionMap[position],
      technocrats: technocratIds || []
    });

    // Update team's total score
    const team = await Team.findById(teamId);
    team.totalScore += positionMap[position];
    await team.save();

    // Update leaderboard ranks
    await updateLeaderboard();

    await result.populate(['event', 'team', 'technocrats']);

    res.status(201).json({
      success: true,
      message: 'Result added successfully',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Edit Result
export const editResult = async (req, res) => {
  try {
    const { resultId } = req.params;
    const { position, technocratIds } = req.body;

    const result = await Result.findById(resultId).populate('event');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // If position changed, update team score
    if (position && position !== result.position) {
      const positionMap = {
        '1st': result.event.points.first,
        '2nd': result.event.points.second,
        '3rd': result.event.points.third
      };

      const oldPoints = result.pointsAwarded;
      const newPoints = positionMap[position];
      const pointsDifference = newPoints - oldPoints;

      const team = await Team.findById(result.team);
      team.totalScore += pointsDifference;
      await team.save();

      result.position = position;
      result.pointsAwarded = newPoints;
    }

    if (technocratIds) {
      result.technocrats = technocratIds;
    }

    await result.save();
    await updateLeaderboard();
    await result.populate(['event', 'team', 'technocrats']);

    res.status(200).json({
      success: true,
      message: 'Result updated successfully',
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Result
export const deleteResult = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Deduct points from team
    const team = await Team.findById(result.team);
    team.totalScore -= result.pointsAwarded;
    if (team.totalScore < 0) team.totalScore = 0;
    await team.save();

    await Result.findByIdAndDelete(resultId);
    await updateLeaderboard();

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Final Leaderboard
export const getFinalLeaderboard = async (req, res) => {
  try {
    const { sortBy } = req.query;

    let teams;

    if (sortBy === 'name') {
      teams = await Team.find()
        .populate('owner')
        .populate('iconPlayer')
        .sort({ teamName: 1 });
    } else {
      teams = await Team.find()
        .populate('owner')
        .populate('iconPlayer')
        .sort({ totalScore: -1 });
    }

    // Add rank
    teams = teams.map((team, index) => ({
      ...team.toObject(),
      rank: index + 1
    }));

    res.status(200).json({
      success: true,
      leaderboard: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to update leaderboard ranks
const updateLeaderboard = async () => {
  const teams = await Team.find().sort({ totalScore: -1 });
  
  for (let i = 0; i < teams.length; i++) {
    teams[i].rank = i + 1;
    await teams[i].save();
  }
};

// Get Event Results Summary
export const getEventResultsSummary = async (req, res) => {
  try {
    const { eventId } = req.query;

    let query = {};
    if (eventId) {
      query.event = eventId;
    }

    const results = await Result.find(query)
      .populate('event')
      .populate('team')
      .populate('technocrats')
      .sort({ createdAt: -1 });

    const groupedByEvent = {};
    results.forEach(result => {
      const eventName = result.event.eventName;
      if (!groupedByEvent[eventName]) {
        groupedByEvent[eventName] = [];
      }
      groupedByEvent[eventName].push(result);
    });

    res.status(200).json({
      success: true,
      eventResultsSummary: groupedByEvent,
      totalResults: results.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalEvents: events.length,
      events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
