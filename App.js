import React, { useState } from 'react';

const App = () => {
  const [histogramData, setHistogramData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://www.terriblytinytales.com/test.txt');
      const text = await response.text();
      const wordFrequency = countWordFrequency(text);
      const sortedData = sortWordFrequency(wordFrequency);
      const top20Words = sortedData.slice(0, 20);
      setHistogramData(top20Words);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setIsLoading(false);
  };

  const countWordFrequency = (text) => {
    const words = text.split(/\s+/);
    const wordFrequency = {};
    for (let word of words) {
      wordFrequency[word] = (wordFrequency[word] || 0) + 1;
    }
    return wordFrequency;
  };

  const sortWordFrequency = (wordFrequency) => {
    const sortedWords = Object.keys(wordFrequency).sort(
      (a, b) => wordFrequency[b] - wordFrequency[a]
    );
    return sortedWords.map((word) => ({
      word,
      frequency: wordFrequency[word],
    }));
  };

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Word,Frequency\n';
    histogramData.forEach((data) => {
      csvContent += `${data.word},${data.frequency}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'histogram.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Submit'}
      </button>
      {histogramData.length > 0 && (
        <>
          <h2>Histogram</h2>
          <div>
            {histogramData.map((data) => (
              <div key={data.word}>
                {data.word}: {data.frequency}
              </div>
            ))}
          </div>
          <button onClick={exportCSV}>Export</button>
        </>
      )}
    </div>
  );
};

export default App;
