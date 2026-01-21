import Owner from '../models/Owner.js';
import Team from '../models/Team.js';
import Technocrat from '../models/Technocrat.js';
import Result from '../models/Result.js';
import Event from '../models/Event.js';
import { generateToken } from '../config/jwt.js';

// Owner Registration
export const registerOwner = async (req, res) => {
  try {
    const { name, email, password, teamName, teamCode, ownerContact } = req.body;

    // Check if owner exists
    let owner = await Owner.findOne({ email });
    if (owner) {
      return res.status(400).json({
        success: false,
        message: 'Owner already exists'
      });
    }

    // Create team
    const team = await Team.create({
      teamName,
      teamCode: teamCode.toUpperCase(),
      ownerDetails: {
        name,
        email,
        contact: ownerContact
      }
    });

    // Create owner
    owner = await Owner.create({
      name,
      email,
      password,
      team: team._id,
      role: 'owner'
    });

    // Update team with owner reference
    team.owner = owner._id;
    await team.save();

    const token = generateToken(owner);

    res.status(201).json({
      success: true,
      message: 'Owner registered successfully',
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role
      },
      team: {
        id: team._id,
        teamName: team.teamName,
        teamCode: team.teamCode
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Owner Login
export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const owner = await Owner.findOne({ email }).select('+password').populate('team');

    if (!owner) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isPasswordMatch = await owner.comparePassword(password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(owner);

    res.status(200).json({
      success: true,
      message: 'Owner logged in successfully',
      token,
      owner: {
        id: owner._id,
        name: owner.name,
        email: owner.email,
        role: owner.role
      },
      team: owner.team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Owner's Team Profile
export const getTeamProfile = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id).populate({
      path: 'team',
      populate: {
        path: 'iconPlayer'
      }
    });

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: 'Owner not found'
      });
    }

    const teamTechnocrats = await Technocrat.find({ team: owner.team._id }).populate('assignedEvents');

    res.status(200).json({
      success: true,
      team: owner.team,
      technoCratsCount: teamTechnocrats.length,
      technocrats: teamTechnocrats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Edit Team Details
export const editTeamDetails = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { teamName, ownerContact } = req.body;

    const team = await Team.findByIdAndUpdate(
      owner.team,
      {
        teamName,
        'ownerDetails.contact': ownerContact,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Team details updated successfully',
      team
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Add Technocrat
export const addTechnocrat = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { name, enrollmentNumber, semester, mobileNumber } = req.body;

    // Check enrollment number uniqueness
    const existingTechnocrat = await Technocrat.findOne({
      enrollmentNumber: enrollmentNumber.toUpperCase()
    });

    if (existingTechnocrat) {
      return res.status(400).json({
        success: false,
        message: 'Enrollment number already exists'
      });
    }

    const technocrat = await Technocrat.create({
      name,
      enrollmentNumber: enrollmentNumber.toUpperCase(),
      semester,
      mobileNumber,
      team: owner.team
    });

    res.status(201).json({
      success: true,
      message: 'Technocrat added successfully',
      technocrat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Edit Technocrat
export const editTechnocrat = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { technocratId } = req.params;
    const { name, enrollmentNumber, semester, mobileNumber } = req.body;

    // Verify technocrat belongs to this team
    const technocrat = await Technocrat.findById(technocratId);
    
    if (!technocrat || technocrat.team.toString() !== owner.team.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this technocrat'
      });
    }

    // Check if new enrollment number is unique (if changing)
    if (enrollmentNumber && enrollmentNumber !== technocrat.enrollmentNumber) {
      const existing = await Technocrat.findOne({
        enrollmentNumber: enrollmentNumber.toUpperCase()
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'Enrollment number already exists'
        });
      }
    }

    const updatedTechnocrat = await Technocrat.findByIdAndUpdate(
      technocratId,
      {
        name,
        enrollmentNumber: enrollmentNumber?.toUpperCase(),
        semester,
        mobileNumber,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Technocrat updated successfully',
      technocrat: updatedTechnocrat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete Technocrat
export const deleteTechnocrat = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { technocratId } = req.params;

    const technocrat = await Technocrat.findById(technocratId);
    
    if (!technocrat || technocrat.team.toString() !== owner.team.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this technocrat'
      });
    }

    await Technocrat.findByIdAndDelete(technocratId);

    res.status(200).json({
      success: true,
      message: 'Technocrat deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Assign Events to Technocrat
export const assignEvents = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { technocratId, eventIds } = req.body;

    if (!Array.isArray(eventIds) || eventIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one event'
      });
    }

    if (eventIds.length > 3) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 3 events allowed per technocrat'
      });
    }

    const technocrat = await Technocrat.findById(technocratId);
    
    if (!technocrat || technocrat.team.toString() !== owner.team.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Verify all events exist
    const events = await Event.find({ _id: { $in: eventIds } });
    if (events.length !== eventIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Some events not found'
      });
    }

    technocrat.assignedEvents = eventIds;
    await technocrat.save();

    await technocrat.populate('assignedEvents');

    res.status(200).json({
      success: true,
      message: 'Events assigned successfully',
      technocrat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove Event Assignment
export const removeEventAssignment = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { technocratId, eventId } = req.params;

    const technocrat = await Technocrat.findById(technocratId);
    
    if (!technocrat || technocrat.team.toString() !== owner.team.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    technocrat.assignedEvents = technocrat.assignedEvents.filter(
      id => id.toString() !== eventId
    );
    await technocrat.save();

    await technocrat.populate('assignedEvents');

    res.status(200).json({
      success: true,
      message: 'Event removed successfully',
      technocrat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Set Icon Player
export const setIconPlayer = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);
    const { technocratId } = req.body;

    const team = await Team.findById(owner.team);

    // If there's an existing icon player, remove the flag
    if (team.iconPlayer) {
      await Technocrat.findByIdAndUpdate(team.iconPlayer, { isIconPlayer: false });
    }

    // Set new icon player
    const technocrat = await Technocrat.findByIdAndUpdate(
      technocratId,
      { isIconPlayer: true },
      { new: true }
    );

    if (!technocrat || technocrat.team.toString() !== owner.team.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    team.iconPlayer = technocratId;
    await team.save();

    res.status(200).json({
      success: true,
      message: 'Icon player set successfully',
      iconPlayer: technocrat
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Team Scores
export const getTeamScores = async (req, res) => {
  try {
    const owner = await Owner.findById(req.user.id);

    const results = await Result.find({ team: owner.team })
      .populate('event')
      .populate('team');

    const eventScores = {};
    let totalScore = 0;

    results.forEach(result => {
      if (!eventScores[result.event.eventName]) {
        eventScores[result.event.eventName] = 0;
      }
      eventScores[result.event.eventName] += result.pointsAwarded;
      totalScore += result.pointsAwarded;
    });

    res.status(200).json({
      success: true,
      eventScores,
      totalScore
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Leaderboard (read-only)
export const getLeaderboard = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate('iconPlayer')
      .populate('owner')
      .sort({ totalScore: -1 });

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
