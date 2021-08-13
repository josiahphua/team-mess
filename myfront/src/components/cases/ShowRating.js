import React from 'react';
import Rating from '@material-ui/lab/Rating';

function ShowRating({issue}) {

    return (
        <div>
            <Rating name="read-only" value={issue.rating} size="large" readOnly />
        </div>
    );
}

export default ShowRating;








