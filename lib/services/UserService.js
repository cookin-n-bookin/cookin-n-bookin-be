const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ username, password }) {
    const passwordHash = bcrypt.hashSync(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    return User.insert({
      username,
      passwordHash,
    });
  }

  static async signIn({ username, password }) {
    try {
      const user = await User.getByUserName(username);

      if (!user) throw new Error('Invalid username');
      const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
      if (!passwordMatch) throw new Error('Invalid password');
      return user;

    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
};
