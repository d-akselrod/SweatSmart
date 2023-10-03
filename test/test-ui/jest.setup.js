jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => {
    return {
        __fbBatchedBridgeConfig: {},
        // Add other native modules you want to mock...
    };
});

jest.mock('react-native/Libraries/Utilities/NativeDeviceInfo', () => ({
    getConstants: () => ({
        Dimensions: {
            window: {
                fontScale: 2,
                height: 1334,
                scale: 2,
                width: 750,
            },
            screen: {
                fontScale: 2,
                height: 1334,
                scale: 2,
                width: 750,
            },
        },
        isEmulator: false,
        isTablet: false,
        // Add other constants as needed
    }),
}));

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsIOS', () => {
    return {
        getConstants: () => ({
            forceTouchAvailable: false,
            interfaceIdiom: 'phone',
            osVersion: '14.0',
            systemName: 'iOS',
            // Add other constants you need
        }),
    };
});

jest.mock('react-native/Libraries/Utilities/NativePlatformConstantsAndroid', () => {
    return {
        getConstants: () => ({
            Version: 29,
            Release: '10',
            Serial: 'unknown',
            Fingerprint: 'unknown',
            Model: 'Android SDK built for x86',
            // Add other constants you need
        }),
    };
});

jest.mock('react-native/Libraries/ReactNative/NativeUIManager', () => {
    return {
        getConstants: () => ({
            Dimensions: {
                windowPhysicalPixels: {
                    width: 750,
                    height: 1334,
                    scale: 2,
                    fontScale: 2,
                },
                screenPhysicalPixels: {
                    width: 750,
                    height: 1334,
                    scale: 2,
                    fontScale: 2,
                },
            },
            // Add other constants you need
        }),
    };
});

jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    rn.NativeEventEmitter = jest.fn();
    return rn;
});

jest.mock('react-native', () => {
    const rn = jest.requireActual('react-native');
    rn.NativeEventEmitter = jest.fn(() => ({
        addListener: jest.fn(),
        removeListeners: jest.fn(),
    }));
    return rn;
});
