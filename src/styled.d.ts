// styled.d.ts
import 'styled-components';
interface IPalette {
    main: string
    contrastText: string
}

declare module 'styled-components' {
    export interface DefaultTheme {
        borderRadius: string
        palette: {
            primary: IPalette
            secondary: IPalette
            tertiary: IPalette
            backgroundColor: string
            accent: string
            text: string
            gray: string
            lightGray: string
            darkGray: string
            transparent: string
        }
    }
}