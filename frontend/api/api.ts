import { Platform } from 'react-native';

// NOTE: For physical device testing, replace this with your computer's actual IPv4 address
// (e.g., '192.168.1.5'). '10.0.2.2' is the Android emulator's alias for the host's localhost.
const LOCAL_IP = '192.168.1.14';
const PORT = '5001';

export const BASE_URL = Platform.OS === 'android' && __DEV__
    ? `http://${LOCAL_IP}:${PORT}/api`
    : `http://localhost:${PORT}/api`;
