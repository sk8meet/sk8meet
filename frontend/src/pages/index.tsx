import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Box, Container, Typography, Button } from '@mui/material';

const Home: NextPage = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchMessage = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/hello');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      setMessage('Error connecting to API');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sk8Meet - Hello World</title>
        <meta name="description" content="Sk8Meet Hello World Application" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Sk8Meet
          </Typography>
          <Typography variant="h5" gutterBottom>
            Hello World!
          </Typography>
          
          <Button
            variant="contained"
            onClick={fetchMessage}
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? 'Loading...' : 'Fetch from API'}
          </Button>
          
          {message && (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}
        </Box>
      </Container>
    </>
  );
};

export default Home;