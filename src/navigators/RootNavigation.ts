import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef()
// USed to navigate outisde of Provider (I think)
export function navigate(name: string, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name as never, params as never);
    }
}