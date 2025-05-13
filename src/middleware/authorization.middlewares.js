const userAuthorization = (req, res, next) => {
  const user = req.user;

  if (user.role !== "admin") {
    res.status(403).json({ message: "Admin only access this route" });
    throw new ApiError(403, "You are not authroized");
  }
  next();
};

export default userAuthorization;
