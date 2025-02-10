interface UserTypes {
  _id: string;
  name?: string;
  email?: string;
  role: string;
  password?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  correctPassword?: (
    candidatePassword: string,
    userPassword: string
  ) => boolean;
}
export default UserTypes;
