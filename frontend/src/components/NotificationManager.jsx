import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function NotificationManager() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const socketHost = import.meta.env.PROD 
      ? window.location.origin 
      : (import.meta.env.VITE_API_URL || 'http://localhost:5001');
    console.log('Connecting to socket at:', socketHost);
    
    const socket = io(socketHost, {
      transports: ['websocket'],
      upgrade: false
    });

    socket.on('connect', () => console.log('Successfully connected to notification server!'));
    socket.on('connect_error', (err) => console.error('Notification server connection error:', err));

    const showNotification = (title, options) => {
      console.log('Attempting to show notification:', title, options);
      if (Notification.permission === 'granted') {
        new Notification(title, {
          icon: '/logo.png',
          ...options
        });
      } else {
        console.warn('Notification permission not granted. Current state:', Notification.permission);
      }
      
      window.dispatchEvent(new CustomEvent('app_notification', { 
        detail: { title, ...options, timestamp: new Date() } 
      }));
    };

    socket.on('file_uploaded', (file) => {
      if (file.owner === user._id) {
        showNotification('File Uploaded Successfully', {
          body: `${file.name} is now available in your cloud.`
        });
      }
    });

    socket.on('file_trashed', (file) => {
      if (file.owner === user._id) {
        showNotification('Moved to Trash', {
          body: `"${file.name}" has been moved to your trash.`
        });
      }
    });

    socket.on('file_starred', (file) => {
      if (file.owner === user._id) {
        showNotification(file.isStarred ? 'Added to Starred' : 'Removed from Starred', {
          body: `"${file.name}" was ${file.isStarred ? 'added to' : 'removed from'} your favorites.`
        });
      }
    });

    socket.on('file_renamed', (file) => {
      if (file.owner === user._id) {
        showNotification('File Renamed', {
          body: `File is now named "${file.name}".`
        });
      }
    });

    socket.on('file_shared', (file) => {
      if (file.owner === user._id) {
        showNotification('Access Updated', {
          body: `Sharing settings for "${file.name}" have been updated successfully.`
        });
      }
    });

    return () => socket.disconnect();
  }, [user]);

  return null;
}
