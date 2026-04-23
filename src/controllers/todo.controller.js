import { Todo } from "../models/todo.model.js";

/**
 * TODO: Create a new todo
 * - Extract data from req.body
 * - Create todo in database
 * - Return 201 with created todo
 */
export async function createTodo(req, res, next) {
  try {
    const todo = await Todo.create(req.body);
    return res.status(201).json(todo);
    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: List todos with pagination and filters
 * - Support query params: page, limit, completed, priority, search
 * - Default: page=1, limit=10
 * - Return: { data: [...], meta: { total, page, limit, pages } }
 */
export async function listTodos(req, res, next) {
  try {
    // Your code here
    const { page = 1, limit = 10, completed, priority, search } = req.query;
    const filters = {};
    if (completed !== undefined) {
      filters.completed = completed === 'true';
    }
    if (priority) {
      filters.priority = priority;
    }
    if (search) {
      filters.title = { $regex: search, $options: "i" };
    }
    const totalMatchingTodos = await Todo.countDocuments(filters);
    const matchingTodos = await Todo.find(filters).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
    const pages = Math.ceil(totalMatchingTodos / limit);
    return res.json({
      data: matchingTodos,
      meta: {
        total: totalMatchingTodos,
        page: parseInt(page),
        limit: parseInt(limit),
        pages,
      },
    });

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Get single todo by ID
 * - Return 404 if not found
 */
export async function getTodo(req, res, next) {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        error: { message: "Todo not found" },
      });
    }

    return res.json(todo);
    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Update todo by ID
 * - Use findByIdAndUpdate with { new: true, runValidators: true }
 * - Return 404 if not found
 */
export async function updateTodo(req, res, next) {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({
        error: { message: "Todo not found" },
      });
    }

    return res.json(updatedTodo);

    // Your code here
  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Toggle completed status
 * - Find todo, flip completed, save
 * - Return 404 if not found
 */
export async function toggleTodo(req, res, next) {
  try {
    // Your code here
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: { message: "Todo not found" },
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    return res.json(todo);

  } catch (error) {
    next(error);
  }
}

/**
 * TODO: Delete todo by ID
 * - Return 204 (no content) on success
 * - Return 404 if not found
 */
export async function deleteTodo(req, res, next) {
  try {
    // Your code here
    const deleted = await Todo.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        error: { message: "Todo not found" },
      });
    }

    return res.status(204).end();

  } catch (error) {
    next(error);
  }
}
