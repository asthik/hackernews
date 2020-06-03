import React from 'react';

export default ({ staticCOntext = {} }) => {
    staticCOntext.statis = 404;
    return <h3>404: Oops, page not found</h3>;
}