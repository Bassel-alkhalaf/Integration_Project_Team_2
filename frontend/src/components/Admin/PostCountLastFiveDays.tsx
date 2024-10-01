// import React, { useState, useEffect } from 'react';
// import { Typography } from '@mui/material';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
// import dayjs from 'dayjs';
// import { useFetchPostsByDate } from '../../hooks/apiHooks/Admin/useFetchPostsByDate';

// interface PostCount {
//   date: string;
//   count: number;
// }

// const PostCountLastFiveDays: React.FC = () => {
//   const [postCounts, setPostCounts] = useState<PostCount[]>([]); // State to store post counts for the last 5 days

//   useEffect(() => {
//     const fetchPostsForLastFiveDays = async () => {
//       const lastFiveDays: PostCount[] = [];

//       // Get posts for each of the last 5 days
//       for (let i = 0; i < 5; i++) {
//         const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD'); // Get date for each of the last 5 days
//         const { data: posts, isLoading, isError } = useFetchPostsByDate(date);

//         if (!isLoading && !isError && posts) {
//           lastFiveDays.push({
//             date: date,
//             count: posts.length, // Store the post count for that date
//           });
//         }
//       }

//       console.log('lastFiveDays',lastFiveDays);

//       setPostCounts(lastFiveDays.reverse()); // Reverse to show in chronological order
//     };

//     fetchPostsForLastFiveDays();
//   }, []);

  
//   return (
//     <div>
//       <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
//         Post Count for the Last 5 Days
//       </Typography>

//       <ResponsiveContainer width="100%" height={400}>
//         <BarChart
//           data={postCounts}
//           margin={{
//             top: 20,
//             right: 30,
//             left: 20,
//             bottom: 5,
//           }}
//         >
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="date">
//             {/* Add label to the X-axis */}
//             <LabelList position="bottom" />
//           </XAxis>
//           <YAxis />
//           <Tooltip />
//           <Legend />

//           <Bar dataKey="count" fill="#8884d8">
//             {/* Add label to the bars to display post counts */}
//             <LabelList dataKey="count" position="top" />
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default PostCountLastFiveDays;


import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface PostCount {
  date: string;
  count: number;
}

const PostCountLastFiveDays: React.FC = () => {
  const [postCounts, setPostCounts] = useState<PostCount[]>([]); // State to store post counts for the last 5 days
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  useEffect(() => {
    const fetchPostCountsForLastFiveDays = async () => {
      try {

        // test
        const staticData: PostCount[] = [
          { date: '2024-09-25', count: 10 },
          { date: '2024-09-26', count: 5 },
          { date: '2024-09-27', count: 15 },
          { date: '2024-09-28', count: 20 },
          { date: '2024-09-29', count: 12 }
        ];


        // const response = await fetch('/posts/counts/last-5-days'); // Call the new API endpoint
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }

        // const data: PostCount[] = await response.json();
        // setPostCounts(data); // Set the retrieved post counts

        // For debugging, set static data
        setPostCounts(staticData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred'); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchPostCountsForLastFiveDays();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>; // Loading message
  }

  if (error) {
    return <Typography variant="h6" color="error">{error}</Typography>; // Error message
  }

  return (
    <div>
      <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
      Statistical analysis of posts
      </Typography>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={postCounts}

          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date">
            {/* Add label to the X-axis */}
            <LabelList position="bottom" />
          </XAxis>
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar dataKey="count" fill="#8884d8">
            {/* Add label to the bars to display post counts */}
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PostCountLastFiveDays;
