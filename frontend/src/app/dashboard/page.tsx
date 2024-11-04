'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { setUser } from '../redux/slices/userSlice';
import { setCode } from '../redux/slices/codeSlice';
import { Editor } from '@monaco-editor/react';  // Monaco Editor
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';


const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const { role, token } = useSelector((state: RootState) => state.user);
  const { code } = useSelector((state: RootState) => state.code);

  const socket = io('http://localhost:5000');

  useEffect(() => {
    const queryToken = searchParams.get('token');

    if (queryToken) {
      localStorage.setItem('authToken', queryToken);
      const decodedToken: any = jwtDecode(queryToken);
      dispatch(setUser({ userId: decodedToken.id, role: decodedToken.role, token: queryToken }));
    } else {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        router.push('/');  // Redirect to login if no token is found
      } else {
        const decodedToken: any = jwtDecode(storedToken);
        dispatch(setUser({ userId: decodedToken.id, role: decodedToken.role, token: storedToken }));
      }
    }

    socket.on('receive-code-change', (updatedCode) => {
      dispatch(setCode(updatedCode));  // Dispatch code update to Redux store
    });

    return () => {
      socket.disconnect();
    };
  }, [searchParams, router, dispatch]);

  // Handle code changes and emit them via WebSocket
  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode) {
      dispatch(setCode(newCode));  // Update code in Redux state
      socket.emit('code-change', newCode);  // Emit updated code to server
    }
  };

  return (
    <div>
      <h1>Welcome to your Dashboard</h1>

      {role === 'contributor' && (
        <div>
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={handleCodeChange}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
