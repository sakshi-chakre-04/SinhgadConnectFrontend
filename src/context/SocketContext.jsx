import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/auth/authSlice';

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const user = useSelector(selectUser);

    useEffect(() => {
        // Only connect if user is logged in
        if (user?._id) {
            const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'https://sinhgadconnectbackend.onrender.com', {
                withCredentials: true,
                transports: ['websocket', 'polling']
            });

            newSocket.on('connect', () => {
                console.log('🔌 Socket connected:', newSocket.id);
                // Register user with their ID
                newSocket.emit('register', user._id);
            });

            newSocket.on('disconnect', () => {
                console.log('🔌 Socket disconnected');
            });

            setSocket(newSocket);

            // Cleanup on unmount or user change
            return () => {
                newSocket.close();
            };
        }
    }, [user?._id]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
