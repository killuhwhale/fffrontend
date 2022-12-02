import { ImageSourcePropType } from "react-native";
import { Int32 } from "react-native/Libraries/Types/CodegenTypes";

export interface GymCardProps {
    id: string;
    title: string;
    desc: string;
    owner_id: string;
    date: string;
    mainImage: string;
    logoImage: string;

}
export interface GymCardListProps {
    data: Array<GymCardProps>;
}


export interface GymClassCardProps {
    id: string;
    title: string;
    private: boolean;
    desc: string;
    date: string;
    gym: string;
    mainImage: string;
    logoImage: string;

}
export interface GymClassCardListProps {
    data: Array<GymClassCardProps>;
}


export interface WorkoutCategoryProps {
    title: string;
}

export interface WorkoutNameProps {
    id: number;
    name: string;
    desc: string;
    categories: WorkoutCategoryProps[];
    primary: WorkoutCategoryProps;
    secondary: WorkoutCategoryProps;
    media_ids: string;
    date: string;
}



export interface WorkoutItemProps {
    id: number;
    name: WorkoutNameProps;
    ssid: number;

    sets: number;
    reps: string;
    duration: string;
    duration_unit: number;
    distance: string;
    distance_unit: number;
    weights: string;
    weight_unit: string;

    rest_duration: number;
    rest_duration_unit: number;
    percent_of: string;
    order: number;
    date: string;
    workout: number;
}

export interface WorkoutItemListProps {
    data: Array<WorkoutItemProps>;
}




export interface WorkoutCardProps {
    id: number;
    group?: WorkoutGroupProps;
    workout_items?: Array<WorkoutItemProps>;
    completed_workout_items?: Array<WorkoutItemProps>;
    title: string;
    desc: string;
    scheme_type: number;
    scheme_rounds: string;
    date: string;
    editable?: boolean;


}
export interface WorkoutCardListProps {
    data: Array<WorkoutCardProps>;
    editable?: boolean;
}


export interface WorkoutGroupCardProps {
    id: number;
    title: string;
    caption: string;
    owner_id?: string; // For workoutgroud
    owned_by_class?: boolean; // For workoutgroud
    user_id?: string;  // For completeworkoutgroud
    workout_group?: WorkoutGroupCardProps; // For completeworkoutgroud
    media_ids: string;
    date: string;
    for_date: string;
    finished?: boolean;
    editable?: boolean;
    userCanEdit?: boolean;
    completed?: boolean;
    archived: boolean;
    date_archived: string;
}

export interface WorkoutGroupCardListProps {
    data: Array<WorkoutGroupCardProps>;
    editable: boolean;
}

export interface WorkoutGroupProps {
    id: number;
    title: string;
    caption: string;
    owner_id: string;
    owned_by_class: boolean;
    media_ids: string;
    date: string;
    workouts?: Array<WorkoutCardProps>;
    completed_workouts?: Array<WorkoutCardProps>;
    for_date: string;
    finished?: boolean;
    user_can_edit?: boolean;
    user_is_owner?: boolean;
    user_is_coach?: boolean;
    completed?: boolean;
    archived: boolean;
    date_archived: string;

}




export interface FavoriteGymProps {
    id: number;
    user_id: string;
    gym: GymCardProps;
    date: string;
}

export interface FavoriteGymClassesProps {
    id: number;
    user_id: string;
    gym_class: GymCardProps;
    date: string;
}

export interface BodyMeasurementsProps {
    id: number;
    user_id: string;
    bodyweight: number;
    bodyweight_unit: string;
    bodyfat: number;
    armms: number;
    calves: number;
    neck: number;
    thighs: number;
    chest: number;
    waist: number;
    date: string;
}













