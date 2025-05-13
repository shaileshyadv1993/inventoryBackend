import { User } from "../models/users.models.js";
import { TODO } from "../models/todos.models.js";
import AsyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";

// create Todo
const createTodo = AsyncHandler(async (req, res) => {
  const user = req.user;
  console.log(user);
  const { task, status } = req.body;
  if (task == "" || status == "") {
    throw new ApiError(401, "Please enter all fields");
  }
  const todo = await TODO.create({
    userID: user.id,
    task: task,
    status: status,
  });
  const todoCheck = await TODO.findById(todo._id);
  if (!todoCheck) {
    throw new ApiError(500, "Error occured while creating todo");
  }
  res.status(200).json(todo);
});

// get all todos by user
const getTodos = AsyncHandler(async (req, res) => {
  const { id } = req.user;
  const allTodos = await TODO.find({ userID: id });
  res.status(200).json(allTodos);
});

// find TODO by ID
const findTODO = AsyncHandler(async (req, res) => {
  const _id = req.params.id;
  const findTodo = await TODO.findById(_id);
  console.log(findTodo);
  if (!findTodo) {
    throw new ApiError(404, `TODO with ID ${_id} not found`);
  }
  res.status(200).json(findTodo);
});

//update by ID
const updateTODO = AsyncHandler(async (req, res) => {
  const _id = req.params.id;
  const userID = req.user.id;
  const { status } = req.body;
  const todoCheck = await TODO.findById(_id);
  if (!todoCheck) {
    return res.status(400).json("TODO does not exit");
  }

  if (userID !== todoCheck.userID.toString()) {
    return res
      .status(403)
      .json("You are not authorized to update this TODO item");
  }
  const updatedTODO = await TODO.findByIdAndUpdate(
    _id,
    {
      status: status,
    },
    { new: true, runValidators: true }
  );
  res.status(200).json({
    message: "Update successfull",
    updateTODO: updatedTODO,
  });
});

// delete TODBYID
const deleteTodo = AsyncHandler(async (req, res) => {
  const _id = req.params.id;
  const userID = req.user.id;

  const todo = await TODO.findById(_id);
  if (!todo) {
    return res.status(400).json(`TODO item with ID "${_id}" does not exist.`);
  }
  if (userID !== todo.userID.toString()) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this todo" });
  }

  await TODO.findByIdAndDelete(_id);
  res.status(200).json("TODo item deleted successfully");
});

export { createTodo, getTodos, findTODO, updateTODO, deleteTodo };
