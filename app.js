
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((error) => {
    console.error('MongoDB connection failed:', error.message);
  });

// Employee Schema
const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: ''
    },
    designation: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    salary: {
      type: Number,
      required: true,
      min: 0
    }
  },
  { timestamps: true }
);

const Employee = mongoose.model('Employee', employeeSchema);

// GET: Retrieve all employees
app.get('/api/employees', async (req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Retrieve one employee by ID
app.get('/api/employees/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Add a new employee
app.post('/api/employees', async (req, res) => {
  try {
    const { name, email, designation, location, salary } = req.body;

    if (
      !name?.trim() ||
      !designation?.trim() ||
      !location?.trim() ||
      salary === undefined ||
      salary === '' ||
      !Number.isFinite(Number(salary)) ||
      Number(salary) < 0
    ) {
      return res.status(400).json({
        message: 'Name, designation, location and a valid salary are required'
      });
    }

    const employee = await Employee.create({
      name,
      email: email || '',
      designation,
      location,
      salary: Number(salary)
    });

    res.status(201).json({
      message: 'Employee added successfully',
      employee
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update an existing employee
app.put('/api/employees/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const allowedFields = [
      'name',
      'email',
      'designation',
      'location',
      'salary'
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (updates.salary !== undefined) {
      if (
        updates.salary === '' ||
        !Number.isFinite(Number(updates.salary)) ||
        Number(updates.salary) < 0
      ) {
        return res.status(400).json({ message: 'Invalid salary' });
      }

      updates.salary = Number(updates.salary);
    }

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee updated successfully',
      employee
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete one employee
app.delete('/api/employees/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid employee ID' });
    }

    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({
      message: 'Employee deleted successfully',
      employee
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Employee backend running at http://localhost:${PORT}`);
});
