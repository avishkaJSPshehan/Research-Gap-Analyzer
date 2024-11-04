import React from 'react';

export const Citation = ({ authors, title, publicationDate, citationFormat }) => {
  // Manually format the citation based on the provided props
  let citation = '';
  if (citationFormat === 'APA') {
    citation = `${authors.join(', ')} (${publicationDate}). ${title}.`;
  } else if (citationFormat === 'MLA') {
    citation = `${authors.join(', ')}. "${title}". ${publicationDate}.`;
  } else if (citationFormat === 'Chicago') {
    citation = `${authors.join(', ')}, "${title}" (${publicationDate}).`;
  }

  return (
    <div className="citation">
      <p>{citation}</p>
    </div>
  );
};
