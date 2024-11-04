'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Editor } from '@monaco-editor/react';  // Import Monaco Editor
import { io } from 'socket.io-client';  // Import Socket.IO client

import { Diff2Html } from 'diff2html';  // Import Diff2Html for rendering diffs
import * as Diff from 'diff';  // Import Diff for creating diffs
import 'diff2html/bundles/css/diff2html.min.css';  // Import the diff2html styles


const Dashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');  // State to manage code input
  const [codeReviews, setCodeReviews] = useState<any[]>([]);  // Store code reviews
  const [comment, setComment] = useState('');


  // Initialize Socket.IO inside the component to handle cleanup correctly
  const socket = io('http://localhost:5000');


  useEffect(() => {
    const queryToken = searchParams.get('token');

    if (queryToken) {
      localStorage.setItem('authToken', queryToken);
      setToken(queryToken);
      const decodedToken: any = jwtDecode(queryToken);
      setRole(decodedToken.role);
    } else {
      const storedToken = localStorage.getItem('authToken');
      if (!storedToken) {
        router.push('/');  // Redirect to login if no token is found
      } else {
        setToken(storedToken);
        const decodedToken: any = jwtDecode(storedToken);
        setRole(decodedToken.role);
      }
    }

    // Listen for code changes from the server
    socket.on('receive-code-change', (updatedCode) => {
      setCode(updatedCode);  // Update the code state with the new code
    });

    return () => {
      socket.off('receive-code-change');  // Clean up the listener
    };
  }, [searchParams, router]);


  // Handle code changes
  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode) {
      setCode(newCode);  // Update the local state
      socket.emit('code-change', newCode);  // Send code change to the server
    }
  };

  // Handle code submission and save version
  const handleSubmit = async () => {
    const response = await fetch('http://localhost:5000/code/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Code submitted:', data);
    } else {
      console.error('Failed to submit code');
    }
  };



  // Handle feedback submission
  const handleFeedbackSubmit = async (reviewId: string) => {
    const response = await fetch(`http://localhost:5000/code/reviews/${reviewId}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ comment }),
    });

    if (response.ok) {
      const data = await response.json();
      setComment('');  // Clear comment input
      console.log('Feedback submitted:', data);
    } else {
      console.error('Failed to submit feedback');
    }
  };


  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>

      {role === 'admin' && <p>Admin Panel</p>}
      {role === 'reviewer' && (
        <div className="reviewer-panel">
          <h2 className="text-2xl mb-4">Code Reviews</h2>

          {codeReviews.length > 0 ? (
            <ul>
              {codeReviews.map((review) => (
                <li key={review.id} className="mb-4">
                  <h3 className="font-bold">Code submitted by {review.user.email}</h3>
                  <pre>{review.code}</pre>

                  {review.feedback.length > 0 && (
                    <ul className="mt-2">
                      {review.feedback.map((feedback) => (
                        <li key={feedback.id}>
                          <p className="text-sm text-gray-500">
                            Feedback by {feedback.user.email}: {feedback.comment}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}

                  <textarea
                    className="mt-2 w-full p-2 border rounded"
                    placeholder="Leave feedback here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <button
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => handleFeedbackSubmit(review.id)}
                  >
                    Submit Feedback
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No code reviews available</p>
          )}
        </div>
      )}

      {role === 'contributor' && (
        <div className="contributor-panel">
          <h2 className="text-2xl mb-4">Submit Code for Review</h2>
          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={handleCodeChange}
          />
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleSubmit('REVIEW_ID')}
          >
            Submit Code
          </button>
        </div>
      )}

   
    </div>
  );
};

export default Dashboard;