import { User } from "../models/User";

export class UserRepository {
  /**
   * Tìm user theo ID
   */
  async findById(id: number) {
    try {
      return await User.findByPk(id, {
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error}`);
    }
  }

  /**
   * Tìm user theo email
   */
  async findByEmail(email: string) {
    try {
      return await User.findOne({
        where: { email },
      });
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`);
    }
  }

  /**
   * Lấy tất cả users
   */
  async findAll() {
    try {
      return await User.findAll({
        attributes: { exclude: ["password"] },
      });
    } catch (error) {
      throw new Error(`Error fetching all users: ${error}`);
    }
  }

  /**
   * Tạo user mới
   */
  async create(data: { email: string; password: string; fullName: string }) {
    try {
      return await User.create(data);
    } catch (error) {
      throw new Error(`Error creating user: ${error}`);
    }
  }

  /**
   * Cập nhật user
   */
  async update(
    id: number,
    data: Partial<{ email: string; password: string; fullName: string }>
  ) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      return await user.update(data);
    } catch (error) {
      throw new Error(`Error updating user: ${error}`);
    }
  }

  /**
   * Xóa user
   */
  async delete(id: number) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      return await user.destroy();
    } catch (error) {
      throw new Error(`Error deleting user: ${error}`);
    }
  }

  /**
   * Kiểm tra email đã tồn tại chưa
   */
  async emailExists(email: string): Promise<boolean> {
    try {
      const user = await User.findOne({
        where: { email },
      });
      return !!user;
    } catch (error) {
      throw new Error(`Error checking email existence: ${error}`);
    }
  }

  /**
   * Cập nhật password
   */
  async updatePassword(id: number, hashedPassword: string) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("User not found");
      }
      user.password = hashedPassword;
      return await user.save();
    } catch (error) {
      throw new Error(`Error updating password: ${error}`);
    }
  }

  /**
   * Lấy user theo ID (kèm password)
   */
  async findByIdWithPassword(id: number) {
    try {
      return await User.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding user: ${error}`);
    }
  }

  /**
   * Lấy user theo email (kèm password)
   */
  async findByEmailWithPassword(email: string) {
    try {
      return await User.findOne({
        where: { email },
      });
    } catch (error) {
      throw new Error(`Error finding user: ${error}`);
    }
  }
}

export default new UserRepository();
