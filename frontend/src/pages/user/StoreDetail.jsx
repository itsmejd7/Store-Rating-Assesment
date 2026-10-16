import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getStoreById } from '../../api/storeApi.js';
import { createRating, updateRating } from '../../api/ratingApi.js';
import StarRating from '../../components/StarRating.jsx';

export default function StoreDetail() {
  const { id } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedValue, setSelectedValue] = useState(0);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  const fetchStore = () => {
    setLoading(true);
    getStoreById(id)
      .then((res) => {
        setStore(res.data);
        setSelectedValue(res.data.my_rating || 0);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load store information.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchStore();
  }, [id]);

  const handleSubmitRating = async () => {
    if (!selectedValue) {
      setRatingError('Please select a star rating from 1 to 5.');
      return;
    }
    setRatingError('');
    setRatingSuccess('');
    setRatingLoading(true);
    try {
      if (store.my_rating_id) {
        await updateRating(store.my_rating_id, { value: selectedValue });
        setRatingSuccess('Your rating was successfully updated!');
      } else {
        await createRating({ store_id: parseInt(id, 10), value: selectedValue });
        setRatingSuccess('Your rating was successfully submitted!');
      }
      fetchStore();
    } catch (err) {
      setRatingError(err.response?.data?.error || 'Failed to save rating.');
    } finally {
      setRatingLoading(false);
    }
  };

  if (loading) return <p className="text-muted">Loading store details...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;
  if (!store) return null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{store.name}</h1>
          <p>Store profile and rating submission</p>
        </div>
        <Link className="btn btn-outline" to="/stores">← Back to Stores</Link>
      </div>

      <div className="card mb-4">
        <div className="card-title">Store Details</div>
        <div className="detail-grid">
          <div className="detail-item">
            <label>Store Email</label>
            <span>{store.email}</span>
          </div>
          <div className="detail-item">
            <label>Location / Address</label>
            <span>{store.address || <span className="text-muted">No address provided</span>}</span>
          </div>
          <div className="detail-item">
            <label>Average Rating</label>
            <div className="flex items-center gap-1">
              <StarRating value={Math.round(store.avg_rating)} readOnly />
              <span style={{ fontWeight: 600 }}>{store.avg_rating}</span>
              <span className="text-muted" style={{ fontSize: '12px' }}>
                ({store.rating_count} {store.rating_count === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div className="card-title">
          {store.my_rating != null ? 'Update Your Rating' : 'Submit a Rating'}
        </div>

        {ratingSuccess && <div className="alert alert-success">{ratingSuccess}</div>}
        {ratingError   && <div className="alert alert-error">{ratingError}</div>}

        {store.my_rating != null && (
          <p className="text-muted mb-3">
            You previously rated this store: <strong>{store.my_rating} out of 5 stars</strong>.
          </p>
        )}

        <div className="form-group mb-3">
          <label>Select Rating (1 to 5 Stars):</label>
          <div className="flex items-center gap-3 mt-1">
            <StarRating
              value={selectedValue}
              onChange={(v) => {
                setSelectedValue(v);
                setRatingError('');
              }}
            />
            {selectedValue > 0 && (
              <span style={{ fontWeight: 600, color: '#f59e0b' }}>
                {selectedValue} of 5 Stars
              </span>
            )}
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSubmitRating}
          disabled={ratingLoading || selectedValue === 0}
        >
          {ratingLoading
            ? 'Saving...'
            : store.my_rating != null
            ? 'Update Rating'
            : 'Submit Rating'}
        </button>
      </div>
    </div>
  );
}
