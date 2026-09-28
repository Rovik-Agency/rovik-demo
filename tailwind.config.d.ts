declare const _default: {
    darkMode: ["class", string];
    content: string[];
    theme: {
        container: {
            center: true;
            padding: {
                DEFAULT: string;
                sm: string;
                lg: string;
                xl: string;
            };
        };
        extend: {
            fontFamily: {
                display: [string, string, string, string, string];
                sans: [string, string, string, string];
            };
            colors: {
                ink: string;
                paper: string;
                electric: string;
                violet: string;
                cyan: string;
                graphite: string;
            };
            boxShadow: {
                glow: string;
                glass: string;
            };
            backgroundImage: {
                'premium-radial': string;
                'mesh-dark': string;
            };
            keyframes: {
                shimmer: {
                    '0%': {
                        transform: string;
                    };
                    '100%': {
                        transform: string;
                    };
                };
                pulseGlow: {
                    '0%,100%': {
                        opacity: string;
                    };
                    '50%': {
                        opacity: string;
                    };
                };
            };
            animation: {
                shimmer: string;
                pulseGlow: string;
            };
        };
    };
    plugins: never[];
};
export default _default;
