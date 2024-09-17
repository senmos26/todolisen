import express from 'express';
import Task from '../models/Task.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// Récupérer les tâches
router.get('/', protect, async (req, res) => {
  try {
    // Vérifie que req.user est défini, car protect doit l'ajouter
    const tasks = await Task.find({ user: req.user._id });

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve tasks' });
  }
});

// Ajouter une tâche
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, status, priority } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      user: req.user._id, // Associe la tâche à l'utilisateur connecté
    });

    await newTask.save();
    res.status(201).json({ message: 'Task added successfully', task: newTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Récupérer une tâche spécifique
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

// Mettre à jour une tâche
router.put('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, description, status, priority },
      { new: true }
    );

    if (!updatedTask) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task updated successfully', task: updatedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});
// Supprimer une tâche
router.delete('/:id', protect, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedTask) return res.status(404).json({ error: 'Task not found or unauthorized' });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;
