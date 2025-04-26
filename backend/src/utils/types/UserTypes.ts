interface UserTypes {
  _id: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  password?: string;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  active?: boolean;
  user?: any;
  token?: string;
  correctPassword?: (
    candidatePassword: string,
    userPassword: string
  ) => boolean;
}
export default UserTypes;
