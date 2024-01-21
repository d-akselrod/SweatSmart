export interface IUser {
  uId: string;
  firstName?: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
}

export interface IWorkoutCategory {
  image: any;
  imgWidth: number;
  imgHeight: number;
  categoryName: string;
  numOfExercises: number;
}
