import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file first!');

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      await axios.post('http://localhost:5000/api/posts', formData, {
        headers: {
          'x-auth-token': token,
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '50px' }}>
      <div className="stylish-form" style={{ width: '100%', maxWidth: '500px', padding: 0, overflow: 'hidden' }}>
        
        <div style={{ borderBottom: '1px solid #262626', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', marginLeft: '10px' }}>Create new post</h3>
          {file && (
            <button
              onClick={onSubmit}
              disabled={loading}
              style={{
                color: '#0095f6',
                fontWeight: '600',
                fontSize: '14px',
                background: 'none',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Sharing...' : 'Share'}
            </button>
          )}
        </div>

        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '300px', justifyContent: 'center' }}>
          
          {preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                style={{ width: '100%', borderRadius: '4px', maxHeight: '400px', objectFit: 'contain', marginBottom: '10px' }}
              />
              <textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                required
                style={{
                  width: '100%',
                  border: 'none',
                  resize: 'none',
                  height: '60px',
                  fontSize: '14px',
                  marginTop: '10px',
                  fontFamily: 'inherit',
                  color: '#fff',
                  background: 'transparent',
                  outline: 'none',
                }}
              />
              <label htmlFor="file-upload" style={{ color: '#0095f6', cursor: 'pointer', fontSize: '12px', fontWeight: '600', marginTop: '10px' }}>
                Change image
              </label>
            </>
          ) : (
            <>
              <svg aria-label="Media icon" color="currentColor" fill="currentColor" height="77" role="img" viewBox="0 0 97.6 77.3" width="96" style={{ marginBottom: '20px' }}>
                <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" />
                <path d="M84.7 18.4L58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.9.3L7 45.5c-1.7-3.5-1.5-7.5.9-10.7l.6-1.1L8.3 32 7.2 17.2c-.3-2.1.2-4.3 1-6.4zM58.6 60.5c-.3 5.7-5.2 10.1-11 9.8l-34-1.9c-2.2-.1-4.2-1.1-5.7-2.7L25 48.2l7.1 6.4c2.8 2.5 7.1 2.3 9.6-.4l15-16.9c.6.5 1.2 1.1 1.7 1.7l11.1 21.5c-2.3 1.8-5.3 2.7-8.3 2.5h-2.6z" />
              </svg>
              <h3 style={{ fontSize: '20px', fontWeight: 300, marginBottom: '20px' }}>Drag photos and videos here</h3>
              <label htmlFor="file-upload" className="primary-btn" style={{ width: 'auto', display: 'inline-block', padding: '5px 9px', fontSize: '14px' }}>
                Select from computer
              </label>
            </>
          )}

          <input id="file-upload" type="file" onChange={handleFileChange} required style={{ display: 'none' }} />
        </div>
      </div>
    </div>
  );
}

export default CreatePost;
