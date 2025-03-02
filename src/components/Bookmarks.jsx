import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Paper, Divider } from '@mui/material';
import * as api from '../util/api.js';

const Bookmarks = (props) => {
  const [bookmarks, setBookmarks] = useState([]);

  const loadBookmarks = async () => {
    let result = await api.bookmarks.getAll();
    setBookmarks(result);
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  return (
    <>
      <Paper elevation={4} sx={{ marginTop: '0.5em', padding: '1em' }}>
        <Typography variant="h5" sx={{ textAlign: 'center' }}>
          Bookmarks
        </Typography>
      </Paper>

      {/* Conditionally render bookmarks */}
      {bookmarks.length > 0 ? (
        bookmarks.map((bookmark) => (
          <Card key={bookmark.country_code} elevation={10} sx={{ margin: '1em 0', padding: '1em' }}>
            <CardContent>
              <Typography variant="h6">
                ({bookmark.country_code}) {bookmark.country_name}
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '0.5em' }}>
                {bookmark.sub_region}
              </Typography>
              <Divider sx={{ margin: '1em 0' }} />
              <Typography variant="body2">{bookmark.advisory ? bookmark.advisory : 'No Advisory Provided'}</Typography>
              <Divider sx={{ margin: '1em 0' }} />
              <Typography variant="caption" color="textSecondary" sx={{ fontSize: '1rem' }}>
                {bookmark.date}
              </Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', marginTop: '1em' }}>
          No bookmarks available.
        </Typography>
      )}
    </>
  );
};

export default Bookmarks;
