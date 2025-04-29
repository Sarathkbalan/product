const adminCheck = async (req, res, next) => {
    if (req.user.UserType !== 'Admin') {
      return res.status(403).send("Permission denied");
    }
    next();
  };
  
      export default adminCheck;