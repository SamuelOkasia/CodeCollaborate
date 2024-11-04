'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { Editor } from '@monaco-editor/react';  // Import Monaco Editor
import { io } from 'socket.io-client';  // Import Socket.IO client

import { Diff2Html } from 'diff2html';  // Import Diff2Html for rendering diffs
import * as Diff from 'diff';  // Import Diff for creating diffs
import 'diff2html/bundles/css/diff2html.min.css';  // Import the diff2html styles

const socket = io('http://localhost:5000');  // Connect to backend

const Dashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');  // State to manage code input
  const [codeReviews, setCodeReviews] = useState<any[]>([]);  // Store code reviews
  const [comment, setComment] = useState('');
  const [versions, setVersions] = useState<any[]>([]);  // Store code versions
  const [selectedVersion1, setSelectedVersion1] = useState<string | null>(null);  // Store first selected version
  const [selectedVersion2, setSelectedVersion2] = useState<string | null>(null);  // Store second selected version
  const [diffHtml, setDiffHtml] = useState<string>('');  // Store HTML for the diff view


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
        router.push('/');  
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

  const handleCodeChange = (newCode: string | undefined) => {
    if (newCode) {
      setCode(newCode);  // Update the local state
      socket.emit('code-change', newCode);  // Send code change to the server
    }
  };

  // const handleSubmit = async () => {
  //   const response = await fetch('http://localhost:5000/code/submit', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
  //     },
  //     body: JSON.stringify({ code }),
  //   });
  
  //   if (response.ok) {
  //     const data = await response.json();
  //     console.log('Code submitted:', data);
  //   } else {
  //     console.error('Failed to submit code');
  //   }
  // };

  // Handle code submission and save version
  const handleSubmit = async (reviewId: string) => {
    const response = await fetch(`http://localhost:5000/code/reviews/${reviewId}/save-version`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ code }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('New version saved:', data);
    } else {
      console.error('Failed to save version');
    }
  };


  useEffect(() => {
    const fetchCodeReviews = async () => {
      const response = await fetch('http://localhost:5000/code/reviews', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCodeReviews(data);  // Store code reviews in state
      } else {
        console.error('Failed to fetch code reviews');
      }
    };

    if (role === 'reviewer') {
      fetchCodeReviews();
    }
  }, [role]);

  // Handle feedback submission
  const handleFeedbackSubmit = async (reviewId: string) => {
    try {
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
        console.log('Feedback submitted:', data);
        setComment('');  // Clear the comment input after submission
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

//   const fetchVersions = async (reviewId: string) => {
//     const response = await fetch(`http://localhost:5000/code/reviews/${reviewId}/versions`, {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
//       },
//     });
  
//     if (response.ok) {
//       const data = await response.json();
//       setVersions(data);  // Store versions in state
//     } else {
//       console.error('Failed to fetch versions');
//     }
//   };
  
  // Fetch version history for a code review (you may want to run this after selecting a code review)
  const fetchVersions = async (reviewId: string) => {
    const response = await fetch(`http://localhost:5000/code/reviews/${reviewId}/versions`, {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    });

    if (response.ok) {
    const data = await response.json();
    setVersions(data);  // Store the versions in state
    } else {
    console.error('Failed to fetch versions');
    }
  };

// Compare two selected versions of the code
  const generateDiff = (version1: string, version2: string) => {
    const diffString = Diff.createTwoFilesPatch('Version 1', 'Version 2', version1, version2);
    const diffHtml = Diff2Html.html(diffString, { drawFileList: false, matching: 'lines' });
    setDiffHtml(diffHtml);  // Store the diff HTML for rendering
  };

  const saveVersion = async (reviewId: string, code: string) => {
    const response = await fetch(`http://localhost:5000/code/reviews/${reviewId}/save-version`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
      body: JSON.stringify({ code }),
    });
  
    if (response.ok) {
      const data = await response.json();
      console.log('New version saved:', data);
    } else {
      console.error('Failed to save version');
    }
  };
  
//   const handleCodeChange = (newCode: string | undefined) => {
//     if (newCode) {
//       setCode(newCode);  // Update the local state with the new code
  
//       // Call the saveVersion function to save a new version of the code
//       saveVersion('REVIEW_ID_HERE', newCode);  // Replace with actual review ID
//     }
//   };
  

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
     
                 {/* Display feedback */}
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
     
                 {/* Feedback form */}
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
            onChange={handleCodeChange}  // Handle code changes
          />

            <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
                saveVersion('REVIEW_ID_HERE', code);  // Save version when submitting code
                console.log('Code submitted:', code);
            }}
            >
            Submit Code
            </button>

        </div>
      )}

      {role === 'reviewer' && (
        <div className="reviewer-panel">
          <h2 className="text-2xl mb-4">Review Code</h2>

          <Editor
            height="400px"
            defaultLanguage="javascript"
            value={code}
            theme="vs-dark"
            onChange={handleCodeChange}  // Handle code changes
          />
        </div>
      )}

        <div className="version-history">
        <h2 className="text-2xl mb-4">Code Version History</h2>

{/* Display the list of versions */}
<div className="version-selection">
  <h3>Select Versions to Compare</h3>

  {/* Version 1 selection */}
  <select onChange={(e) => setSelectedVersion1(e.target.value)} value={selectedVersion1 || ''}>
    <option value="" disabled>Select version 1</option>
    {versions.map((version) => (
      <option key={version.id} value={version.code}>
        Version {version.version} - {new Date(version.createdAt).toLocaleString()}
      </option>
    ))}
  </select>

  {/* Version 2 selection */}
  <select onChange={(e) => setSelectedVersion2(e.target.value)} value={selectedVersion2 || ''}>
    <option value="" disabled>Select version 2</option>
    {versions.map((version) => (
      <option key={version.id} value={version.code}>
        Version {version.version} - {new Date(version.createdAt).toLocaleString()}
      </option>
    ))}
  </select>

  {/* Button to generate the diff */}
  <button
    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
    onClick={() => {
      if (selectedVersion1 && selectedVersion2) {
        generateDiff(selectedVersion1, selectedVersion2);
      }
    }}
  >
    Compare Versions
  </button>
</div>

{/* Render the diff HTML */}
<div className="code-diff mt-8">
  <h3>Code Differences</h3>
  {diffHtml && <div dangerouslySetInnerHTML={{ __html: diffHtml }} />}
</div>
        </div>
    </div>
  );
};

export default Dashboard;
