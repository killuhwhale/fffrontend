import { WorkoutGroupProps, FavoriteGymProps, FavoriteGymClassesProps, BodyMeasurementsProps } from "../app_components/Cards/types";



export interface UserProps {
    username: string;
    email: string;
    id: number;
}

export interface ProfileProps {
    user: UserProps;
    workout_groups: Array<WorkoutGroupProps>;
    favorite_gyms: Array<FavoriteGymProps>;
    favorite_gym_classes: Array<FavoriteGymClassesProps>;
    measurements: BodyMeasurementsProps;

};